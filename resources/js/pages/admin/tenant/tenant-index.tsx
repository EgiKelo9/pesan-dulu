import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { TenantColumns } from './tenant-column';
import { DataTable } from '@/components/ui/data-table';
import { useFlashMessages } from '@/hooks/use-flash-messages';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/dashboard',
    },
    {
        title: 'Warung',
        href: '/admin/tenant',
    },
];

interface TenantTableProps {
    tenants: any[];
}

export default function Tenant({ tenants }: TenantTableProps) {
    const { ToasterComponent } = useFlashMessages();

    return (
        <AppLayout breadcrumbs={breadcrumbs} userType='admin'>
            <Head title="Warung" />
            <ToasterComponent />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <DataTable title="Warung" href="/admin/tenant" columns={TenantColumns} data={tenants} />
            </div>
        </AppLayout>
    );
}
