<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;

use App\Http\Controllers\Admin\MerchantController;
use App\Http\Controllers\Admin\TenantController as AdminTenantController;
use App\Http\Controllers\Merchant\CategoryController;
use App\Http\Controllers\Merchant\MenuController;
use App\Http\Controllers\Merchant\OrderController;
use App\Http\Controllers\Merchant\TenantController;
use App\Http\Controllers\GuestController;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware('guest')->group(function () {

});

Route::middleware(['auth', 'verified'])->group(function () {

    // Merchant Routes
    Route::get('merchant/dashboard', [DashboardController::class, 'merchant'])
        ->name('merchantDashboard');
    Route::prefix('merchant')->name('merchant.')->group(function () {
        Route::resource('tenant', TenantController::class)
            ->except(['destroy']);
        Route::put('tenant/{tenant}/status', [TenantController::class, 'updateStatus'])
            ->name('tenant.updateStatus');
        Route::resource('category', CategoryController::class);
        Route::resource('menu', MenuController::class);
        Route::put('menu/{menu}/status', [MenuController::class, 'updateStatus'])
            ->name('menu.updateStatus');
        Route::resource('order', OrderController::class)
            ->except(['create', 'store', 'edit', 'update', 'destroy']);
        Route::put('order/{order}/status', [OrderController::class, 'updateStatus'])
            ->name('order.updateStatus');
    });

    // Admin Routes
    Route::get('admin/dashboard', [DashboardController::class, 'admin'])
        ->name('adminDashboard');
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::resource('merchant', MerchantController::class);
        Route::put('merchant/{merchant}/status', [MerchantController::class, 'updateStatus'])
            ->name('merchant.updateStatus');
        Route::resource('tenant', AdminTenantController::class);
        Route::put('tenant/{tenant}/status', [AdminTenantController::class, 'updateStatus'])
            ->name('tenant.updateStatus');
    });


    
});

Route::get('/cart', [GuestController::class, 'cart'])
    ->name('cart'); 

Route::post('/cart/add', [GuestController::class, 'add']);

Route::post('/cart/update', [GuestController::class, 'updateCart'])
    ->name('cart.update');

Route::delete('/cart/delete', [GuestController::class, 'deleteItemCart'])
    ->name('cart.delete');

Route::post('/cart/checkout', [GuestController::class, 'checkout'])
    ->name('cart.checkout');

Route::get('/cart/payment', [GuestController::class, 'showPayment'])
    ->name('payment.show');

Route::post('/cart/payment', [GuestController::class, 'konfirmasiPembayaran']) 
    ->name('cart.payment');

Route::get('/status_pesanan/{id_order}', [GuestController::class, 'pantauPesanan'])
    ->name('pantauPesanan');

Route::post('/laporan/{id_order}', [GuestController::class, 'buatLaporan'])
    ->name('buatLaporan');

Route::get('/{slug}', [GuestController::class, 'tampilkanWarung'])
->where('slug', '^(?!login$|logout$|register$|reset-password$|forgot-password$|confirm-password$|email$|verify-email$|merchant$|admin$|settings$|storage$|up$|cart$)[A-Za-z0-9\-_]+$');

// Route::get('/{slug}', [GuestController::class, 'tampilkanWarung'])
//     ->where('slug', '^(?!login$|register$|logout$)[A-Za-z0-9\-_]+$');
//     // ->where('slug', '[a-z0-9\-]+');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
