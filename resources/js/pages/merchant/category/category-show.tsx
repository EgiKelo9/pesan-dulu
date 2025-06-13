import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useFlashMessages } from '@/hooks/use-flash-messages';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Link } from '@inertiajs/react';
import { Pencil } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pedagang',
        href: '/merchant/dashboard',
    },
    {
        title: 'Kategori',
        href: '/merchant/category',
    },
    {
        title: 'Lihat',
        href: '/merchant/category/{id}',
    },
];

type CategoryData = {
    id: number;
    nama: string;
    deskripsi: string;
};

export default function ShowCategory({ category }: { category: CategoryData }) {
    const { ToasterComponent } = useFlashMessages();
    
    return (
        <AppLayout breadcrumbs={breadcrumbs} userType='merchant'>
            <Head title="Lihat Kategori" />
            <ToasterComponent />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h1 className='text-xl py-2 font-semibold'>Lihat Kategori Menu</h1>
                    <Button variant="outline" asChild>
                        <Link href={`/merchant/category/${category.id}/edit`}><Pencil />Ubah</Link>
                    </Button>
                </div>
                <div className='grid gap-4 mt-2'>
                    <Label htmlFor='nama'>Nama Kategori</Label>
                    <Input
                        id='nama'
                        type='text'
                        value={category.nama}
                        disabled
                        className="w-full"
                    />
                </div>
                <div className='grid gap-4 mt-2'>
                    <Label htmlFor='deskripsi'>Deskripsi Kategori</Label>
                    <Textarea
                        id='deskripsi'
                        value={category.deskripsi}
                        disabled
                        className="w-full min-h-32"
                    />
                </div>
            </div>
        </AppLayout>
    );
}
