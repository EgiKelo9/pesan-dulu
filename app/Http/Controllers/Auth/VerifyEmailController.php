<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            $userType = $request->user()->role;
            if ($userType === 'merchant' && !$request->user()->tenant) {
                return redirect()->route('merchant.tenant.create')
                    ->with('message', 'Silakan buat tenant terlebih dahulu.');
            }
            return $userType === 'merchant'
                ? redirect()->intended(route('merchantDashboard', absolute: false) . '?verified=1')
                : redirect()->intended(route('adminDashboard', absolute: false) . '?verified=1');
        }

        if ($request->user()->markEmailAsVerified()) {
            /** @var \Illuminate\Contracts\Auth\MustVerifyEmail $user */
            $user = $request->user();

            event(new Verified($user));
        }

        return redirect()->intended(route('merchant.tenant.create', absolute: false) . '?verified=1');
    }
}
