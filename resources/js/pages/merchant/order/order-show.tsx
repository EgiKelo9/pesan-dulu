import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useFlashMessages } from '@/hooks/use-flash-messages';

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Link } from '@inertiajs/react';
import { Pencil, Download } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pedagang',
        href: '/merchant/dashboard',
    },
    {
        title: 'Pesanan',
        href: '/merchant/order',
    },
    {
        title: 'Lihat',
        href: '/merchant/order/{id}',
    },
];

type OrderData = {
    id: number
    tanggal_pesanan: Date | string
    nama: string
    telepon: string
    waktu_diambil: Date | string
    status: 'menunggu' | 'diterima' | 'siap' | 'diambil' | 'gagal'
    total_harga: number
    tenant_id: number
    menus: any[]
};

export default function ShowOrder({ order }: { order: OrderData }) {
    const { ToasterComponent } = useFlashMessages();

    return (
        <AppLayout breadcrumbs={breadcrumbs} userType='merchant'>
            <Head title="Lihat Pesanan" />
            <ToasterComponent />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <h1 className='text-xl py-2 font-semibold'>Lihat Pesanan</h1>
                <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 items-start gap-4 w-full'>
                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='id'>ID Pesanan</Label>
                        <Input
                            id='id'
                            type='text'
                            value={order.id}
                            disabled
                            className="w-full"
                        />
                    </div>
                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='nama'>Nama Pelanggan</Label>
                        <Input
                            id='nama'
                            type='text'
                            value={order.nama}
                            disabled
                            className="w-full"
                        />
                    </div>
                    <div className='relative grid gap-4 mt-2 col-span-1'>
                        <Label htmlFor='waktumasuk'>Waktu Masuk</Label>
                        <Input
                            id='waktumasuk'
                            type='text'
                            tabIndex={4}
                            value={new Date(order.tanggal_pesanan).toLocaleTimeString('id-ID', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                            disabled
                            className="w-full"
                        />
                        <span className="absolute right-3 top-5/7 transform -translate-y-1/2 text-sm text-primary/50">
                            WITA
                        </span>
                    </div>
                    <div className='relative grid gap-4 mt-2 col-span-1'>
                        <Label htmlFor='waktudiambil'>Waktu Diambil</Label>
                        <Input
                            id='waktudiambil'
                            type='text'
                            tabIndex={4}
                            value={String(order.waktu_diambil)}
                            disabled
                            className="w-full"
                        />
                        <span className="absolute right-3 top-5/7 transform -translate-y-1/2 text-sm text-primary/50">
                            WITA
                        </span>
                    </div>
                    <div className='grid gap-4 mt-2 col-span-1'>
                        <Label htmlFor='telepon'>Telepon Pelanggan</Label>
                        <Input
                            id='telepon'
                            type='tel'
                            value={order.telepon}
                            disabled
                            className="w-full"
                        />
                    </div>
                    <div className='grid gap-4 mt-2 col-span-1'>
                        <Label htmlFor='status'>Status Pesanan</Label>
                        <Input
                            id='status'
                            type='text'
                            value={order.status}
                            disabled
                            className="w-full capitalize"
                        />
                    </div>
                    <div className='grid gap-4 mt-2 col-span-2 sm:col-span-4 md:col-span-2 lg:col-span-4'>
                        <Label htmlFor='detailpesanan'>Detail Pesanan</Label>
                        <Textarea
                            id='detailpesanan'
                            value={order.menus.map(
                                menu => `${menu.nama} - (${menu.pivot.jumlah} x Rp${menu.harga.toLocaleString('id-ID')})`)
                                .join('\n')
                                .concat(`\n\nTotal Harga: Rp${order.total_harga.toLocaleString('id-ID')}`
                                )}
                            disabled
                            className="w-full min-h-48"
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
