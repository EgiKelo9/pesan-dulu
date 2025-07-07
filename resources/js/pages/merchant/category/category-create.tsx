import AppLayout from '@/layouts/app-layout';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import InputError from '@/components/input-error';

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
        title: 'Buat',
        href: '/merchant/category/create',
    },
];

type CategoryForm = {
    nama: string;
    deskripsi: string;
};

export default function CreateCategory() {
    const { data, setData, post, processing, errors, reset, cancel } = useForm<Required<CategoryForm>>({
        nama: '',
        deskripsi: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('merchant.category.store'), {
            onSuccess: () => {
                reset();
            },
            onFinish: () => {
                console.log('Form submission finished');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs} userType='merchant'>
            <Head title="Buat Kategori" />
            <form className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto" onSubmit={submit}>
                <h1 className='text-xl py-2 font-semibold'>Buat Kategori Menu</h1>
                <div className='grid gap-4 mt-2'>
                    <Label htmlFor='nama'>Nama Kategori
                        <span className='text-red-500'>*</span>
                    </Label>
                    <Input
                        id='nama'
                        type='text'
                        required
                        autoFocus
                        tabIndex={1}
                        value={data.nama}
                        onChange={(e) => setData('nama', e.target.value)}
                        disabled={processing}
                        placeholder='Masukkan nama kategori menu Anda'
                        className="w-full"
                    />
                    <InputError message={errors.nama} />
                </div>
                <div className='grid gap-4 mt-2'>
                    <Label htmlFor='deskripsi'>Deskripsi Kategori
                        <span className='text-red-500'>*</span>
                    </Label>
                    <Textarea
                        id='deskripsi'
                        required
                        autoFocus
                        tabIndex={2}
                        value={data.deskripsi}
                        onChange={(e) => setData('deskripsi', e.target.value)}
                        disabled={processing}
                        placeholder='Masukkan deskripsi kategori menu Anda'
                        className="w-full min-h-32"
                    />
                    <InputError message={errors.deskripsi} />
                </div>
                <div className='flex gap-4 mt-2'>
                    <Button type="submit" variant={"primary"} tabIndex={3} disabled={processing}>
                        {processing ? 
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                        : "Buat"}
                    </Button>
                    <Button 
                        variant={"outline"} 
                        type="button" 
                        onClick={() => window.history.back()}
                    >
                        Batal
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
