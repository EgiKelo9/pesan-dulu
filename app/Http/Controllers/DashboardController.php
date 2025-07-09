<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function merchant()
    {
        $user = auth('web')->user();
        if ($user->role === 'merchant') {
            if (!$user->tenant) {
                return redirect()->route('merchant.tenant.create')->with('warning', 'Silakan buat warung terlebih dahulu.');
            }

            $tenant = $user->tenant;
            $today = Carbon::today('Asia/Jakarta');
            $yesterday = Carbon::yesterday('Asia/Jakarta');

            // Today's statistics - FIXED: Use tanggal_pesanan consistently
            $todayOrders = Order::where('tenant_id', $tenant->id)
                ->whereDate('tanggal_pesanan', $today)
                ->count();

            $todayRevenue = Order::where('tenant_id', $tenant->id)
                ->whereDate('tanggal_pesanan', $today)
                ->sum('total_harga');

            // Yesterday's statistics for comparison - FIXED: Use tanggal_pesanan consistently
            $yesterdayOrders = Order::where('tenant_id', $tenant->id)
                ->whereDate('tanggal_pesanan', $yesterday)
                ->count();

            $yesterdayRevenue = Order::where('tenant_id', $tenant->id)
                ->whereDate('tanggal_pesanan', $yesterday)
                ->sum('total_harga');

            // Average items per transaction (today) - FIXED: Use tanggal_pesanan
            $todayOrderMenus = DB::table('order_menu')
                ->join('orders', 'order_menu.order_id', '=', 'orders.id')
                ->where('orders.tenant_id', $tenant->id)
                ->whereDate('orders.tanggal_pesanan', $today)
                ->sum('order_menu.jumlah');

            $avgItemsPerTransaction = $todayOrders > 0 ? $todayOrderMenus / $todayOrders : 0;

            // Yesterday's average for comparison - FIXED: Use tanggal_pesanan
            $yesterdayOrderMenus = DB::table('order_menu')
                ->join('orders', 'order_menu.order_id', '=', 'orders.id')
                ->where('orders.tenant_id', $tenant->id)
                ->whereDate('orders.tanggal_pesanan', $yesterday)
                ->sum('order_menu.jumlah');

            $yesterdayAvgItems = $yesterdayOrders > 0 ? $yesterdayOrderMenus / $yesterdayOrders : 0;

            // Average revenue per transaction
            $avgRevenuePerTransaction = $todayOrders > 0 ? $todayRevenue / $todayOrders : 0;
            $yesterdayAvgRevenue = $yesterdayOrders > 0 ? $yesterdayRevenue / $yesterdayOrders : 0;

            // Chart data for last 8 days
            $transactionChartData = [];
            $revenueChartData = [];

            for ($i = 7; $i >= 0; $i--) {
                $date = Carbon::today('Asia/Jakarta')->subDays($i);
                $dateString = $date->format('d/m');

                // FIXED: Remove whereNot status filter and use tanggal_pesanan consistently
                $dailyOrders = Order::where('tenant_id', $tenant->id)
                    ->whereDate('tanggal_pesanan', $date)
                    ->count();

                $dailyRevenue = Order::where('tenant_id', $tenant->id)
                    ->whereDate('tanggal_pesanan', $date)
                    ->sum('total_harga');

                $transactionChartData[] = [
                    'date' => $dateString,
                    'value' => $dailyOrders,
                ];

                $revenueChartData[] = [
                    'date' => $dateString,
                    'value' => $dailyRevenue,
                ];
            }

            $dashboardData = [
                'todayTransactions' => $todayOrders,
                'todayRevenue' => $todayRevenue,
                'avgItemsPerTransaction' => round($avgItemsPerTransaction, 2),
                'avgRevenuePerTransaction' => round($avgRevenuePerTransaction),
                'transactionChange' => $todayOrders - $yesterdayOrders,
                'revenueChange' => $todayRevenue - $yesterdayRevenue,
                'itemsChange' => round($avgItemsPerTransaction - $yesterdayAvgItems, 2),
                'avgRevenueChange' => round($avgRevenuePerTransaction - $yesterdayAvgRevenue),
                'chartData' => [
                    'transaction' => $transactionChartData,
                    'revenue' => $revenueChartData,
                ],
                'tenant' => $tenant,
            ];

            return Inertia::render('merchant/dashboard', ['dashboardData' => $dashboardData]);
        } else {
            return redirect()->route('login')->with('error', 'Anda tidak memiliki akses ke beranda pedagang.');
        }
    }

    public function admin()
    {
        $user = auth('web')->user();
        if ($user->role === 'admin') {
            $today = Carbon::today();
            $yesterday = Carbon::yesterday();

            // Total counts
            $totalTenants = Tenant::count();
            $totalMerchants = User::where('role', 'merchant')->count();
            $totalOrders = Order::count();
            $totalRevenue = Order::sum('total_harga');

            // Today's statistics - FIXED: Use tanggal_pesanan
            $todayTenants = Tenant::whereDate('created_at', $today)->count();
            $todayMerchants = User::where('role', 'merchant')->whereDate('created_at', $today)->count();
            $todayOrders = Order::whereDate('tanggal_pesanan', $today)->count();
            $todayRevenue = Order::whereDate('tanggal_pesanan', $today)->sum('total_harga');

            // Yesterday's statistics for comparison - FIXED: Use tanggal_pesanan
            $yesterdayTenants = Tenant::whereDate('created_at', $yesterday)->count();
            $yesterdayMerchants = User::where('role', 'merchant')->whereDate('created_at', $yesterday)->count();
            $yesterdayOrders = Order::whereDate('tanggal_pesanan', $yesterday)->count();
            $yesterdayRevenue = Order::whereDate('tanggal_pesanan', $yesterday)->sum('total_harga');

            // Chart data for last 8 days
            $tenantChartData = [];
            $merchantChartData = [];
            $orderChartData = [];
            $revenueChartData = [];

            for ($i = 7; $i >= 0; $i--) {
                $date = Carbon::today('Asia/Jakarta')->subDays($i);
                $dateString = $date->format('d/m');

                $dailyTenants = Tenant::whereDate('created_at', $date)->count();
                $dailyMerchants = User::where('role', 'merchant')->whereDate('created_at', $date)->count();
                $dailyOrders = Order::whereDate('tanggal_pesanan', $date)->count();
                $dailyRevenue = Order::whereDate('tanggal_pesanan', $date)->sum('total_harga');

                $tenantChartData[] = [
                    'date' => $dateString,
                    'value' => $dailyTenants,
                ];

                $merchantChartData[] = [
                    'date' => $dateString,
                    'value' => $dailyMerchants,
                ];

                $orderChartData[] = [
                    'date' => $dateString,
                    'value' => $dailyOrders,
                ];

                $revenueChartData[] = [
                    'date' => $dateString,
                    'value' => $dailyRevenue,
                ];
            }

            // Active tenants (tenants with orders in last 7 days) - FIXED: Use tanggal_pesanan
            $activeTenants = Tenant::whereHas('orders', function ($query) {
                $query->where('tanggal_pesanan', '>=', Carbon::now()->subDays(7));
            })->count();

            // Most popular tenant (by order count) - FIXED: Use tanggal_pesanan
            $popularTenant = Tenant::withCount(['orders' => function ($query) {
                $query->where('tanggal_pesanan', '>=', Carbon::now()->subDays(30));
            }])
                ->orderBy('orders_count', 'desc')
                ->first();

            $dashboardData = [
                'totalTenants' => $totalTenants,
                'totalMerchants' => $totalMerchants,
                'totalOrders' => $totalOrders,
                'totalRevenue' => $totalRevenue,
                'todayTenants' => $todayTenants,
                'todayMerchants' => $todayMerchants,
                'todayOrders' => $todayOrders,
                'todayRevenue' => $todayRevenue,
                'tenantChange' => $todayTenants - $yesterdayTenants,
                'merchantChange' => $todayMerchants - $yesterdayMerchants,
                'orderChange' => $todayOrders - $yesterdayOrders,
                'revenueChange' => $todayRevenue - $yesterdayRevenue,
                'activeTenants' => $activeTenants,
                'popularTenant' => $popularTenant,
                'chartData' => [
                    'tenants' => $tenantChartData,
                    'merchants' => $merchantChartData,
                    'orders' => $orderChartData,
                    'revenue' => $revenueChartData,
                ],
            ];

            return Inertia::render('admin/dashboard', ['dashboardData' => $dashboardData]);
        } else {
            return redirect()->route('login')->with('error', 'Anda tidak memiliki akses ke beranda admin.');
        }
    }
}