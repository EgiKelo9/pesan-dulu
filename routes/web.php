<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\Merchant\CategoryController;
use App\Http\Controllers\Merchant\MenuController;
use App\Http\Controllers\Merchant\OrderController;
use App\Http\Controllers\Merchant\TenantController;
use App\Http\Controllers\GuestController;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {

    // Merchant Routes
    Route::get('merchant/dashboard', [DashboardController::class, 'merchant'])->name('merchantDashboard');
    Route::prefix('merchant')->name('merchant.')->group(function () {
        Route::resource('tenant', TenantController::class)->except(['destroy']);
        Route::resource('category', CategoryController::class);
        Route::resource('menu', MenuController::class);
        Route::put('menu/{menu}/status', [MenuController::class, 'updateStatus'])->name('menu.updateStatus');
        Route::resource('order', OrderController::class);
        Route::put('order/{order}/status', [OrderController::class, 'updateStatus'])->name('order.updateStatus');
    });

    // Admin Routes
    Route::get('admin/dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('adminDashboard');

    Route::get('admin/category', function () {
        return Inertia::render('admin/category');
    })->name('adminCategory');

    
});


Route::get('/{slug}', [GuestController::class, 'tampilkanWarung'])
->where('slug', '^(?!login$|logout$|register$|reset-password$|forgot-password$|confirm-password$|email$|verify-email$|merchant$|admin$|settings$|storage$|up$|cart$)[A-Za-z0-9\-_]+$');

Route::get('/cart', [GuestController::class, 'cart'])
    ->name('cart'); 

Route::post('/cart/add', [GuestController::class, 'add']);

Route::post('/cart/update', [GuestController::class, 'updateCart'])
    ->name('cart.update');

Route::post('/cart/checkout', [GuestController::class, 'checkout'])
    ->name('cart.checkout');

Route::get('/cart/payment', [GuestController::class, 'showPayment'])
    ->name('payment.show');



// Route::get('/{slug}', [GuestController::class, 'tampilkanWarung'])
//     ->where('slug', '^(?!login$|register$|logout$)[A-Za-z0-9\-_]+$');
//     // ->where('slug', '[a-z0-9\-]+');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
