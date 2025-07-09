<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\Tenant;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

class TenantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/tenant/tenant-index', [
            'tenants' => Tenant::with('user')->orderBy('created_at', 'desc')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $users = User::where('role', 'merchant')->whereDoesntHave('tenant')->get();
        return Inertia::render('admin/tenant/tenant-create', [
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:50|unique:tenants,nama',
            'telepon' => 'required|string|max:15',
            'alamat' => 'required|string|max:255',
            'qris' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
            'jam_buka' => 'required|date_format:H:i',
            'jam_tutup' => 'required|date_format:H:i|after:jam_buka',
        ], [
            'nama.required' => 'Nama warung harus diisi.',
            'nama.unique' => 'Nama warung sudah digunakan.',
            'telepon.required' => 'Telepon harus diisi.',
            'alamat.required' => 'Alamat harus diisi.',
            'qris.required' => 'QRIS harus diisi.',
            'qris.image' => 'QRIS harus berupa gambar.',
            'qris.mimes' => 'QRIS harus berformat jpeg, png, jpg, atau webp.',
            'qris.max' => 'Ukuran QRIS maksimal 2MB.',
            'jam_buka.required' => 'Jam buka harus diisi.',
            'jam_tutup.required' => 'Jam tutup harus diisi.',
            'jam_tutup.after' => 'Jam tutup harus setelah jam buka.',
        ]);

        try {
            $qrisPath = null;
            if ($request->hasFile('qris')) {
                $file = $request->file('qris');
                $filename = time() . '_' . $file->getClientOriginalName();

                // Save to storage
                $path = 'qris/' . $filename;
                Storage::disk('public')->put($path, $file->getContent());
                $qrisPath = $path;
            }
            $tenant = Tenant::create([
                'nama' => $request->nama,
                'telepon' => $request->telepon,
                'alamat' => $request->alamat,
                'qris' => $qrisPath,
                'jam_buka' => $request->jam_buka,
                'jam_tutup' => $request->jam_tutup,
                'tautan' => "/" . strtolower(str_replace(' ', '-', $request->nama)),
                'user_id' => auth('web')->user()->id,
            ]);
            return redirect()->route('admin.tenant.show', $tenant->id)->with('success', 'Warung berhasil dibuat.');
        } catch (\Exception $e) {
            return back()->withErrors('Terjadi kesalahan saat membuat warung. Silakan coba lagi.')->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $tenant = Tenant::findOrFail($id);
        return Inertia::render('admin/tenant/tenant-show', [
            'tenant' => $tenant,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $tenant = Tenant::findOrFail($id);
        return Inertia::render('admin/tenant/tenant-edit', [
            'tenant' => $tenant,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'nama' => 'required|string|max:50',
            'telepon' => 'required|string|max:15',
            'alamat' => 'required|string|max:255',
            'qris' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'jam_buka' => 'required|date_format:H:i',
            'jam_tutup' => 'required|date_format:H:i|after:jam_buka',
        ], [
            'nama.required' => 'Nama warung harus diisi.',
            'telepon.required' => 'Telepon harus diisi.',
            'alamat.required' => 'Alamat harus diisi.',
            'qris.image' => 'QRIS harus berupa gambar.',
            'qris.mimes' => 'QRIS harus berformat jpeg, png, jpg, atau webp.',
            'qris.max' => 'Ukuran QRIS maksimal 2MB.',
            'jam_buka.required' => 'Jam buka harus diisi.',
            'jam_tutup.required' => 'Jam tutup harus diisi.',
            'jam_tutup.after' => 'Jam tutup harus setelah jam buka.',
        ]);

        try {
            $tenant = Tenant::findOrFail($id);
            $existingTenant = Tenant::where('nama', $tenant->nama)->first();
            if ($existingTenant && $existingTenant->id !== $tenant->id) {
                return back()->withErrors(['nama' => 'Nama warung sudah digunakan.'])->withInput();
            }
            $qrisPath = $tenant->qris;
            if ($request->hasFile('qris')) {
                // Hapus file lama jika ada
                if ($qrisPath && Storage::disk('public')->exists($qrisPath)) {
                    Storage::disk('public')->delete($qrisPath);
                }
                
                // Upload file baru
                $file = $request->file('qris');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = 'qris/' . $filename;
                
                // Gunakan putFileAs untuk keamanan yang lebih baik
                Storage::disk('public')->putFileAs('qris', $file, $filename);
                $qrisPath = $path;
            }
            $tenant->update([
                'nama' => $request->nama,
                'telepon' => $request->telepon,
                'alamat' => $request->alamat,
                'qris' => $qrisPath,
                'jam_buka' => $request->jam_buka,
                'jam_tutup' => $request->jam_tutup,
                'tautan' => "/" . strtolower(str_replace(' ', '-', $request->nama)),
            ]);

            return redirect()->back()->with('success', 'Warung berhasil diubah.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Terjadi kesalahan saat membuat warung. Silakan coba lagi.'])->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $tenant = Tenant::findOrFail($id);
            if ($tenant->qris && Storage::disk('public')->exists($tenant->qris)) {
                Storage::disk('public')->delete($tenant->qris);
            }
            $tenant->delete();
            return redirect()->route('admin.tenant.index')->with('success', "{$tenant->nama} berhasil dihapus.");
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Terjadi kesalahan saat menghapus pedagang.']);
        }
    }

    /**
     * Update status field based on toggle switch.
     */
    public function updateStatus(Request $request, string $id)
    {
        $request->validate([
            'status' => 'required|in:aktif,nonaktif',
        ]);
        $tenant = Tenant::findOrFail($id);
        $tenant->update([
            'status' => $request->status
        ]);
        return redirect()->route('admin.tenant.index')->with('success', "Status warung {$tenant->nama} berhasil diperbarui.");
    }
}
