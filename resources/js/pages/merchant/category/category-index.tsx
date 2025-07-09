import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { CategoryColumns } from './category-column';
import { DataTable } from '@/components/ui/data-table';
import { useFlashMessages } from '@/hooks/use-flash-messages';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pedagang',
        href: '/merchant/dashboard',
    },
    {
        title: 'Kategori',
        href: '/merchant/category',
    },
];

interface CategoryTableProps {
    categories: any[];
}

export default function Category({ categories }: CategoryTableProps) {
    const { ToasterComponent } = useFlashMessages();

    return (
        <AppLayout breadcrumbs={breadcrumbs} userType='merchant'>
            <Head title="Kategori Menu" />
            <ToasterComponent />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <DataTable title="Kategori Menu" href="/merchant/category" columns={CategoryColumns} data={categories} />
            </div>
        </AppLayout>
    );
}
