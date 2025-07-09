<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use App\Models\Category;
use App\Models\Report;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Menu;
use App\Models\Order;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Validation\ValidationException;

class GuestController extends Controller
{
    public $slug;
    /**
     * Display the specified resource.
     *
     * @param  string  $slug
     * @return \Inertia\Response
     */
    public function tampilkanWarung($slug)
    {
        $tenant = Tenant::where('tautan', '/' . $slug)->first();
        if (!$tenant) {
            abort(404);
        }

        if ($this->slug) {
            if ($this->slug !== $slug) {
                // Jika slug berubah, reset cart
                session()->forget('cart');
                session()->forget('tenant');
                $this->slug = $slug;
                session(['tenant' => $this->slug]);
            }
        } else {
            // dd($slug);
            $this->slug = $slug;
            session(['tenant' => $this->slug]);
        }
        // var_dump($this->slug);    

        // Ambil semua kategori milik tenant tersebut
        $categories = Category::where('tenant_id', $tenant->id)->with(['menus' => function ($query) use ($tenant) {
            $query->where('tenant_id', $tenant->id)->where('status', 'tersedia')->orderBy('created_at', 'desc');
        }])->get();

        $cart = session()->get('cart', []);

        $orderIds = json_decode(Cookie::get('order_ids', '[]'), true);
        if (!is_array($orderIds)) {
            $orderIds = [];
        }

        $riwayatOrders = Order::with(['tenant', 'menus'])
            ->whereIn('id', $orderIds)
            ->get()
            ->map(function ($o) {
                return [
                    'id' => $o->id,
                    'tenant' => $o->tenant ? $o->tenant->nama : '-',
                    'total_harga' => $o->total_harga,
                    'jumlah_item' => $o->menus->count(),
                    'tanggal_pesanan' => $o->tanggal_pesanan,
                    'status' => $o->status,
                ];
            });

        return Inertia::render('Order', [
            'tenant' => $tenant,
            'categories' => $categories,
            'cart' => $cart,
            'riwayat' => $riwayatOrders,
        ]);
    }

    public function add(Request $request)
    {
        // dd($request->all());
        // Ambil data menu
        $menu = Menu::find($request->menu_id);
        if (!$menu) {
            return response()->json(['message' => 'Menu tidak ditemukan'], 404);
        }

        // Buat item baru
        $item = [
            'menu_id' => $menu->id,
            'nama' => $menu->nama,
            'jumlah' => $request->jumlah,
            'catatan' => $request->catatan,
        ];

        // Ambil cart dari session
        $cart = session()->get('cart', []);

        // Tambahkan sebagai item baru (walaupun menu_id sama)
        $cart[] = $item;

        // Simpan ke session
        session(['cart' => $cart, 'tenant' => $this->slug]);
        return redirect()->back()->with('message', 'Item berhasil ditambahkan ke keranjang!');
    }

    public function cart()
    {
        $cart = session()->get('cart', []);
        $tenant = session()->get('tenant');
        // dd($cart);

        if (empty($cart)) {
            return redirect()->route('home')->with('message', 'Keranjang Anda kosong. Silakan tambahkan item terlebih dahulu.');
        }

        // Ambil gambar untuk setiap item di cart
        foreach ($cart as &$item) {
            $menu = Menu::find($item['menu_id']);
            $item['foto'] = $menu ? $menu->foto : null;
            $item['harga'] = $menu ? $menu->harga : 0;
        }
        unset($item); // Hindari referensi variabel
        // dd($cart);

        return Inertia::render('Cart', [
            'cart' => $cart,
            'tenant' => $tenant,
        ]);
    }

    public function updateCart(request $request)
    {
        // dd($request->all());
        $cart = session()->get('cart', []);
        $cart[$request->index]['jumlah'] = $request->jumlah;
        $cart[$request->index]['catatan'] = $request->catatan;
        // dd($cart[$request->index]);
        session(['cart' => $cart]);
        // dd(session()->get('cart', []));
        return redirect()->back()->with('message', 'Keranjang berhasil diperbarui!');
    }

