import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useFlashMessages } from '@/hooks/use-flash-messages';

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button, buttonVariants } from "@/components/ui/button"
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Pencil, Download } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from '@/lib/utils';

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

        title: 'Lihat',
        href: '/admin/merchant/{id}',
    },
];

type UserData = {
    id: number;
    nama: string;
    telepon: string | number;
    email: string;
    status: 'aktif' | 'nonaktif';
    avatar?: string;
};

export default function ShowMerchant({ merchant }: { merchant: UserData }) {
    const { ToasterComponent } = useFlashMessages();

    return (
        <AppLayout breadcrumbs={breadcrumbs} userType='admin'>
            <Head title="Lihat Pedagang" />
            <ToasterComponent />
            <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h1 className='text-xl py-2 font-semibold'>Lihat Pedagang</h1>
                    <Button variant="outline" asChild>
                        <Link href={`/admin/merchant/${merchant.id}/edit`}><Pencil />Ubah</Link>
                    </Button>
                </div>
                <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 items-start gap-4 w-full'>
                    <div className='grid items-center col-span-2 gap-4'>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='nama'>Nama Pedagang</Label>
                            <Input
                                id='nama'
                                type='text'
                                tabIndex={1}
                                value={merchant.nama}
                                disabled
                                className="w-full"
                            />
                        </div>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='telepon'>Nomor Telepon</Label>
                            <Input
                                id='telepon'
                                type='text'
                                tabIndex={2}
                                value={merchant.telepon}
                                disabled
                                className="w-full"
                            />
                        </div>
                        <div className='relative grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='email'>Alamat Email</Label>
                            <Input
                                id='email'
                                type='text'
                                tabIndex={4}
                                value={merchant.email}
                                disabled
                                className="w-full"
                            />
                        </div>
                        <div className='relative grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='status'>Status</Label>
                            <Input
                                id='status'
                                type='text'
                                tabIndex={5}
                                value={merchant.status}
                                disabled
                                className="w-full capitalize"
                            />
                        </div>
                    </div>
                    <div className='grid items-start col-span-2 gap-4'>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='nama'>Foto Profil</Label>
                            <Input
                                id='nama'
                                type='text'
                                tabIndex={1}
                                value={merchant.avatar}
                                disabled
                                className="w-full"
                            />
                        </div>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <AspectRatio ratio={16 / 9} className='relative'>
                                <img
                                    src={merchant.avatar ? `${window.location.origin}/storage/${merchant.avatar}` : `${window.location.origin}/images/blank-photo-icon.jpg`}
                                    alt="Avatar Image"
                                    className="h-full w-full rounded-md object-contain aspect-video"
                                />
                                <Tooltip>
                                    <TooltipTrigger className={cn(buttonVariants({ 'variant': 'outline' }), 'absolute top-0 right-0')}
                                        onClick={() => {
                                            const link = document.createElement('a');
                                            link.href = `${window.location.origin}/storage/${merchant.avatar}`;
                                            link.download = `avatar-${merchant.nama}.png`;
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                        }}>
                                        <Download className="h-4 w-4" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Unduh</p>
                                    </TooltipContent>
                                </Tooltip>
                            </AspectRatio>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout >
    );
}
