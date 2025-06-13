<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{
    /**
     * Show the email verification prompt page.
     */
    public function __invoke(Request $request): Response|RedirectResponse
    {
        $user = $request->user();
        if (!$user->hasVerifiedEmail()) {
            return Inertia::render('auth/verify-email', [
                'status' => $request->session()->get('status')
            ]);
        }
        $userType = $user->role;
        if ($userType === 'merchant' && !$user->tenant) {
            return redirect()->route('merchant.tenant.create')
                ->with('message', 'Silakan buat tenant terlebih dahulu.');
        }
        return $userType === 'merchant'
            ? redirect()->intended(route('merchantDashboard', absolute: false))
            : redirect()->intended(route('adminDashboard', absolute: false));
    }
}
