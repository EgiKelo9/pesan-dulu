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
import { AspectRatio } from "@/components/ui/aspect-ratio";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pedagang',
        href: '/merchant/dashboard',
    },
    {
        title: 'Menu',
        href: '/merchant/menu',
    },
    {
        title: 'Ubah',
        href: '/merchant/menu/{id}/edit',
    },
];

type MenuForm = {
    id: number;
    nama: string;
    status: 'tersedia' | 'tidak tersedia';
    harga: number;
    deskripsi: string;
    foto: File | null;
    category_id: number;
    tenant_id: number;
    _method?: string;
};

type CategoryData = {
    id: number;
    nama: string;
    deskripsi: string;
};

export default function EditCategory({ menu, categories }: { menu: MenuForm, categories: CategoryData[] }) {
    const { data, setData, post, processing, errors } = useForm<Required<MenuForm>>({
        id: menu.id,
        nama: menu.nama,
        status: menu.status,
        harga: menu.harga,
        deskripsi: menu.deskripsi,
        foto: null,
        category_id: menu.category_id,
        tenant_id: menu.tenant_id,
        _method: 'PUT',
    });

    const [deleting, setDeleting] = useState(false);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log("Submitting data:", data);
        
        // Gunakan post() dengan method spoofing, bukan put()
        post(route('merchant.menu.update', menu.id), {
            // Set forceFormData ke true untuk memaksa penggunaan FormData
            forceFormData: true,
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                console.log('Update berhasil');
                router.visit(route('merchant.menu.edit', menu.id));
            },
            onError: (errors) => {
                console.error('Update gagal:', errors);
            },
            onFinish: () => {
                console.log('Form submission finished');
            },
        });
    };

    const [fotoPreview, setFotoPreview] = useState<string | null>(null);

    const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Set file ke form data
            setData('foto', file);

            // Buat preview untuk user experience
            const reader = new FileReader();
            reader.onload = (e) => {
                setFotoPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            // Reset jika tidak ada file yang dipilih
            setData('foto', null);
            setFotoPreview(null);
        }
    };

    const handleDelete: FormEventHandler = (e) => {
        e.preventDefault();
        setDeleting(true);
        router.delete(route('merchant.menu.destroy', menu.id), {
            onSuccess: () => {
                router.visit(route('merchant.menu.index'));
            },
            onError: (error) => {
                console.error('Failed to delete menu:', error);
            },
            onFinish: () => {
                setDeleting(false);
            },
        });
    };

    const { ToasterComponent } = useFlashMessages();

    return (
        <AppLayout breadcrumbs={breadcrumbs} userType='merchant'>
            <Head title="Ubah Menu" />
            <ToasterComponent />
            <form className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto" onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h1 className='text-xl py-2 font-semibold'>Ubah Menu</h1>
                    <div className="flex items-center justify-center max-w-sm mb-2 gap-4">
                        <Button variant="outline" asChild>
                            <Link href={`/merchant/menu/${menu.id}`}><Eye />Lihat</Link>
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger className={cn(buttonVariants({ variant: "destructive" }))}>
                                <Trash2 />Hapus
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Apakah Anda yakin ingin menghapus menu ini?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Aksi ini tidak dapat dibatalkan. Menu ini akan dihapus secara permanen
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
                            <Label htmlFor='nama'>Nama Menu</Label>
                            <Input
                                id='nama'
                                type='text'
                                required
                                autoFocus
                                tabIndex={1}
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                disabled={processing}
                                placeholder='Masukkan nama menu Anda'
                                className="w-full"
                            />
                            <InputError message={errors.nama} />
                        </div>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='deskripsi'>Deskripsi Menu</Label>
                            <Textarea
                                id='deskripsi'
                                required
                                autoFocus
                                tabIndex={2}
                                value={data.deskripsi}
                                onChange={(e) => setData('deskripsi', e.target.value)}
                                disabled={processing}
                                placeholder='Masukkan deskripsi menu Anda'
                                className="w-full"
                            />
                            <InputError message={errors.deskripsi} />
                        </div>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='category_id'>Kategori Menu</Label>
                            <Select onValueChange={(value) => setData('category_id', Number(value))}>
                                <SelectTrigger
                                    id='category_id'
                                    autoFocus
                                    tabIndex={3}
                                    disabled={processing}
                                    className="w-full"
                                >
                                    <SelectValue placeholder="Pilih Kategori Menu" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem
                                            key={category.id}
                                            value={String(category.id)}
                                        >
                                            {category.nama}
                                        </SelectItem>))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.category_id} />
                        </div>
                        <div className='relative grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='harga'>Harga Menu</Label>
                            <span className="absolute left-3 top-12 transform -translate-y-1/2 text-sm text-primary/50">
                                Rp
                            </span>
                            <Input
                                id='harga'
                                type='number'
                                required
                                autoFocus
                                tabIndex={4}
                                value={data.harga === 0 ? '' : data.harga}
                                onChange={(e) => setData('harga', e.target.value ? Number(e.target.value) : 0)}
                                disabled={processing}
                                className="w-full pl-8 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            />
                            <InputError message={errors.harga} />
                        </div>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='status'>Status Menu</Label>
                            <Select value={data.status}>
                                <SelectTrigger
                                    id='status'
                                    autoFocus
                                    tabIndex={5}
                                    disabled={processing}
                                    className="w-full"
                                >
                                    <SelectValue placeholder="Pilih Status Menu" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem
                                        key="tersedia"
                                        value="tersedia"
                                        onClick={() => setData('status', 'tersedia')}
                                    >
                                        Tersedia
                                    </SelectItem>
                                    <SelectItem
                                        key="tidak tersedia"
                                        value="tidak tersedia"
                                        onClick={() => setData('status', 'tidak tersedia')}
                                    >
                                        Tidak Tersedia
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.status} />
                        </div>
                    </div>
                    <div className='grid items-start col-span-2 gap-4'>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='foto'>Foto Menu</Label>
                            <Input
                                id='foto'
                                type='file'
                                accept='image/png, image/jpeg, image/jpg, image/webp'
                                tabIndex={6}
                                onChange={handleFotoChange}
                                disabled={processing}
                                className="w-full"
                            />
                            <InputError message={errors.foto} />
                        </div>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <AspectRatio ratio={16 / 9}>
                                {fotoPreview ? (
                                    <img
                                        src={fotoPreview}
                                        alt="Menu Preview"
                                        className="h-full w-full rounded-md object-contain aspect-video"
                                    />
                                ) : (
                                    <img
                                        src={menu.foto ? `${window.location.origin}/storage/${menu.foto}` : `${window.location.origin}/images/blank-photo-icon.jpg`}
                                        alt="Menu Image"
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
                        <Link href={`/merchant/menu/${menu.id}`} className="w-full">
                            Batal
                        </Link>
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
