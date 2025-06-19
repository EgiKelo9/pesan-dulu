import AppLayout from '@/layouts/app-layout';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { useFlashMessages } from '@/hooks/use-flash-messages';

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import InputError from '@/components/input-error';
import { AspectRatio } from "@/components/ui/aspect-ratio";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pedagang',
        href: '/merchant/dashboard',
    },
    {
        title: 'Warung',
        href: '/merchant/tenant',
    },
    {
        title: 'Buat',
        href: '/merchant/tenant/create',
    },
];

type TenantForm = {
    nama: string;
    telepon: string | number;
    alamat: string;
    qris: File | null;
    jam_buka: number | string;
    jam_tutup: number | string;
};

type UserData = {
    nama: string;
    telepon: string | number;
}

export default function CreateTenant({ user }: { user: UserData }) {
    const { data, setData, post, processing, errors, reset, cancel } = useForm<Required<TenantForm>>({
        nama: 'Warung ' + user.nama.split(' ')[0],
        telepon: user.telepon,
        alamat: '',
        qris: null as File | null,
        jam_buka: '',
        jam_tutup: '',
    });

    const [qrisPreview, setQrisPreview] = useState<string | null>(null);

    const handleQrisChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('qris', file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setQrisPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('merchant.tenant.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
            },
            onFinish: () => {
                console.log('Form submission finished');
            },
        });
    };

    const { ToasterComponent } = useFlashMessages();

    return (
        <AppLayout breadcrumbs={breadcrumbs} userType='merchant'>
            <Head title="Buat Warung" />
            <ToasterComponent />
            <form className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto" onSubmit={submit}>
                <h1 className='text-xl py-2 font-semibold'>Buat Warung</h1>
                <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 items-start gap-4 w-full'>
                    <div className='grid items-center col-span-2 gap-4'>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='nama'>Nama Warung</Label>
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
                            <Label htmlFor='alamat'>Alamat Warung</Label>
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
                            <Label htmlFor='telepon'>Nomor Telepon</Label>
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
                            <Label htmlFor='jambuka'>Waktu Buka</Label>
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
                            <Label htmlFor='jamtutup'>Waktu Tutup</Label>
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
                            <Input
                                id='tautan'
                                type='text'
                                disabled
                                placeholder='Tautan diperoleh ketika warung telah terdaftar'
                                className="w-full"
                            />
                        </div>
                    </div>
                    <div className='grid items-start col-span-2 gap-4'>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='qris'>Kode QRIS</Label>
                            <Input
                                id='qris'
                                type='file'
                                accept='image/png, image/jpeg, image/jpg, image/webp'
                                required
                                tabIndex={6}
                                onChange={handleQrisChange}
                                disabled={processing}
                                className="w-full"
                            />
                            <InputError message={errors.qris} />
                        </div>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <AspectRatio ratio={16 / 9} className="bg-muted">
                                {qrisPreview ? (
                                    <img
                                        src={qrisPreview}
                                        alt="QRIS Preview"
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
                        <Link href="/merchant/tenant" className="w-full">
                            Batal
                        </Link>
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
