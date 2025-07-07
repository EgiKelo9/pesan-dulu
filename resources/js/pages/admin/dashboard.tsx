import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Store, Users, ShoppingCart, DollarSign, Activity, Crown } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/dashboard',
    },
    {
        title: 'Beranda',
        href: '/admin/dashboard',
    },
];

interface ChartDataItem {
    date: string;
    value: number;
}

interface DashboardData {
    totalTenants: number;
    totalMerchants: number;
    totalOrders: number;
    totalRevenue: number;
    todayTenants: number;
    todayMerchants: number;
    todayOrders: number;
    todayRevenue: number;
    tenantChange: number;
    merchantChange: number;
    orderChange: number;
    revenueChange: number;
    activeTenants: number;
    popularTenant: any;
    chartData: {
        tenants: ChartDataItem[];
        merchants: ChartDataItem[];
        orders: ChartDataItem[];
        revenue: ChartDataItem[];
    };
}

export default function Dashboard({ dashboardData }: { dashboardData: DashboardData }) {
    const { props } = usePage();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('id-ID').format(num);
    };

    const getTrendIcon = (change: number) => {
        return change >= 0 ? TrendingUp : TrendingDown;
    };

    const getTrendColor = (change: number) => {
        return change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
    };

    const chartColors = {
        primary: {
            stroke: '#0ea5e9', // sky-500
            fill: '#0ea5e9',
            fillOpacity: 0.3,
        },
        secondary: {
            stroke: '#10b981', // emerald-500
            fill: '#10b981',
            fillOpacity: 0.3,
        },
        tertiary: {
            stroke: '#f59e0b', // amber-500
            fill: '#f59e0b',
            fillOpacity: 0.3,
        },
        quaternary: {
            stroke: '#8b5cf6', // violet-500
            fill: '#8b5cf6',
            fillOpacity: 0.3,
        },
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} userType='admin'>
            <Head title="Beranda" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                {/* Header */}
                <h1 className="text-xl py-2 font-semibold text-gray-900 dark:text-gray-100">Beranda Admin</h1>

                {/* Overview Statistics */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Total Tenants */}
                    <Card className="border border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Total Warung
                            </CardTitle>
                            <Store className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {formatNumber(dashboardData.totalTenants)} Warung
                            </div>
                            <div className={`flex items-center text-xs ${getTrendColor(dashboardData.tenantChange)}`}>
                                {(() => {
                                    const TrendIcon = getTrendIcon(dashboardData.tenantChange);
                                    return <TrendIcon className="mr-1 h-3 w-3" />;
                                })()}
                                {Math.abs(dashboardData.tenantChange)} hari ini
                            </div>
                        </CardContent>
                    </Card>

                    {/* Total Merchants */}
                    <Card className="border border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Total Pedagang
                            </CardTitle>
                            <Users className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {formatNumber(dashboardData.totalMerchants)} Pedagang
                            </div>
                            <div className={`flex items-center text-xs ${getTrendColor(dashboardData.merchantChange)}`}>
                                {(() => {
                                    const TrendIcon = getTrendIcon(dashboardData.merchantChange);
                                    return <TrendIcon className="mr-1 h-3 w-3" />;
                                })()}
                                {Math.abs(dashboardData.merchantChange)} hari ini
                            </div>
                        </CardContent>
                    </Card>

                    {/* Total Orders */}
                    <Card className="border border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Total Pesanan
                            </CardTitle>
                            <ShoppingCart className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {formatNumber(dashboardData.totalOrders)} Pesanan
                            </div>
                            <div className={`flex items-center text-xs ${getTrendColor(dashboardData.orderChange)}`}>
                                {(() => {
                                    const TrendIcon = getTrendIcon(dashboardData.orderChange);
                                    return <TrendIcon className="mr-1 h-3 w-3" />;
                                })()}
                                {Math.abs(dashboardData.orderChange)} hari ini
                            </div>
                        </CardContent>
                    </Card>

                    {/* Total Revenue */}
                    <Card className="border border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Total Pendapatan
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {formatCurrency(dashboardData.totalRevenue)}
                            </div>
                            <div className={`flex items-center text-xs ${getTrendColor(dashboardData.revenueChange)}`}>
                                {(() => {
                                    const TrendIcon = getTrendIcon(dashboardData.revenueChange);
                                    return <TrendIcon className="mr-1 h-3 w-3" />;
                                })()}
                                {formatCurrency(Math.abs(dashboardData.revenueChange))} hari ini
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Additional Statistics */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Active Tenants */}
                    <Card className="border border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Warung Aktif (7 Hari Terakhir)
                            </CardTitle>
                            <Activity className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {formatNumber(dashboardData.activeTenants)} Warung
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                                dari {formatNumber(dashboardData.totalTenants)} total warung
                            </div>
                        </CardContent>
                    </Card>

                    {/* Popular Tenant */}
                    <Card className="border border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Warung Terpopuler (30 Hari)
                            </CardTitle>
                            <Crown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {dashboardData.popularTenant?.nama || 'Belum ada data'}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                                {dashboardData.popularTenant?.orders_count || 0} pesanan bulan ini
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Tenants Registration Chart */}
                    <Card className="border border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Pendaftaran Warung
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={dashboardData.chartData.tenants}>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                                        <XAxis 
                                            dataKey="date" 
                                            className="fill-gray-600 dark:fill-gray-400"
                                            fontSize={12}
                                        />
                                        <YAxis 
                                            className="fill-gray-600 dark:fill-gray-400"
                                            fontSize={12}
                                        />
                                        <Tooltip 
                                            contentStyle={{
                                                backgroundColor: 'hsl(var(--background))',
                                                border: '1px solid hsl(var(--border))',
                                                borderRadius: '8px',
                                            }}
                                            formatter={(value: any) => [`${value}`, 'Warung']}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke={chartColors.primary.stroke}
                                            fill={chartColors.primary.fill}
                                            fillOpacity={chartColors.primary.fillOpacity}
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Merchants Registration Chart */}
                    <Card className="border border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Pendaftaran Pedagang
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={dashboardData.chartData.merchants}>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                                        <XAxis 
                                            dataKey="date" 
                                            className="fill-gray-600 dark:fill-gray-400"
                                            fontSize={12}
                                        />
                                        <YAxis 
                                            className="fill-gray-600 dark:fill-gray-400"
                                            fontSize={12}
                                        />
                                        <Tooltip 
                                            contentStyle={{
                                                backgroundColor: 'hsl(var(--background))',
                                                border: '1px solid hsl(var(--border))',
                                                borderRadius: '8px',
                                            }}
                                            formatter={(value: any) => [`${value}`, 'Pedagang']}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke={chartColors.secondary.stroke}
                                            fill={chartColors.secondary.fill}
                                            fillOpacity={chartColors.secondary.fillOpacity}
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Orders Chart */}
                    <Card className="border border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Pesanan Harian
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={dashboardData.chartData.orders}>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                                        <XAxis 
                                            dataKey="date" 
                                            className="fill-gray-600 dark:fill-gray-400"
                                            fontSize={12}
                                        />
                                        <YAxis 
                                            className="fill-gray-600 dark:fill-gray-400"
                                            fontSize={12}
                                        />
                                        <Tooltip 
                                            contentStyle={{
                                                backgroundColor: 'hsl(var(--background))',
                                                border: '1px solid hsl(var(--border))',
                                                borderRadius: '8px',
                                            }}
                                            formatter={(value: any) => [`${value}`, 'Pesanan']}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke={chartColors.tertiary.stroke}
                                            fill={chartColors.tertiary.fill}
                                            fillOpacity={chartColors.tertiary.fillOpacity}
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Revenue Chart */}
                    <Card className="border border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Pendapatan Harian
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={dashboardData.chartData.revenue}>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                                        <XAxis 
                                            dataKey="date" 
                                            className="fill-gray-600 dark:fill-gray-400"
                                            fontSize={12}
                                        />
                                        <YAxis 
                                            className="fill-gray-600 dark:fill-gray-400"
                                            fontSize={12}
                                            tickFormatter={(value) => `${(value / 1000)}k`}
                                        />
                                        <Tooltip 
                                            contentStyle={{
                                                backgroundColor: 'hsl(var(--background))',
                                                border: '1px solid hsl(var(--border))',
                                                borderRadius: '8px',
                                            }}
                                            formatter={(value: any) => [formatCurrency(value), 'Pendapatan']}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke={chartColors.quaternary.stroke}
                                            fill={chartColors.quaternary.fill}
                                            fillOpacity={chartColors.quaternary.fillOpacity}
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}