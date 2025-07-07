import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useFlashMessages } from '@/hooks/use-flash-messages';

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button, buttonVariants } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Pencil, Copy, Download } from 'lucide-react';
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
        title: 'Warung',
        href: '/admin/tenant',
    },
    {
        title: 'Lihat',
        href: '/admin/tenant/{id}',
    },
];

type TenantData = {
    id: number;
    nama: string;
    telepon: string | number;
    alamat: string;
    qris: string;
    jam_buka: number | string;
    jam_tutup: number | string;
    tautan: string;
    user_id: number;
};

export default function ShowTenant({ tenant }: { tenant: TenantData }) {
    const { ToasterComponent } = useFlashMessages();

    return (
        <AppLayout breadcrumbs={breadcrumbs} userType='admin'>
            <Head title="Lihat Warung" />
            <ToasterComponent />
            <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h1 className='text-xl py-2 font-semibold'>Lihat Warung</h1>
                    <Button variant="outline" asChild>
                        <Link href={`/admin/tenant/${tenant.id}/edit`}><Pencil />Ubah</Link>
                    </Button>
                </div>
                <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 items-start gap-4 w-full'>
                    <div className='grid items-center col-span-2 gap-4'>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='nama'>Nama Warung</Label>
                            <Input
                                id='nama'
                                type='text'
                                tabIndex={1}
                                value={tenant.nama}
                                disabled
                                className="w-full"
                            />
                        </div>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='alamat'>Alamat Warung</Label>
                            <Textarea
                                id='alamat'
                                tabIndex={2}
                                value={tenant.alamat}
                                disabled
                                className="w-full"
                            />
                        </div>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='telepon'>Nomor Telepon</Label>
                            <Input
                                id='telepon'
                                type='text'
                                tabIndex={3}
                                value={tenant.telepon}
                                disabled
                                className="w-full"
                            />
                        </div>
                        <div className='relative grid gap-4 mt-2 col-span-1'>
                            <Label htmlFor='jambuka'>Waktu Buka</Label>
                            <Input
                                id='jambuka'
                                type='time'
                                tabIndex={4}
                                value={tenant.jam_buka}
                                disabled
                                className="w-full [&::-webkit-calendar-picker-indicator]:opacity-0"
                            />
                            <span className="absolute right-3 top-5/7 transform -translate-y-1/2 text-sm text-primary/50">
                                WITA
                            </span>
                        </div>
                        <div className='relative grid gap-4 mt-2 col-span-1'>
                            <Label htmlFor='jamtutup'>Waktu Tutup</Label>
                            <Input
                                id='jamtutup'
                                type='time'
                                tabIndex={5}
                                value={tenant.jam_tutup}
                                disabled
                                className="w-full [&::-webkit-calendar-picker-indicator]:opacity-0"
                            />
                            <span className="absolute right-3 top-5/7 transform -translate-y-1/2 text-sm text-primary/50">
                                WITA
                            </span>
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
                                    <TooltipTrigger className={cn(buttonVariants({ 'variant': 'outline' }))} tabIndex={6}
                                        onClick={() => {
                                            navigator.clipboard.writeText(`${window.location.origin}${tenant.tautan}`);
                                        }}>
                                        <Copy className="h-4 w-4" />
                                        <TooltipContent>
                                            <p>Salin</p>
                                        </TooltipContent>
                                    </TooltipTrigger>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                    <div className='grid items-start col-span-2 gap-4'>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='nama'>Kode QRIS</Label>
                            <Input
                                id='nama'
                                type='text'
                                tabIndex={1}
                                value={tenant.qris}
                                disabled
                                className="w-full"
                            />
                        </div>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <AspectRatio ratio={16 / 9} className='relative'>
                                <img
                                    src={tenant.qris ? `${window.location.origin}/storage/${tenant.qris}` : `${window.location.origin}/images/blank-photo-icon.jpg`}
                                    alt="QRIS Image"
                                    className="h-full w-full rounded-md object-contain aspect-video"
                                />
                                <Tooltip>
                                    <TooltipTrigger className={cn(buttonVariants({ 'variant': 'outline' }), 'absolute top-0 right-0')}
                                        onClick={() => {
                                            const link = document.createElement('a');
                                            link.href = `${window.location.origin}/storage/${tenant.qris}`;
                                            link.download = `qris-${tenant.nama}.png`;
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
