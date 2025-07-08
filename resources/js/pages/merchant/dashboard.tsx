import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, ShoppingCart, DollarSign, Package, BarChart3 } from 'lucide-react';
import { useTheme } from 'next-themes';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pedagang',
        href: '/merchant/dashboard',
    },
    {
        title: 'Beranda',
        href: '/merchant/dashboard',
    },
];

interface ChartDataItem {
    date: string;
    value: number;
}

interface DashboardData {
    todayTransactions: number;
    todayRevenue: number;
    avgItemsPerTransaction: number;
    avgRevenuePerTransaction: number;
    transactionChange: number;
    revenueChange: number;
    itemsChange: number;
    avgRevenueChange: number;
    chartData: {
        transaction: ChartDataItem[];
        revenue: ChartDataItem[];
    };
    tenant: any;
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

    const getTrendText = (change: number) => {
        return change >= 0 ? 'naik' : 'turun';
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
        grid: '#e5e7eb', // gray-200 for light mode
        gridDark: '#374151', // gray-700 for dark mode
        text: '#6b7280', // gray-500
        textDark: '#9ca3af', // gray-400
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} userType='merchant'>
            <Head title="Beranda" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                {/* Header */}
                <h1 className="text-xl py-2 font-semibold text-gray-900 dark:text-gray-100">Beranda</h1>

                {/* Statistics Cards */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Today's Transactions */}
                    <Card className="border border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Transaksi Hari Ini
                            </CardTitle>
                            <ShoppingCart className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {formatNumber(dashboardData.todayTransactions)} Pesanan
                            </div>
                            <div className={`flex items-center text-xs ${getTrendColor(dashboardData.transactionChange)}`}>
                                {(() => {
                                    const TrendIcon = getTrendIcon(dashboardData.transactionChange);
                                    return <TrendIcon className="mr-1 h-3 w-3" />;
                                })()}
                                {Math.abs(dashboardData.transactionChange)} dari kemarin
                            </div>
                        </CardContent>
                    </Card>

                    {/* Today's Revenue */}
                    <Card className="border border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Pendapatan Hari Ini
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {formatCurrency(dashboardData.todayRevenue)}
                            </div>
                            <div className={`flex items-center text-xs ${getTrendColor(dashboardData.revenueChange)}`}>
                                {(() => {
                                    const TrendIcon = getTrendIcon(dashboardData.revenueChange);
                                    return <TrendIcon className="mr-1 h-3 w-3" />;
                                })()}
                                {formatCurrency(Math.abs(dashboardData.revenueChange))} dari kemarin
                            </div>
                        </CardContent>
                    </Card>

                    {/* Average Items per Transaction */}
                    <Card className="border border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Rata-Rata Item per Transaksi
                            </CardTitle>
                            <Package className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {dashboardData.avgItemsPerTransaction.toFixed(2)} Item
                            </div>
                            <div className={`flex items-center text-xs ${getTrendColor(dashboardData.itemsChange)}`}>
                                {(() => {
                                    const TrendIcon = getTrendIcon(dashboardData.itemsChange);
                                    return <TrendIcon className="mr-1 h-3 w-3" />;
                                })()}
                                {Math.abs(dashboardData.itemsChange).toFixed(2)} dari kemarin
                            </div>
                        </CardContent>
                    </Card>

                    {/* Average Revenue per Transaction */}
                    <Card className="border border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Rata-Rata Harga per Transaksi
                            </CardTitle>
                            <BarChart3 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {formatCurrency(dashboardData.avgRevenuePerTransaction)}
                            </div>
                            <div className={`flex items-center text-xs ${getTrendColor(dashboardData.avgRevenueChange)}`}>
                                {(() => {
                                    const TrendIcon = getTrendIcon(dashboardData.avgRevenueChange);
                                    return <TrendIcon className="mr-1 h-3 w-3" />;
                                })()}
                                {formatCurrency(Math.abs(dashboardData.avgRevenueChange))} dari kemarin
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Transactions Chart */}
                    <Card className="border border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Transaksi Akhir-Akhir Ini
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={dashboardData.chartData.transaction}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="rgb(229 231 235 / 0.8)"
                                            className="dark:stroke-gray-600"
                                        />
                                        <XAxis
                                            dataKey="date"
                                            fontSize={12}
                                            tick={{ fill: 'rgb(107 114 128)' }}
                                            className="dark:fill-gray-400"
                                        />
                                        <YAxis
                                            fontSize={12}
                                            tick={{ fill: 'rgb(107 114 128)' }}
                                            className="dark:fill-gray-400"
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                border: '1px solid rgb(229 231 235)',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                            }}
                                            labelStyle={{ color: 'rgb(17 24 39)' }}
                                            formatter={(value: any) => [`${value}`, 'Transaksi']}
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

                    {/* Revenue Chart */}
                    <Card className="border border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                Pendapatan Akhir-Akhir Ini
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={dashboardData.chartData.revenue}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="rgb(229 231 235 / 0.8)"
                                            className="dark:stroke-gray-600"
                                        />
                                        <XAxis
                                            dataKey="date"
                                            fontSize={12}
                                            tick={{ fill: 'rgb(107 114 128)' }}
                                            className="dark:fill-gray-400"
                                        />
                                        <YAxis
                                            fontSize={12}
                                            tick={{ fill: 'rgb(107 114 128)' }}
                                            className="dark:fill-gray-400"
                                            tickFormatter={(value) => `${(value / 1000)}k`}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'white',
                                                border: '1px solid rgb(229 231 235)',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                            }}
                                            labelStyle={{ color: 'rgb(17 24 39)' }}
                                            formatter={(value: any) => [formatCurrency(value), 'Pendapatan']}
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
                </div>
            </div>
        </AppLayout>
    );
}