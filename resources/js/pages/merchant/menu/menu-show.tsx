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
        title: 'Menu',
        href: '/merchant/menu',
    },
    {
        title: 'Lihat',
        href: '/merchant/menu/{id}',
    },
];

type MenuData = {
    id: number;
    nama: string;
    status: 'tersedia' | 'tidak tersedia';
    harga: number;
    deskripsi: string;
    foto: string;
    category_id: string | number;
};

export default function ShowMenu({ menu }: { menu: MenuData }) {
    const { ToasterComponent } = useFlashMessages();

    return (
        <AppLayout breadcrumbs={breadcrumbs} userType='merchant'>
            <Head title="Lihat Menu" />
            <ToasterComponent />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h1 className='text-xl py-2 font-semibold'>Lihat Menu</h1>
                    <Button variant="outline" asChild>
                        <Link href={`/merchant/menu/${menu.id}/edit`}><Pencil />Ubah</Link>
                    </Button>
                </div>
                <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 items-start gap-4 w-full'>
                    <div className='grid items-center col-span-2 gap-4'>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='nama'>Nama Menu</Label>
                            <Input
                                id='nama'
                                type='text'
                                value={menu.nama}
                                disabled
                                className="w-full"
                            />
                        </div>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='deskripsi'>Deskripsi Menu</Label>
                            <Textarea
                                id='deskripsi'
                                value={menu.deskripsi}
                                disabled
                                className="w-full"
                            />
                        </div>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='nama'>Kategori Menu</Label>
                            <Input
                                id='nama'
                                type='text'
                                value={menu.category_id}
                                disabled
                                className="w-full"
                            />
                        </div>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='nama'>Harga Menu</Label>
                            <Input
                                id='nama'
                                type='text'
                                value={new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                }).format(menu.harga)}
                                disabled
                                className="w-full"
                            />
                        </div>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='nama'>Status Menu</Label>
                            <Input
                                id='nama'
                                type='text'
                                value={menu.status}
                                disabled
                                className="w-full capitalize"
                            />
                        </div>
                    </div>
                    <div className='grid grid-rows-1 items-start col-span-2 gap-4'>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <Label htmlFor='nama'>Foto Menu</Label>
                            <Input
                                id='nama'
                                type='text'
                                tabIndex={1}
                                value={menu.foto}
                                disabled
                                className="w-full"
                            />
                        </div>
                        <div className='grid gap-4 mt-2 col-span-2'>
                            <AspectRatio ratio={16 / 9} className='relative'>
                                <img
                                    src={menu.foto ? `${window.location.origin}/storage/${menu.foto}` : `${window.location.origin}/images/blank-photo-icon.jpg`}
                                    alt="Menu Image"
                                    className="h-full w-full rounded-md object-contain aspect-video"
                                />
                                <Tooltip>
                                    <TooltipTrigger className={cn(buttonVariants({ 'variant': 'outline' }), 'absolute top-0 right-0')}
                                        onClick={() => {
                                            const link = document.createElement('a');
                                            link.href = `${window.location.origin}/storage/${menu.foto}`;
                                            link.download = `menu-${menu.nama}.png`;
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
        </AppLayout>
    );
}
