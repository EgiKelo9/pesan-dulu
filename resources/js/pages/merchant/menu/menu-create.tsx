import AppLayout from '@/layouts/app-layout';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import InputError from '@/components/input-error';
import { AspectRatio } from "@/components/ui/aspect-ratio";
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
        title: 'Buat',
        href: '/merchant/menu/create',
    },
];

type MenuForm = {
    nama: string;
    status: 'tersedia' | 'tidak tersedia';
    harga: number;
    deskripsi: string;
    foto: File | null;
    category_id: number;
};

type CategoryData = {
    id: number;
    nama: string;
    deskripsi: string;
};

export default function CreateMenu({ categories }: { categories: CategoryData[] }) {
    const { data, setData, post, processing, errors, reset, cancel } = useForm<Required<MenuForm>>({
        nama: '',
        status: 'tersedia',
        harga: 0,
        deskripsi: '',
        foto: null,
        category_id: 0,
    });

    const [fotoPreview, setFotoPreview] = useState<string | null>(null);

    const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('foto', file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setFotoPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('merchant.menu.store'), {
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
            <Head title="Buat Menu" />
            <form className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto" onSubmit={submit}>
                <h1 className='text-xl py-2 font-semibold'>Buat Menu</h1>
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
                                required
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
                                        alt="Foto Preview"
                                        className="h-full w-full rounded-md object-contain aspect-video"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full w-full rounded-md border border-dashed">
                                        <span className="text-muted-foreground">Tidak ada gambar terpilih</span>
                                    </div>
                                )}
                            </AspectRatio>
                        </div>
                    </div>
                </div>
                <div className='flex gap-4 mt-2'>
                    <Button type="submit" variant={"primary"} tabIndex={3} disabled={processing}>
                        {processing ?
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                            : "Buat"}
                    </Button>
                    <Button variant={"outline"}>
                        <Link href="/merchant/menu" className="w-full">
                            Batal
                        </Link>
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
