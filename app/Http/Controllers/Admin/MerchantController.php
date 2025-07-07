<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class MerchantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/merchant/merchant-index', [
            'merchants' => User::where('role', 'merchant')->orderBy('created_at', 'desc')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('admin/merchant/merchant-create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'telepon' => 'required|string|max:15',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', 'min:8', Rules\Password::defaults()],
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ], [
            'telepon.numeric' => 'Nomor telepon hanya boleh berisi angka.',
            'telepon.max' => 'Nomor telepon tidak boleh lebih dari :max karakter.',
            'email.unique' => 'Email yang Anda gunakan sudah terdaftar.',
            'password.confirmed' => 'Konfirmasi kata sandi tidak cocok.',
            'password.min' => 'Kata sandi harus memiliki minimal :min karakter.',
            'avatar.image' => 'Avatar harus berupa gambar.',
            'avatar.mimes' => 'Avatar harus berformat jpeg, png, jpg, atau webp.',
            'avatar.max' => 'Ukuran avatar maksimal 2MB.',
        ]);

        try {
            $avatarPath = null;
            if ($request->hasFile('avatar')) {
                $file = $request->file('avatar');
                $filename = time() . '_' . $file->getClientOriginalName();

                // Save to storage
                $path = 'avatar/' . $filename;
                Storage::disk('public')->put($path, $file->getContent());
                $avatarPath = $path;
            }
            $user = User::create([
                'nama' => $request->nama,
                'role' => 'merchant',
                'status' => 'aktif',
                'telepon' => $request->telepon,
                'email' => $request->email,
                'password' => bcrypt($request->password),
                'avatar' => $avatarPath,
                'email_verified_at' => now(),
                'remember_token' => Str::random(30),
            ]);
            return redirect()->route('admin.merchant.index', $user->id)->with('success', 'Pedagang berhasil dibuat.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Gagal membuat pedagang: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Inertia::render('admin/merchant/merchant-show', [
            'merchant' => User::findOrFail($id),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        return Inertia::render('admin/merchant/merchant-edit', [
            'merchant' => User::findOrFail($id),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'telepon' => 'required|string|max:15',
            'email' => 'required|string|lowercase|email|max:255',
            'status' => 'required|string|in:aktif,nonaktif',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ], [
            'telepon.numeric' => 'Nomor telepon hanya boleh berisi angka.',
            'telepon.max' => 'Nomor telepon tidak boleh lebih dari :max karakter.',
            'avatar.image' => 'Avatar harus berupa gambar.',
            'avatar.mimes' => 'Avatar harus berformat jpeg, png, jpg, atau webp.',
            'avatar.max' => 'Ukuran avatar maksimal 2MB.',
        ]);

        try {
            $merchant = User::findOrFail($id);
            $existingMerchant = User::where('email', $request->email)->first();
            if ($existingMerchant && $existingMerchant->id !== $merchant->id) {
                return back()->withErrors(['email' => 'Email yang anda gunakan sudah terdaftar.'])->withInput();
            }
            $avatarPath = $merchant->avatar;
            if ($request->hasFile('avatar')) {
                // Hapus file lama jika ada
                if ($avatarPath && Storage::disk('public')->exists($avatarPath)) {
                    Storage::disk('public')->delete($avatarPath);
                }

                // Upload file baru
                $file = $request->file('avatar');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = 'avatar/' . $filename;

                // Gunakan putFileAs untuk keamanan yang lebih baik
                Storage::disk('public')->putFileAs('avatar', $file, $filename);
                $avatarPath = $path;
            }
            $merchant->update([
                'nama' => $request->nama,
                'telepon' => $request->telepon,
                'email' => $request->email,
                'status' => $request->status,
                'avatar' => $avatarPath,
            ]);

            return redirect()->back()->with('success', 'Pedagang berhasil diubah.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Terjadi kesalahan saat membuat pedagang. Silakan coba lagi.'])->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $merchant = User::findOrFail($id);
            if ($merchant->avatar && Storage::disk('public')->exists($merchant->avatar)) {
                Storage::disk('public')->delete($merchant->avatar);
            }
            $merchant->delete();
            return redirect()->route('admin.merchant.index')->with('success', "Pedagang {$merchant->nama} berhasil dihapus.");
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
        $merchant = User::findOrFail($id);
        if ($merchant->role === 'merchant') {
            $merchant->update([
                'status' => $request->status
            ]);
            return redirect()->route('admin.merchant.index')->with('success', "Status pedagang {$merchant->nama} berhasil diperbarui.");
        }
        return redirect()->route('admin.merchant.index')->with('error', "Status pedagang {$merchant->nama} gagal diperbarui.");
    }
}
