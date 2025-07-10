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
    bukti_pembayaran: string
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
                            value={String(order.waktu_diambil).substring(0, 5)}
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
                    <div className='grid gap-4 mt-2 col-span-2'>
                        <Label htmlFor='detailpesanan'>Detail Pesanan ({order.menus.length} item)</Label>
                        <div className="bg-card shadow-sm border rounded-lg p-4 overflow-hidden">
                            {order.menus.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-4xl mb-4">📋</div>
                                    <h3 className="text-lg font-medium mb-2">Tidak ada pesanan</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Tidak ada menu dalam pesanan ini.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <ul className="space-y-3 md:space-y-4">
                                        {order.menus.map((item) => (
                                            <li key={item.id} className="border-b last:border-b-0 pb-3 last:pb-0 flex flex-col md:flex-row lg:flex:col xl:flex-row gap-3 sm:gap-4">
                                                {/* Container untuk gambar dan konten */}
                                                <div className="flex gap-3 flex-1">
                                                    {/* Gambar */}
                                                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={
                                                                item.foto
                                                                    ? `${window.location.origin}/storage/${item.foto}`
                                                                    : `${window.location.origin}/images/blank-photo-icon.jpg`
                                                            }
                                                            alt={item.nama}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>

                                                    {/* Konten utama */}
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-medium text-sm md:text-base truncate">{item.nama}</h3>
                                                        {item.pivot?.catatan && (
                                                            <p className="text-xs md:text-sm text-muted-foreground mt-1 max-w-xs whitespace-pre-wrap break-words">
                                                                {item.pivot.catatan}
                                                            </p>
                                                        )}
                                                        <p className="text-xs md:text-sm mt-1 text-muted-foreground">
                                                            {item.pivot?.jumlah ?? 0} x {new Intl.NumberFormat("id-ID", {
                                                                style: "currency",
                                                                currency: "IDR",
                                                            }).format(item.harga ?? 0)}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Harga total - terpisah untuk menghindari overlap */}
                                                <div className="text-right sm:text-right font-semibold self-start md:self-center flex-shrink-0 mt-2 sm:mt-0">
                                                    <span className="text-sm md:text-base font-semibold block">
                                                        {new Intl.NumberFormat("id-ID", {
                                                            style: "currency",
                                                            currency: "IDR",
                                                        }).format((item.pivot?.jumlah ?? 0) * (item.harga ?? 0))}
                                                    </span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Summary */}
                                    <div className="mt-4 pt-4 border-t space-y-2">
                                        <div className="flex justify-between items-center text-base md:text-lg font-bold">
                                            <span>Total:</span>
                                            <span className="text-right">
                                                {new Intl.NumberFormat("id-ID", {
                                                    style: "currency",
                                                    currency: "IDR",
                                                }).format(order.total_harga)}
                                            </span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    {order?.bukti_pembayaran && (
                        <>
                            <div className='grid gap-4 mt-2 col-span-2'>
                                <Label>Bukti Pembayaran</Label>
                                <AspectRatio ratio={16 / 9} className='relative border border-primary/10 rounded-lg'>
                                    <img
                                        src={`${window.location.origin}/storage/${order.bukti_pembayaran}`}
                                        alt="Bukti Pembayaran"
                                        className="h-full w-full rounded-md object-contain aspect-video"
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className={cn("absolute top-0 right-0 m-2")}
                                        onClick={() => {
                                            const link = document.createElement('a');
                                            link.href = `${window.location.origin}/storage/${order.bukti_pembayaran}`;
                                            link.download = `bukti_pembayaran-${order.nama}.png`;
                                            document.body.appendChild(link);
                                            link.click();
                                            document.body.removeChild(link);
                                        }}
                                    >
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </AspectRatio>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
