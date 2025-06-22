<?php

namespace App\Http\Controllers\Merchant;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Category;
use Inertia\Inertia;

class CategoryController extends Controller
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
        $categories = $tenant->categories()->orderBy('created_at', 'desc')->get();
        return Inertia::render('merchant/category/category-index', [
            'categories' => $categories,
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
        return Inertia::render('merchant/category/category-create', [
            'tenant' => $tenant,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:50',
            'deskripsi' => 'required|string|max:500',
        ], [
            'nama.required' => 'Nama kategori harus diisi.',
            'nama.max' => 'Nama kategori tidak boleh lebih dari :max karakter.',
            'deskripsi.required' => 'Deskripsi kategori harus diisi.',
            'deskripsi.max' => 'Deskripsi tidak boleh lebih dari :max karakter.',
        ]);

        try {
            $tenant = auth('web')->user()->tenant;
            // Check if the category already exists
            $existingCategory = $tenant->categories()->where('nama', $request->nama)->first();
            if ($existingCategory) {
                return back()->withErrors(['nama' => 'Kategori dengan nama ini sudah ada.'])->withInput();
            }

            // Create the new category
            $category = Category::create([
                'nama' => $request->nama,
                'deskripsi' => $request->deskripsi,
                'tenant_id' => $tenant->id,
            ]);

            return redirect()->route('merchant.category.show', $category->id)->with('success', 'Kategori berhasil dibuat.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Terjadi kesalahan saat membuat kategori.'])->withInput();
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
        $category = $tenant->categories()->findOrFail($id);
        return Inertia::render('merchant/category/category-show', [
            'category' => $category,
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
        $category = $tenant->categories()->findOrFail($id);
        return Inertia::render('merchant/category/category-edit', [
            'category' => $category,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'nama' => 'required|string|max:50',
            'deskripsi' => 'required|string|max:500',
        ], [
            'nama.required' => 'Nama kategori harus diisi.',
            'nama.max' => 'Nama kategori tidak boleh lebih dari :max karakter.',
            'deskripsi.required' => 'Deskripsi kategori harus diisi.',
            'deskripsi.max' => 'Deskripsi tidak boleh lebih dari :max karakter.',
        ]);

        try {
            $tenant = auth('web')->user()->tenant;
            $existingCategory = $tenant->categories()->where('nama', $request->nama)->first();
            if ($existingCategory) {
                return back()->withErrors(['nama' => 'Kategori dengan nama ini sudah ada.'])->withInput();
            }
            
            // Find the category that belongs to the current tenant
            $category = $tenant->categories()->findOrFail($id);
            
            // Update the category with new data
            $category->update([
                'nama' => $request->nama,
                'deskripsi' => $request->deskripsi,
            ]);

            return redirect()->back()->with('success', 'Kategori berhasil diperbarui.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Terjadi kesalahan saat memperbarui kategori.'])->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $category = auth('web')->user()->tenant->categories()->findOrFail($id);
            $category->delete();
            return redirect()->route('merchant.category.index')->with('success', 'Kategori berhasil dihapus.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Terjadi kesalahan saat menghapus kategori.']);
        }
    }
}
