import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { MenuColumns } from './menu-column';
import { DataTable } from '@/components/ui/data-table';
import { useFlashMessages } from '@/hooks/use-flash-messages';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pedagang',
        href: '/merchant/dashboard',
    },
    {
        title: 'Menu',
        href: '/merchant/menu',
    },
];

interface MenuTableProps {
    menus: any[];
}

export default function Menu({ menus }: MenuTableProps) {
    const { ToasterComponent } = useFlashMessages();

    return (
        <AppLayout breadcrumbs={breadcrumbs} userType='merchant'>
            <Head title="Menu Warung" />
            <ToasterComponent />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <DataTable title="Menu Warung" href="/merchant/menu" columns={MenuColumns} data={menus} />
            </div>
        </AppLayout>
    );
}
