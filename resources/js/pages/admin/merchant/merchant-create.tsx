import AppLayout from '@/layouts/app-layout';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { useFlashMessages } from '@/hooks/use-flash-messages';

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import InputError from '@/components/input-error';
import { AspectRatio } from "@/components/ui/aspect-ratio";

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
        title: 'Buat',
        href: '/admin/merchant/create',
    },
];

type UserForm = {
    nama: string;
    telepon: string | number;
    email: string;
    avatar?: File | null;
    password: string;
    password_confirmation: string;
};

export default function CreateMerchant() {
    const { data, setData, post, processing, errors, reset, cancel } = useForm<Required<UserForm>>({
        nama: '',
        telepon: '',
        email: '',
        avatar: null,
        password: '',
        password_confirmation: '',
    });

    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatarPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.merchant.store'), {
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
        <AppLayout breadcrumbs={breadcrumbs} userType='admin'>
            <Head title="Buat Pedagang" />
            <ToasterComponent />
            <form className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto" onSubmit={submit}>
                <h1 className='text-xl py-2 font-semibold'>Buat Pedagang</h1>
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
                                placeholder='Masukkan Nomor Telepon Pedagang'
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
                                placeholder="Masukkan Alamat Email Pedagang"
                                className="w-full"
                            />
                            <InputError message={errors.email} />
                        </div>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='password'>Kata Sandi
                                <span className='text-red-500'>*</span>
                            </Label>
                            <Input
                                id='password'
                                type='password'
                                required
                                autoFocus
                                tabIndex={4}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={processing}
                                placeholder="Masukkan Kata Sandi Pedagang"
                                className="w-full"
                            />
                            <InputError message={errors.password} />
                        </div>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='password_confirmation'>Konfirmasi Kata Sandi
                                <span className='text-red-500'>*</span>
                            </Label>
                            <Input
                                id='password_confirmation'
                                type='password'
                                required
                                autoFocus
                                autoComplete='new-password'
                                tabIndex={5}
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                disabled={processing}
                                placeholder="Masukkan Kata Sandi Pedagang"
                                className="w-full"
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>
                    </div>
                    <div className='grid items-start col-span-2 gap-4'>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='avatar'>Foto Profil</Label>
                            <Input
                                id='avatar'
                                type='file'
                                accept='image/png, image/jpeg, image/jpg, image/webp'
                                tabIndex={6}
                                onChange={handleAvatarChange}
                                disabled={processing}
                                className="w-full"
                            />
                            <InputError message={errors.avatar} />
                        </div>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <AspectRatio ratio={16 / 9} className="bg-muted">
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="Avatar Preview"
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
