<?php

namespace App\Http\Controllers\Merchant;

use Inertia\Inertia;
use App\Models\Tenant;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class TenantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tenant = auth('web')->user()->tenant;
        if (!$tenant) {
            return redirect()->route('merchant.tenant.create')->with('message', 'Silakan buat warung terlebih dahulu.');
        }
        return redirect()->route('merchant.tenant.show', $tenant->id);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $user = auth('web')->user();
        $tenant = $user->tenant;
        if ($tenant) {
            return redirect()->route('merchant.tenant.show', $user->id)->with('message', 'Anda sudah memiliki tenant.');
        }
        return Inertia::render('merchant/tenant/tenant-create', [
            'user' => auth('web')->user(),
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

            session()->flash('success', 'Warung berhasil dibuat.');
            return redirect()->route('merchant.tenant.show', $tenant->id)->with('message', 'Tenant berhasil dibuat.');
        } catch (\Exception $e) {
            session()->flash('error', 'Warung gagal dibuat.');
            return back()->withErrors(['error' => 'Terjadi kesalahan saat membuat tenant. Silakan coba lagi.'])->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $tenant = Tenant::findOrFail($id);
        if ($tenant->user_id !== auth('web')->user()->id) {
            return redirect()->route('merchantDashboard')->withErrors(['error' => 'Anda tidak memiliki akses ke tenant ini.']);
        }
        return Inertia::render('merchant/tenant/tenant-show', [
            'tenant' => $tenant,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $tenant = Tenant::findOrFail($id);
        if ($tenant->user_id !== auth('web')->user()->id) {
            return redirect()->route('merchantDashboard')->withErrors(['error' => 'Anda tidak memiliki akses ke tenant ini.']);
        }
        return Inertia::render('merchant/tenant/tenant-edit', [
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
            'qris' => 'nullable|max:2048',
            'jam_buka' => 'required|date_format:H:i',
            'jam_tutup' => 'required|date_format:H:i|after:jam_buka',
        ], [
            'nama.required' => 'Nama warung harus diisi.',
            'telepon.required' => 'Telepon harus diisi.',
            'alamat.required' => 'Alamat harus diisi.',
            'qris.max' => 'Ukuran QRIS maksimal 2MB.',
            'jam_buka.required' => 'Jam buka harus diisi.',
            'jam_tutup.required' => 'Jam tutup harus diisi.',
            'jam_tutup.after' => 'Jam tutup harus setelah jam buka.',
        ]);

        try {
            $tenant = Tenant::findOrFail($id);
            if ($tenant->user_id !== auth('web')->user()->id) {
                return redirect()->route('merchantDashboard')->withErrors(['error' => 'Anda tidak memiliki akses ke tenant ini.']);
            }
            $existingTenant = Tenant::where('nama', $tenant->nama)->first();
            if ($existingTenant && $existingTenant->id !== $tenant->id) {
                return back()->withErrors(['nama' => 'Nama tenant sudah digunakan.'])->withInput();
            }
            $qrisPath = $tenant->qris;
            if ($request->hasFile('qris')) {
                $file = $request->file('qris');
                $filename = time() . '_' . $file->getClientOriginalName();

                // Save to storage
                $path = 'qris/' . $filename;
                Storage::disk('public')->put($path, $file->getContent());
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

            session()->flash('success', 'Warung berhasil diperbarui.');
            return redirect()->back()->with('message', 'Warung berhasil dibuat.');
        } catch (\Exception $e) {
            session()->flash('success', 'Warung berhasil diperbarui.');
            return back()->withErrors(['error' => 'Terjadi kesalahan saat membuat warung. Silakan coba lagi.'])->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
