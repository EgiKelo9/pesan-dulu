<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function merchant()
    {
        $user = auth('web')->user();
        if ($user->role === 'merchant') {
            if (!$user->tenant) {
                return redirect()->route('merchant.tenant.create')->with('warning', 'Silakan buat warung terlebih dahulu.');
            }
            return Inertia::render('merchant/dashboard');
        } else {
            return redirect()->route('login')->with('error', 'Anda tidak memiliki akses ke beranda merchant.');
        }
    }

    public function admin()
    {
        $user = auth('web')->user();
        if ($user->role === 'admin') {
            return Inertia::render('admin/dashboard');
        } else {
            return redirect()->route('login')->with('error', 'Anda tidak memiliki akses ke beranda admin.');
        }
    }
}
