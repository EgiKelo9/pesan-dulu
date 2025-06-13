import AppLayout from '@/layouts/app-layout';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useFlashMessages } from '@/hooks/use-flash-messages';

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button, buttonVariants } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import InputError from '@/components/input-error';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye, Copy } from 'lucide-react';

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
        title: 'Ubah',
        href: '/merchant/tenant/{id}/edit',
    },
];

type TenantForm = {
    id: number;
    nama: string;
    telepon: string | number;
    alamat: string;
    qris: File;
    jam_buka: number | string;
    jam_tutup: number | string;
    tautan: string;
};

export default function EditTenant({ tenant }: { tenant: TenantForm }) {
    const { data, setData, put, processing, errors } = useForm<Required<TenantForm>>({
        id: tenant.id,
        nama: tenant.nama,
        telepon: tenant.telepon,
        alamat: tenant.alamat,
        qris: tenant.qris,
        jam_buka: tenant.jam_buka,
        jam_tutup: tenant.jam_tutup,
        tautan: tenant.tautan,
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

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('merchant.tenant.update', tenant.id), {
            onSuccess: () => {
                router.visit(route('merchant.tenant.edit', tenant.id));
            },
            onFinish: () => {
                console.log('Form submission finished');
            },
        });
    };

    const { ToasterComponent } = useFlashMessages();

    return (
        <AppLayout breadcrumbs={breadcrumbs} userType='merchant'>
            <Head title="Ubah Warung" />
            <ToasterComponent />
            <form className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto" onSubmit={handleSubmit}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h1 className='text-xl py-2 font-semibold'>Ubah Warung</h1>
                    <div className="flex items-center justify-center max-w-sm mb-2 gap-4">
                        <Button variant="outline" asChild>
                            <Link href={`/merchant/tenant/${tenant.id}`}><Eye />Lihat</Link>
                        </Button>
                    </div>
                </div>
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
                            <div className="flex w-full items-center gap-2">
                                <Input
                                    id='tautan'
                                    type='text'
                                    disabled
                                    value={`${window.location.origin}${tenant.tautan}`}
                                    className="w-full"
                                />
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                navigator.clipboard.writeText(`${window.location.origin}${tenant.tautan}`);
                                            }}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                        <TooltipContent>
                                            <p>Salin</p>
                                        </TooltipContent>
                                    </TooltipTrigger>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                    <div className='grid grid-rows-1 items-start col-span-2 gap-4'>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='qris'>Kode QRIS</Label>
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
                                        src={data.qris ? `${window.location.origin}/storage/${data.qris}` : `${window.location.origin}/images/blank-photo-icon.jpg`}
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
                        <Link href="/merchant/tenant" className="w-full">
                            Batal
                        </Link>
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}