    public function checkout(Request $request)
    {
        // Validasi input
        $request->validate([
            'nama_pelanggan' => 'required|string|max:255',
            'nomor_hp' => 'required|string|max:15',
            'waktu_pengambilan' => 'required',
        ]);

        // Ambil data cart dari session
        $cart = session()->get('cart', []);
        if (empty($cart)) {
            return redirect()->route('home')->with('message', 'Keranjang Anda kosong. Silakan tambahkan item terlebih dahulu.');
        }

        // Ambil tenant dari session
        $tenantSlug = session()->get('tenant');
        $tenant = Tenant::where('tautan', '/' . $tenantSlug)->first();
        if (!$tenant) {
            return redirect()->route('home')->withErrors(['error' => 'Warung tidak ditemukan.']);
        }
        $pelanggan = session()->get('pelanggan', []);
        $pelanggan['nama'] = $request->nama_pelanggan;
        $pelanggan['nomor_hp'] = $request->nomor_hp;
        $pelanggan['waktu_pengambilan'] = $request->waktu_pengambilan;
        session(['pelanggan' => $pelanggan]);
        // $cart['total_bayar'] = $request->total_bayar;


        return redirect()->route('payment.show', [], 303);
    }

    public function showPayment()
    {
        // dd(session()->all());
        $cart = session()->get('cart', []);
        $tenantSlug = session()->get('tenant');
        $tenant = Tenant::where('tautan', '/' . $tenantSlug)->first();
        $pelanggan = session()->get('pelanggan', []);
        if (empty($cart) || empty($tenant) || empty($pelanggan)) {
            return redirect()->route('home')->with('message', 'Keranjang Anda kosong. Silakan tambahkan item terlebih dahulu.');
        }

        return Inertia::render('Payment', [
            'cart' => $cart,
            'tenant' => $tenant,
            'pelanggan' => $pelanggan,
        ]);
    }

    public function konfirmasiPembayaran(Request $request)
    {
        try {
            // Validate the request
            $request->validate([
                'bukti_pembayaran' => 'required|image|mimes:jpeg,jpg,png|max:10240', // Max 10MB
            ]);

            // Get data pelanggan dari session
            $pelanggan = session()->get('pelanggan', []);
            if (empty($pelanggan)) {
                return redirect()->route('home')->withErrors(['error' => 'Data pelanggan tidak ditemukan.']);
            }

            // Ambil tenant dari session
            $tenantSlug = session()->get('tenant');
            $tenant = Tenant::where('tautan', '/' . $tenantSlug)->first();
            if (!$tenant) {
                return redirect()->route('home')->withErrors(['error' => 'Warung tidak ditemukan.']);
            }

            // Ambil data cart dari session
            $cart = session()->get('cart', []);
            if (empty($cart)) {
                return redirect()->route('home')->withErrors(['error' => 'Keranjang Anda kosong.']);
            }

            // Calculate total harga dari cart
            $totalHarga = 0;
            foreach ($cart as $item) {
                $menu = Menu::find($item['menu_id']);
                if ($menu) {
                    $totalHarga += $menu->harga * $item['jumlah'];
                }
            }

            // Handle file upload - THIS IS THE FIX
            $imagePath = null;
            if ($request->hasFile('bukti_pembayaran')) {
                $file = $request->file('bukti_pembayaran');
                $filename = time() . '_' . $file->getClientOriginalName();
                
                // Use the correct method for file storage
                $path = 'bukti_pembayaran/' . $filename;
                Storage::disk('public')->put($path, file_get_contents($file));
                $imagePath = $path;
            }

            // Simpan order ke database
            $order = Order::create([
                'tanggal_pesanan' => now(),
                'nama' => $pelanggan['nama'],
                'telepon' => $pelanggan['nomor_hp'],
                'waktu_diambil' => $pelanggan['waktu_pengambilan'],
                'status' => 'menunggu',
                'total_harga' => $totalHarga + 200, // Add service fee
                'bukti_pembayaran' => $imagePath,
                'tenant_id' => $tenant->id,
            ]);

            // Add items to order - FIX THE ORDER MENU CREATION
            foreach ($cart as $item) {
                $menu = Menu::find($item['menu_id']);
                if ($menu) {
                    $order->menus()->attach($menu->id, [
                        'jumlah' => $item['jumlah'],
                        'harga_satuan' => $menu->harga,
                        'total_harga' => $menu->harga * $item['jumlah'],
                        'catatan' => $item['catatan'],
                    ]);
                } else {
                    throw ValidationException::withMessages(['cart' => 'Menu tidak ditemukan dalam keranjang.']);
                }
            }

            // Save to cookies for tracking
            cookie()->queue('cart', json_encode($cart), 60 * 24 * 7); // 1 week
            cookie()->queue('tenant', $tenantSlug, 60 * 24 * 7);
            cookie()->queue('pelanggan', json_encode($pelanggan), 60 * 24 * 7);

            // Save order ID to cookies
            $existingOrders = json_decode(Cookie::get('order_ids', '[]'), true);
            $existingOrders[] = $order->id;
            Cookie::queue('order_ids', json_encode($existingOrders), 60 * 24 * 30);

            // Clear session data
            session()->forget(['cart', 'pelanggan']);
            
            return redirect()->route('pantauPesanan', ['id_order' => $order->id])->with('success', 'Pembayaran berhasil dikonfirmasi!');

        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Throwable $th) {
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.'])->withInput();
        }
    }

