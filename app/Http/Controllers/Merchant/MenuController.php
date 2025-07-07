<?php

namespace App\Http\Controllers\Merchant;

use App\Models\Menu;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class MenuController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tenant = auth('web')->user()->tenant;
        if (!$tenant) {
            return redirect()->route('merchant.tenant.create')->with('warning', 'Silakan buat warung terlebih dahulu.');
        }
        $menus = $tenant->menus()->orderBy('created_at', 'desc')->get();
        
        $menus->each(function ($menu) {
            $menu->category_id = $menu->category->nama;
        });
        return Inertia::render('merchant/menu/menu-index', [
            'menus' => $menus,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $tenant = auth('web')->user()->tenant;
        if (!$tenant) {
            return redirect()->route('merchant.tenant.create')->with('warning', 'Silakan buat warung terlebih dahulu.');
        }
        $categories = $tenant->categories()->get();
        return Inertia::render('merchant/menu/menu-create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:100',
            'status' => 'required|in:tersedia,tidak tersedia',
            'harga' => 'required|numeric|min:1',
            'deskripsi' => 'required|string|max:500',
            'foto' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
            'category_id' => 'required|exists:categories,id',
        ], [
            'nama.required' => 'Nama menu harus diisi.',
            'nama.max' => 'Nama menu tidak boleh lebih dari :max karakter.',
            'status.required' => 'Status menu harus dipilih.',
            'status.in' => 'Status menu harus berupa "tersedia" atau "tidak tersedia".',
            'harga.required' => 'Harga menu harus diisi.',
            'harga.numeric' => 'Harga harus berupa angka.',
            'harga.min' => 'Harga harus lebih dari 0.',
            'foto.required' => 'Foto menu harus diunggah.',
            'foto.image' => 'File yang diunggah harus berupa gambar.',
            'foto.mimes' => 'Foto harus berupa file dengan ekstensi jpg, jpeg, png, atau webp.',
            'foto.max' => 'Foto tidak boleh lebih dari 2 MB.',
            'deskripsi.required' => 'Deskripsi menu harus diisi.',
            'deskripsi.max' => 'Deskripsi tidak boleh lebih dari :max karakter.',
            'category_id.required' => 'Kategori harus dipilih.',
            'category_id.exists' => 'Kategori yang dipilih tidak valid.',
        ]);

        try {
            $existingMenu = auth('web')->user()->tenant->menus()->where('nama', $request->nama)->first();
            if ($existingMenu) {
                return back()->withErrors(['nama' => 'Menu dengan nama ini sudah ada.'])->withInput();
            }

            $imagePath = null;
            if ($request->hasFile('foto')) {
                $file = $request->file('foto');
                $filename = time() . '_' . $file->getClientOriginalName();

                // Save to storage
                $path = 'menu/' . $filename;
                Storage::disk('public')->put($path, $file->getContent());
                $imagePath = $path;
            }
            $menu = Menu::create([
                'nama' => $request->nama,
                'status' => $request->status,
                'harga' => $request->harga,
                'deskripsi' => $request->deskripsi,
                'foto' => $imagePath,
                'category_id' => $request->category_id,
                'tenant_id' => auth('web')->user()->tenant->id,
            ]);

            session()->flash('success', "Menu {$menu->nama} berhasil ditambahkan.");
            return redirect()->route('merchant.menu.show', $menu->id)->with('success', "Menu {$menu->nama} berhasil ditambahkan.");
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $tenant = auth('web')->user()->tenant;
        if (!$tenant) {
            return redirect()->route('merchant.tenant.create')->with('warning', 'Silakan buat warung terlebih dahulu.');
        }
        $menu = $tenant->menus()->findOrFail($id);
        $menu->category_id = $menu->category->nama;
        return Inertia::render('merchant/menu/menu-show', [
            'menu' => $menu,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $tenant = auth('web')->user()->tenant;
        if (!$tenant) {
            return redirect()->route('merchant.tenant.create')->with('warning', 'Silakan buat warung terlebih dahulu.');
        }
        $menu = $tenant->menus()->findOrFail($id);
        $categories = $tenant->categories()->get();
        return Inertia::render('merchant/menu/menu-edit', [
            'categories' => $categories,
            'menu' => $menu,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'nama' => 'required|string|max:100',
            'status' => 'required|in:tersedia,tidak tersedia',
            'harga' => 'required|numeric|min:1',
            'deskripsi' => 'required|string|max:500',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'category_id' => 'required|exists:categories,id',
        ], [
            'nama.required' => 'Nama menu harus diisi.',
            'nama.max' => 'Nama menu tidak boleh lebih dari :max karakter.',
            'status.required' => 'Status menu harus dipilih.',
            'status.in' => 'Status menu harus berupa "tersedia" atau "tidak tersedia".',
            'harga.required' => 'Harga menu harus diisi.',
            'harga.numeric' => 'Harga harus berupa angka.',
            'harga.min' => 'Harga harus lebih dari 0.',
            'foto.image' => 'File yang diunggah harus berupa gambar.',
            'foto.mimes' => 'Foto harus berupa file dengan ekstensi jpg, jpeg, png, atau webp.',
            'foto.max' => 'Foto tidak boleh lebih dari 2 MB.',
            'deskripsi.required' => 'Deskripsi menu harus diisi.',
            'deskripsi.max' => 'Deskripsi tidak boleh lebih dari :max karakter.',
            'category_id.required' => 'Kategori harus dipilih.',
            'category_id.exists' => 'Kategori yang dipilih tidak valid.',
        ]);

        try {
            $tenant = auth('web')->user()->tenant;
            $menu = $tenant->menus()->findOrFail($id);
            $existingMenu = $tenant->menus()
                ->where('nama', $request->nama)
                ->where('id', '!=', $id)
                ->first();
            if ($existingMenu) {
                return back()->withErrors(['nama' => 'Menu dengan nama ini sudah ada.'])->withInput();
            }

            $imagePath = $menu->foto;
            if ($request->hasFile('foto')) {
                // Delete old image if exists
                if ($imagePath && Storage::disk('public')->exists($imagePath)) {
                    Storage::disk('public')->delete($imagePath);
                }
                $file = $request->file('foto');
                $filename = time() . '_' . $file->getClientOriginalName();
                // Save new image
                $path = 'menu/' . $filename;
                Storage::disk('public')->putFileAs('menu', $file, $filename);
                $imagePath = $path;
            }

            $menu->update([
                'nama' => $request->nama,
                'status' => $request->status,
                'harga' => $request->harga,
                'deskripsi' => $request->deskripsi,
                'foto' => $imagePath,
                'category_id' => $request->category_id,
            ]);

            return redirect()->route('merchant.menu.show', $menu->id)->with('success', "Menu {$menu->nama} berhasil diperbarui.");
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);   
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $tenant = auth('web')->user()->tenant;
            if (!$tenant) {
                return redirect()->route('merchant.tenant.create')->with('warning', 'Silakan buat warung terlebih dahulu.');
            }
            $menu = $tenant->menus()->findOrFail($id);
            // Delete the image if it exists
            if ($menu->foto && Storage::disk('public')->exists($menu->foto)) {
                Storage::disk('public')->delete($menu->foto);
            }
            $menu->delete();
            return redirect()->route('merchant.menu.index')->with('success', "Menu {$menu->nama} berhasil dihapus.");
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat menghapus menu.']);
        }
    }

    /**
     * Update status field based on toggle switch.
     */
    public function updateStatus(Request $request, string $id)
    {
        $tenant = auth('web')->user()->tenant;
        if (!$tenant) {
            return redirect()->route('merchant.tenant.create')->with('warning', 'Silakan buat warung terlebih dahulu.');
        }
        $menu = auth('web')->user()->tenant->menus()->findOrFail($id);
        $request->validate([
            'status' => 'required|in:tersedia,tidak tersedia'
        ]);
        $menu->update([
            'status' => $request->status
        ]);
        return redirect()->route('merchant.menu.index')->with('success', "Status menu {$menu->nama} berhasil diperbarui.");
    }
}
