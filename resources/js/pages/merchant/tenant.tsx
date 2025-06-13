import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pedagang',
        href: '/merchant/dashboard',
    },
    {
        title: 'Warung',
        href: '/merchant/tenant',
    },
];

export default function Tenant() {
    return (
        <AppLayout breadcrumbs={breadcrumbs} userType='merchant'>
            <Head title="Warung" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <h1 className='text-xl font-semibold'>Warung</h1>
            </div>
        </AppLayout>
    );
}
