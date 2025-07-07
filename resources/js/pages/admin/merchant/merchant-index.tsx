import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { MerchantColumns } from './merchant-column';
import { DataTable } from '@/components/ui/data-table';
import { useFlashMessages } from '@/hooks/use-flash-messages';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/dashboard',
    },
    {
        title: 'Pedangang',
        href: '/admin/merchant',
    },
];

interface MerchantTableProps {
    merchants: any[];
}

export default function Merchant({ merchants }: MerchantTableProps) {
    const { ToasterComponent } = useFlashMessages();

    return (
        <AppLayout breadcrumbs={breadcrumbs} userType='admin'>
            <Head title="Pedangang" />
            <ToasterComponent />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <DataTable title="Pedagang" href="/admin/merchant" columns={MerchantColumns} data={merchants} />
            </div>
        </AppLayout>
    );
}
