import AppLayout from '@/layouts/app-layout';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { cn } from "@/lib/utils"
import { useFlashMessages } from '@/hooks/use-flash-messages';

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button, buttonVariants } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import InputError from '@/components/input-error';
import { Eye, Trash2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog"

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
        title: 'Ubah',
        href: '/merchant/category/{id}/edit',
    },
];

type CategoryForm = {
    id: number;
    nama: string;
    deskripsi: string;
};

export default function EditCategory({ category }: { category: CategoryForm }) {
    const { data, setData, put, processing, errors } = useForm<Required<CategoryForm>>({
        id: category.id,
        nama: category.nama || '',
        deskripsi: category.deskripsi || '',
    });

    const [deleting, setDeleting] = useState(false);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('merchant.category.update', category.id), {
            onSuccess: () => {
                router.visit(route('merchant.category.edit', category.id));
            },
            onFinish: () => {
                console.log('Form submission finished');
            },
        });
    };

    const handleDelete: FormEventHandler = (e) => {
        e.preventDefault();
        setDeleting(true);
        router.delete(route('merchant.category.destroy', category.id), {
            onSuccess: () => {
                router.visit(route('merchant.category.index'));
            },
            onError: (error) => {
                console.error('Failed to delete category:', error);
            },
            onFinish: () => {
                setDeleting(false);
            },
        });
    };

    const { ToasterComponent } = useFlashMessages();

    return (
        <AppLayout breadcrumbs={breadcrumbs} userType='merchant'>
            <Head title="Ubah Kategori" />
            <ToasterComponent />
            <form className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto" onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h1 className='text-xl py-2 font-semibold'>Ubah Kategori Menu</h1>
                    <div className="flex items-center justify-center max-w-sm mb-2 gap-4">
                        <Button variant="outline" asChild>
                            <Link href={`/merchant/category/${category.id}`}><Eye />Lihat</Link>
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger className={cn(buttonVariants({ variant: "destructive" }))}>
                                <Trash2 />Hapus
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Apakah Anda yakin ingin menghapus kategori ini?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Aksi ini tidak dapat dibatalkan. Kategori ini akan dihapus secara permanen
                                        dan tidak dapat dipulihkan lagi.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        disabled={deleting}
                                        className={cn(buttonVariants({ variant: 'destructive' }))}
                                    >
                                        {deleting ?
                                            <LoaderCircle className="h-4 w-4 animate-spin" />
                                            : "Hapus"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
                <div className='grid gap-4 mt-2'>
                    <Label htmlFor='nama'>Nama Kategori</Label>
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
                    <Label htmlFor='deskripsi'>Deskripsi Kategori</Label>
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
                            : "Simpan"}
                    </Button>
                    <Button variant={"outline"}>
                        <Link href={`/merchant/category/${category.id}`} className="w-full">
                            Batal
                        </Link>
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
