import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { OrderColumns } from './order-column';
import { DataTable } from '@/components/ui/data-table';
import { useFlashMessages } from '@/hooks/use-flash-messages';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pedagang',
        href: '/merchant/dashboard',
    },
    {
        title: 'Pesanan',
        href: '/merchant/order',
    },
];

interface OrderTableProps {
    orders: any[];
}

export default function Order({ orders }: OrderTableProps) {
    const { ToasterComponent } = useFlashMessages();

    return (
        <AppLayout breadcrumbs={breadcrumbs} userType='merchant'>
            <Head title="Transaksi Pesanan" />
            <ToasterComponent />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <DataTable
                    title="Transaksi Pesanan"
                    href="/merchant/order"
                    activeTab={["menunggu", "diterima", "siap", "diambil"]}
                    defaultTab='menunggu'
                    showSearch={true}
                    showColumnFilter={true}
                    showCreateButton={false}
                    columns={OrderColumns} data={orders}
                />
            </div>
        </AppLayout>
    );
}
