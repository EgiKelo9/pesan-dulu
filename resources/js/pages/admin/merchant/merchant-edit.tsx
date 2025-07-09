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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Admin',
        href: '/admin/dashboard',
    },
    {
        title: 'Pedagang',
        href: '/admin/merchant',
    },
    {
        title: 'Ubah',
        href: '/admin/merchant/{id}/edit',
    },
];

type UserForm = {
    id: number;
    nama: string;
    telepon: string | number;
    email: string;
    status: 'aktif' | 'nonaktif';
    avatar?: File | null;
    _method?: string; // Tambahkan untuk method spoofing
};

export default function EditMerchant({ merchant }: { merchant: UserForm }) {
    // Inisialisasi form data dengan _method untuk spoofing
    const { data, setData, post, processing, errors } = useForm<UserForm>({
        id: merchant.id,
        nama: merchant.nama,
        telepon: merchant.telepon,
        email: merchant.email,
        status: merchant.status,
        avatar: null, // Set ke null untuk file baru
        _method: 'PUT', // Method spoofing untuk Laravel
    });

    const [deleting, setDeleting] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const handleDelete: FormEventHandler = (e) => {
        e.preventDefault();
        setDeleting(true);
        router.delete(route('admin.merchant.destroy', merchant.id), {
            onSuccess: () => {
                router.visit(route('admin.merchant.index'));
            },
            onError: (error) => {
                console.error('Failed to delete merchant:', error);
            },
            onFinish: () => {
                setDeleting(false);
            },
        });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Set file ke form data
            setData('avatar', file);

            // Buat preview untuk user experience
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            // Reset jika tidak ada file yang dipilih
            setData('avatar', null);
            setAvatarPreview(null);
        }
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log("Submitting data:", data);

        // Gunakan post() dengan method spoofing, bukan put()
        post(route('admin.merchant.update', merchant.id), {
            // Set forceFormData ke true untuk memaksa penggunaan FormData
            forceFormData: true,
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                console.log('Update berhasil');
                router.visit(route('admin.merchant.edit', merchant.id));
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
            <Head title="Ubah Pedagang" />
            <ToasterComponent />
            <form className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto" onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h1 className='text-xl py-2 font-semibold'>Ubah Pedagang</h1>
                    <div className="flex items-center justify-center max-w-sm mb-2 gap-4">
                        <Button variant="outline" asChild>
                            <Link href={`/admin/merchant/${merchant.id}`}><Eye />Lihat</Link>
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger className={cn(buttonVariants({ variant: "destructive" }))}>
                                <Trash2 />Hapus
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Apakah Anda yakin ingin menghapus pedagang ini?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Aksi ini tidak dapat dibatalkan. Pedagang ini akan dihapus secara permanen
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
                            <Label htmlFor='nama'>Nama Pedagang
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
                                placeholder='Masukkan Nama Pedagang'
                                className="w-full"
                            />
                            <InputError message={errors.nama} />
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
                                tabIndex={2}
                                value={data.telepon}
                                onChange={(e) => setData('telepon', e.target.value)}
                                disabled={processing}
                                placeholder='Masukkan nomor telepon pedagang'
                                className="w-full"
                            />
                            <InputError message={errors.telepon} />
                        </div>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='email'>Alamat Email
                                <span className='text-red-500'>*</span>
                            </Label>
                            <Input
                                id='email'
                                type='email'
                                required
                                autoFocus
                                tabIndex={3}
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                                placeholder='Masukkan alamat email pedagang'
                                className="w-full"
                            />
                            <InputError message={errors.email} />
                        </div>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='status'>Status
                                <span className='text-red-500'>*</span>
                            </Label>
                            <Select value={String(data.status)} onValueChange={(value) => setData('status', value as 'aktif' | 'nonaktif')}>
                                <SelectTrigger
                                    id='status'
                                    autoFocus
                                    tabIndex={4}
                                    disabled={processing}
                                    className="w-full"
                                >
                                    <SelectValue placeholder={String(data.status)} defaultValue={data.status} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="aktif">Aktif</SelectItem>
                                    <SelectItem value="nonaktif">Nonaktif</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.status} />
                        </div>
                    </div>
                    <div className='grid grid-rows-1 items-start col-span-2 gap-4'>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='avatar'>Foto Profil</Label>
                            <Input
                                id='avatar'
                                type='file'
                                accept='image/png, image/jpeg, image/jpg, image/webp'
                                tabIndex={5}
                                onChange={handleAvatarChange}
                                disabled={processing}
                                className="w-full"
                            />
                            <InputError message={errors.avatar} />
                        </div>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <AspectRatio ratio={16 / 9} className='relative'>
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="Avatar Preview"
                                        className="h-full w-full rounded-md object-contain aspect-video"
                                    />
                                ) : (
                                    <img
                                        src={merchant.avatar ? `${window.location.origin}/storage/${merchant.avatar}` : `${window.location.origin}/images/blank-profile-picture.webp`}
                                        alt="Avatar Image"
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