<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
use Illuminate\Auth\Events\Registered;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:15',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', 'min:8', Rules\Password::defaults()],
        ], [
            'phone.numeric' => 'Nomor telepon hanya boleh berisi angka.',
            'phone.max' => 'Nomor telepon tidak boleh lebih dari :max karakter.',
            'email.unique' => 'Email yang Anda gunakan sudah terdaftar.',
            'password.confirmed' => 'Konfirmasi kata sandi tidak cocok.',
            'password.min' => 'Kata sandi harus memiliki minimal :min karakter.',
        ]);

        $user = User::create([
            'nama' => $request->name,
            'role' => 'merchant',
            'telepon' => $request->phone,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'email_verified_at' => now(), // tanpa melalui verifikasi email
            'remember_token' => Str::random(10), // tanpa melalui verifikasi email
        ]);

        event(new Registered($user));

        Auth::login($user);

        // return Inertia::render('auth/verify-email', [
        //     'status' => $request->session()->get('status')
        // ]);

        return redirect()->route('merchant.tenant.index')->with('message', 'Akun Anda berhasil dibuat. Silakan buat tenant untuk melanjutkan.');

    }
}
