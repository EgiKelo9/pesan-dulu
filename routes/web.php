<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\Merchant\CategoryController;
use App\Http\Controllers\Merchant\MenuController;
use App\Http\Controllers\Merchant\OrderController;
use App\Http\Controllers\Merchant\TenantController;

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

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
