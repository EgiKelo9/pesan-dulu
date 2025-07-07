import AppLayout from '@/layouts/app-layout';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useFlashMessages } from '@/hooks/use-flash-messages';
import { cn } from "@/lib/utils"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button, buttonVariants } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import InputError from '@/components/input-error';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye, Copy, Trash2 } from 'lucide-react';
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
        title: 'Admin',
        href: '/admin/dashboard',
    },
    {
        title: 'Warung',
        href: '/admin/tenant',
    },
    {
        title: 'Ubah',
        href: '/admin/tenant/{id}/edit',
    },
];

type TenantForm = {
    id: number;
    nama: string;
    telepon: string | number;
    alamat: string;
    qris: File | null; // Ubah menjadi nullable
    jam_buka: number | string;
    jam_tutup: number | string;
    user_id: number;
    tautan: string;
    _method?: string; // Tambahkan untuk method spoofing
};

export default function EditTenant({ tenant }: { tenant: TenantForm }) {
    // Inisialisasi form data dengan _method untuk spoofing
    const { data, setData, post, processing, errors } = useForm<TenantForm>({
        id: tenant.id,
        nama: tenant.nama,
        telepon: tenant.telepon,
        alamat: tenant.alamat,
        qris: null, // Set ke null untuk file baru
        jam_buka: tenant.jam_buka,
        jam_tutup: tenant.jam_tutup,
        user_id: tenant.user_id,
        tautan: tenant.tautan,
        _method: 'PUT', // Method spoofing untuk Laravel
    });

    const [deleting, setDeleting] = useState(false);
    const [qrisPreview, setQrisPreview] = useState<string | null>(null);

    const handleDelete: FormEventHandler = (e) => {
        e.preventDefault();
        setDeleting(true);
        router.delete(route('admin.tenant.destroy', tenant.id), {
            onSuccess: () => {
                router.visit(route('admin.tenant.index'));
            },
            onError: (error) => {
                console.error('Failed to delete tenant:', error);
            },
            onFinish: () => {
                setDeleting(false);
            },
        });
    };

    const handleQrisChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Set file ke form data
            setData('qris', file);

            // Buat preview untuk user experience
            const reader = new FileReader();
            reader.onload = (e) => {
                setQrisPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            // Reset jika tidak ada file yang dipilih
            setData('qris', null);
            setQrisPreview(null);
        }
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log("Submitting data:", data);
        
        // Gunakan post() dengan method spoofing, bukan put()
        post(route('admin.tenant.update', tenant.id), {
            // Set forceFormData ke true untuk memaksa penggunaan FormData
            forceFormData: true,
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                console.log('Update berhasil');
                router.visit(route('admin.tenant.edit', tenant.id));
            },
            onError: (errors) => {
                console.error('Update gagal:', errors);
            },
            onFinish: () => {
                console.log('Form submission finished');
            },
        });
    };

    const { ToasterComponent } = useFlashMessages();

    return (
        <AppLayout breadcrumbs={breadcrumbs} userType='admin'>
            <Head title="Ubah Warung" />
            <ToasterComponent />
            <form className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto" onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h1 className='text-xl py-2 font-semibold'>Ubah Warung</h1>
                    <div className="flex items-center justify-center max-w-sm mb-2 gap-4">
                        <Button variant="outline" asChild>
                            <Link href={`/admin/tenant/${tenant.id}`}><Eye />Lihat</Link>
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger className={cn(buttonVariants({ variant: "destructive" }))}>
                                <Trash2 />Hapus
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Apakah Anda yakin ingin menghapus warung ini?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Aksi ini tidak dapat dibatalkan. Warung ini akan dihapus secara permanen
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
                <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 items-start gap-4 w-full'>
                    <div className='grid items-center col-span-2 gap-4'>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='nama'>Nama Warung
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
                                placeholder='Masukkan nama warung Anda'
                                className="w-full"
                            />
                            <InputError message={errors.nama} />
                        </div>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='alamat'>Alamat Warung
                                <span className='text-red-500'>*</span>
                            </Label>
                            <Textarea
                                id='alamat'
                                required
                                autoFocus
                                tabIndex={2}
                                value={data.alamat}
                                onChange={(e) => setData('alamat', e.target.value)}
                                disabled={processing}
                                placeholder='Masukkan alamat warung Anda'
                                className="w-full"
                            />
                            <InputError message={errors.alamat} />
                        </div>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='telepon'>Nomor Telepon
                                <span className='text-red-500'>*</span>
                            </Label>
                            <Input
                                id='telepon'
                                type='tel'
                                required
                                autoFocus
                                tabIndex={3}
                                value={data.telepon}
                                onChange={(e) => setData('telepon', e.target.value)}
                                disabled={processing}
                                placeholder='Masukkan nomor telepon warung Anda'
                                className="w-full"
                            />
                            <InputError message={errors.telepon} />
                        </div>
                        <div className='relative grid gap-4 mt-2 col-span-1'>
                            <Label htmlFor='jambuka'>Waktu Buka
                                <span className='text-red-500'>*</span>
                            </Label>
                            <Input
                                id='jambuka'
                                type='time'
                                placeholder="HH:MM"
                                required
                                autoFocus
                                tabIndex={4}
                                value={data.jam_buka}
                                onChange={(e) => setData('jam_buka', e.target.value)}
                                disabled={processing}
                                className="w-full [&::-webkit-calendar-picker-indicator]:opacity-0"
                            />
                            <span className="absolute right-3 top-12 transform -translate-y-1/2 text-sm text-primary/50">
                                WITA
                            </span>
                            <InputError message={errors.jam_buka} />
                        </div>
                        <div className='relative grid gap-4 mt-2 col-span-1'>
                            <Label htmlFor='jamtutup'>Waktu Tutup
                                <span className='text-red-500'>*</span>
                            </Label>
                            <Input
                                id='jamtutup'
                                type='time'
                                placeholder="HH:MM"
                                required
                                autoFocus
                                tabIndex={5}
                                value={data.jam_tutup}
                                onChange={(e) => setData('jam_tutup', e.target.value)}
                                disabled={processing}
                                className="w-full [&::-webkit-calendar-picker-indicator]:opacity-0"
                            />
                            <span className="absolute right-3 top-12 transform -translate-y-1/2 text-sm text-primary/50">
                                WITA
                            </span>
                            <InputError message={errors.jam_tutup} />
                        </div>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='tautan'>Tautan</Label>
                            <div className="flex w-full items-center gap-2">
                                <Input
                                    id='tautan'
                                    type='text'
                                    disabled
                                    value={`${window.location.origin}${tenant.tautan}`}
                                    className="w-full"
                                />
                                <Tooltip>
                                    <TooltipTrigger type='button' className={cn(buttonVariants({ variant: 'outline' }))}
                                        onClick={() => {
                                            navigator.clipboard.writeText(`${window.location.origin}${tenant.tautan}`);
                                        }}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Salin</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                    <div className='grid grid-rows-1 items-start col-span-2 gap-4'>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='qris'>Kode QRIS
                                <span className='text-red-500'>*</span>
                            </Label>
                            <Input
                                id='qris'
                                type='file'
                                accept='image/png, image/jpeg, image/jpg, image/webp'
                                tabIndex={6}
                                onChange={handleQrisChange}
                                disabled={processing}
                                className="w-full"
                            />
                            <InputError message={errors.qris} />
                        </div>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <AspectRatio ratio={16 / 9} className='relative'>
                                {qrisPreview ? (
                                    <img
                                        src={qrisPreview}
                                        alt="QRIS Preview"
                                        className="h-full w-full rounded-md object-contain aspect-video"
                                    />
                                ) : (
                                    <img
                                        src={tenant.qris ? `${window.location.origin}/storage/${tenant.qris}` : `${window.location.origin}/images/blank-photo-icon.jpg`}
                                        alt="QRIS Image"
                                        className="h-full w-full rounded-md object-contain aspect-video"
                                    />
                                )}
                            </AspectRatio>
                        </div>
                    </div>
                </div>
                <div className='flex gap-4 mt-2'>
                    <Button type="submit" variant={"primary"} tabIndex={3} disabled={processing}>
                        {processing ?
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                            : "Simpan"}
                    </Button>
                    <Button variant={"outline"}>
                        <Link href="/admin/tenant" className="w-full">
                            Batal
                        </Link>
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}