import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ReportColumns } from './report-column';
import { DataTable } from '@/components/ui/data-table';
import { useFlashMessages } from '@/hooks/use-flash-messages';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/dashboard',
    },
    {
        title: 'Laporan',
        href: '/admin/report',
    },
];

interface ReportTableProps {
    reports: any[];
}

export default function Report({ reports }: ReportTableProps) {
    const { ToasterComponent } = useFlashMessages();
    return (
        <AppLayout breadcrumbs={breadcrumbs} userType='admin'>
            <Head title="Laporan" />
            <ToasterComponent />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <DataTable title="Laporan" href="/admin/report" columns={ReportColumns} data={reports} showCreateButton={false}/>
            </div>
        </AppLayout>
    );
}
