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
     * @return \Inertia\Response
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
                session()->forget('cart');
                session()->forget('tenant');
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
        dd(session()->all());
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
            foreach ($cart as $item) {
                $menu = Menu::find($item['menu_id']);
                if ($menu) {
                    // dd($menu);
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

            cookie()->queue('cart', json_encode($cart), 60 * 24 * 7); // 1 minggu
            cookie()->queue('tenant', $tenantSlug, 60 * 24 * 7);
            cookie()->queue('pelanggan', json_encode($pelanggan), 60 * 24 * 7);

            // Hapus cart dari session
            session()->forget('cart');
            session()->forget('pelanggan');
            
            return redirect()->route('pantauPesanan', [], 303);
        } catch (\Throwable $th) {
            //throw $th;
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

    public function pantauPesanan()
    {

    }

}
/* 
nama dan tanggal now() ada kemungkinan sehari mesen dua kali 


*/
