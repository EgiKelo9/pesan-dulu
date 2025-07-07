<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Menu;
use App\Models\Order;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class GuestController extends Controller
{
    public $slug;
    /**
     * Display the specified resource.
     *
     * @param  string  $slug
     * @return \Illuminate\Http\Response
     */
    public function tampilkanWarung($slug)
    {
        // $exceptions = ['login', 'register', 'logout'];
        // if (in_array($slug, $exceptions)) {
        //     return redirect()->route($slug);
        // }
        // $tenant = session()->get('tenant', []);
        // dd($tenant);

        
        $tenant = Tenant::where('tautan', '/'. $slug)->first();
        if (!$tenant) {
            abort(404);
        }
        
        if ($this->slug) {
            if ($this->slug !== $slug) {
                // Jika slug berubah, reset cart
                session()->forget('cart', 'tenant');
                $this->slug = $slug;
                session(['tenant' => $this->slug]);
            }
        }else {
            // dd($slug);
            $this->slug = $slug;
            session(['tenant' => $this->slug]);
        }
        // var_dump($this->slug);    

        // Ambil semua kategori milik tenant tersebut
        $categories = Category::where('tenant_id', $tenant->id)->with(['menus' => function ($query) use ($tenant) {
            $query->where('tenant_id', $tenant->id)->orderBy('created_at', 'desc');
        }])->get();
        
        $cart = session()->get('cart', []);
        
        // var_dump($cart);

        return Inertia::render('Order', [
            'tenant' => $tenant,
            'categories' => $categories,
            'cart' => $cart
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

        // return redirect()->back();
        // return redirect()->route(`{$this->slug}`)->with('success', "Pesanan berhasil ditambahkan ke keranjang!");
        return redirect()->back()->with('message', 'Item berhasil ditambahkan ke keranjang!');
        // dd(session()->get('cart', []));

        // return response()->json([
        //     'message' => 'Item berhasil ditambahkan ke keranjang!',
        //     'cart' => session()->get('cart', []),
        // ], 200);
    }

    public function cart() {
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
        // get data pelanggan dari session
        $pelanggan = session()->get('pelanggan', []);

        // Ambil tenant dari session
        $tenantSlug = session()->get('tenant');
        $tenant = Tenant::where('tautan', '/' . $tenantSlug)->first();
        if (!$tenant) {
            return redirect()->route('home')->withErrors(['error' => 'Warung tidak ditemukan.']);
        }
        
        // Ambil data cart dari session
        $cart = session()->get('cart', []);
        if (empty($cart)) {
            return redirect()->route('home')->with('message', 'Keranjang Anda kosong. Silakan tambahkan item terlebih dahulu.');
        }

        // ngambil harga total dari cart
        $totalHarga = 0;
        foreach ($cart as $item) {
            $menu = Menu::find($item['menu_id']);
            if ($menu) {
                $totalHarga += $menu->harga * $item['jumlah'];
            }
        }

        $pelanggan = session()->get('pelanggan', []);
        try {
            $imagePath = null;
            if ($request->hasFile('bukti_pembayaran')) {
                $file = $request->file('bukti_pembayaran');
                $filename = time() . '_' . $file->getClientOriginalName();

                // Save to storage
                $path = 'bukti_pembayaran/' . $filename;
                Storage::disk('public')->put($path, $file->getContent());
                $imagePath = $path;
            }

            // Simpan order ke database
            $order = Order::create([
                'tanggal_pesanan' => now(),
                'nama' => $pelanggan['nama'],
                'telepon' => $pelanggan['nomor_hp'],
                'waktu_diambil' => $pelanggan['waktu_pengambilan'],
                'status' => 'menunggu',
                'total_harga' => $totalHarga+ 200,
                'bukti_pembayaran' => $imagePath,
                'tenant_id' => $tenant->id,
            ]);


            // Tambahkan item ke order
            // foreach ($cart as $item) {
            //     $menu = Menu::find($item['menu_id']);
            //     if ($menu && $item['jumlah'] > 0) {
            //         // dd($menu , $item);
            //         // \Log::info('Akan attach menu', ['menu_id' => $menu->id], $menu, $item);
            //         // $order->menus()->attach($menu->id, [
            //         //     'jumlah' => $item['jumlah'],
            //         //     'harga_satuan' => $menu->harga,
            //         //     'total_harga' => $menu->harga * $item['jumlah'],
            //         //     'catatan' => $item['catatan'],
            //         // ]);
            //         // \DB::table('order_menu')->insert([
            //         //     'order_id' => $order->id,
            //         //     'menu_id' => $menu->id,
            //         //     'jumlah' => $item['jumlah'],
            //         //     'harga_satuan' => $menu->harga,
            //         //     'total_harga' => $menu->harga * $item['jumlah'],
            //         //     'catatan' => $item['catatan'],
            //         //     'created_at' => now(),
            //         //     'updated_at' => now(),
            //         // ]);
            //         $order->addOrderMenu($menu->id, $item['jumlah'], $menu->harga, $item['catatan']);
            //         // dd($order->menus);
            //         // \Log::info('Isi order_menu:', \DB::table('order_menu')->get()->toArray());
            //         \Log::info('Menu berhasil ditambahkan ke order', ['menu_id' => $menu->id]);
            //     } else {
            //         \Log::error('Menu tidak ditemukan', ['menu_id' => $item['menu_id']]);
            //         throw ValidationException::withMessages(['cart' => 'Menu tidak ditemukan dalam keranjang.']);
            //     }
            // }
            \Log::info('DEBUG: Mulai proses attach menu ke order', [
                'order_id' => $order->id,
                'cart' => $cart
            ]);
            foreach ($cart as $item) {
                $menu = Menu::find($item['menu_id']);
                \Log::info('DEBUG: Cek menu', [
                    'menu_id' => $item['menu_id'],
                    'menu_found' => $menu ? true : false,
                    'item' => $item
                ]);
                if ($menu && $item['jumlah'] > 0) {
                    \Log::info('DEBUG: Akan attach menu ke order', [
                        'order_id' => $order->id,
                        'menu_id' => $menu->id,
                        'jumlah' => $item['jumlah'],
                        'harga_satuan' => $menu->harga,
                        'total_harga' => $menu->harga * $item['jumlah'],
                        'catatan' => $item['catatan']
                    ]);
                    $order->addOrderMenu($menu->id, $item['jumlah'], $menu->harga, $item['catatan']);
                    \Log::info('DEBUG: Menu berhasil ditambahkan ke order', [
                        'order_id' => $order->id,
                        'menu_id' => $menu->id
                    ]);
                    // Cek isi order_menu setelah insert
                    $orderMenus = \DB::table('order_menu')->where('order_id', $order->id)->get();
                    \Log::info('DEBUG: Isi order_menu setelah insert', [
                        'order_id' => $order->id,
                        'order_menu' => $orderMenus
                    ]);
                } else {
                    \Log::error('DEBUG: Menu tidak ditemukan atau jumlah <= 0', [
                        'menu_id' => $item['menu_id'],
                        'item' => $item
                    ]);
                    throw ValidationException::withMessages(['cart' => 'Menu tidak ditemukan dalam keranjang.']);
                }
            }

            cookie()->queue('cart', json_encode($cart), 60 * 24 * 7); // 1 minggu
            cookie()->queue('tenant', $tenantSlug, 60 * 24 * 7);
            cookie()->queue('pelanggan', json_encode($pelanggan), 60 * 24 * 7);

            // Simpan id_order ke session
            session(['order_id' => $order->id]);
            // dd(session('order_id'));

            // Hapus cart dari session
            session()->forget('cart');
            session()->forget('pelanggan');
            
            return redirect()->route('pantauPesanan', [], 303);
        } catch (\Throwable $th) {
            //throw $th;
        }
        
    }

    public function pantauPesanan()
    {
        // Cek apakah ada order_id di session
        $id_order = session()->get('order_id', []);
        if (empty($id_order)) {
            dd($id_order);
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

        // dd($order);
        return Inertia::render('MonitorOrder', [
            'order' => $order,
        ]);
    }

}
/* 
nama dan tanggal now() ada kemungkinan sehari mesen dua kali 


*/