    public function deleteItemCart(Request $request)
    {
        // Validate the request
        $request->validate([
            'index' => 'required|integer|min:0'
        ]);

        $cart = session()->get('cart', []);

        // Validate that the index exists
        if (!isset($cart[$request->index])) {
            return redirect()->back()->withErrors(['error' => 'Item tidak ditemukan di keranjang.']);
        }

        // Remove the item from cart array
        unset($cart[$request->index]);

        // Re-index the array to maintain proper indexing
        $cart = array_values($cart);

        // Update session
        session(['cart' => $cart]);

        return redirect()->back()->with('message', 'Item berhasil dihapus dari keranjang!');
    }

    public function pantauPesanan($id_order)
    {
        // Cek apakah ada order_id di session
        // $id_order = 12;
        $orderIds = json_decode(Cookie::get('order_ids', '[]'), true);
        // var_dump($orderIds);
        // $id_order = session()->get('order_id', []);
        if (!is_array($orderIds)) {
            $orderIds = [];
        }

        if (!in_array($id_order, $orderIds)) {
            return redirect()->route('home')->with('message', 'Maaf Id order tidak ditemukan');
        }

        if (empty($id_order)) {
            return redirect()->route('home')->with('message', 'Tidak ada pesanan yang sedang dipantau.');
        }
        // Ambil order berdasarkan id_order
        $order = Order::find($id_order);
        // dd($id_order, $order);
        if (!$order) {
            dd($order);
            return redirect()->route('home')->with('message', 'Pesanan tidak ditemukan.');
        }

        $orderMenus = $order->menus()->withPivot(['jumlah', 'harga_satuan', 'total_harga', 'catatan'])->get();
        $order->order_menus = $orderMenus;

        $riwayatOrders = Order::with(['tenant', 'menus'])
            ->whereIn('id', $orderIds)
            ->get()
            ->map(function ($o) {
                return [
                    'id' => $o->id,
                    'tenant' => $o->tenant ? $o->tenant->nama : '-',
                    'total_harga' => $o->total_harga,
                    'jumlah_item' => $o->menus->count(),
                    'tanggal_pesanan' => $o->tanggal_pesanan,
                    'status' => $o->status,
                ];
            });

        // dd($order);
        return Inertia::render('MonitorOrder', [
            'order' => $order,
            'riwayat' => $riwayatOrders,
        ]);
    }

    public function buatLaporan($id_order, Request $request)
    {
        // Decode JSON payload
        $data = json_decode($request->getContent(), true);

        // Validasi data minimal
        if (!$data || !isset($data['categories'])) {
            return response()->json(['error' => 'Invalid data'], 400);
        }

        // Simpan ke database
        $report = Report::create([
            'order_id' => $id_order,
            'categories' => json_encode($data['categories']),
            'reason' => $data['reason'] ?? '',
        ]);
        return redirect()->back()->with('success', 'Laporan berhasil dibuat!');
    }

    public function home(){
        // Ambil semua tenant
        $tenants = Tenant::select('nama', 'jam_buka', 'jam_tutup', 'tautan')->get();

        // dd($tenants);
        return Inertia::render('welcome', [
            'tenants' => $tenants,
        ]);
    }

}
