<?php

namespace App\Http\Controllers\Merchant;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $tenant = auth('web')->user()->tenant;
        if (!$tenant) {
            return redirect()->route('merchant.tenant.create')->with('warning', 'Silakan buat warung terlebih dahulu.');
        }
        if ($request->has('activeTab')) {
            $orders = $tenant->orders()->where('status', $request->activeTab)->with('menus')->orderBy('created_at', 'desc')->get();
            return Inertia::render('merchant/order/order-index', [
                'orders' => $orders,
            ]);
        }
        $orders = $tenant->orders()->where('status', 'menunggu')->with('menus')->orderBy('created_at', 'desc')->get();
        return Inertia::render('merchant/order/order-index', [
            'orders' => $orders,
        ]);
    }
    
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $tenant = auth('web')->user()->tenant;
        if (!$tenant) {
            return redirect()->route('merchant.tenant.create')->with('warning', 'Silakan buat warung terlebih dahulu.');
        }
        $order = $tenant->orders()->with('menus')->findOrFail($id);
        return Inertia::render('merchant/order/order-show', [
            'order' => $order,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $tenant = auth('web')->user()->tenant;
        if (!$tenant) {
            return redirect()->route('merchant.tenant.create')->with('warning', 'Silakan buat warung terlebih dahulu.');
        }
        $order = $tenant->orders()->findOrFail($id);
        $order->update(['status' => 'gagal']);
        return redirect()->back()->with('success', "Status pesanan {$order->id} diatur menjadi {$order->status}.");
    }

    /**
     * Update status field based on action button.
     */
    public function updateStatus(Request $request, string $id)
    {
        $tenant = auth('web')->user()->tenant;
        if (!$tenant) {
            return redirect()->route('merchant.tenant.create')->with('warning', 'Silakan buat warung terlebih dahulu.');
        }
        $order = $tenant->orders()->findOrFail($id);
        $request->validate([
            'status' => 'required|in:menunggu,diterima,siap,diambil,gagal',
        ]);
        $order->update([
            'status' => $request->status
        ]);
        return redirect()->back()->with('success', "Status pesanan {$order->id} diatur menjadi {$order->status}.");
    }
}
