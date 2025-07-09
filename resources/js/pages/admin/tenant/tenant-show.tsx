import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import { Download } from 'lucide-react';

interface ShowReportProps {
  report: any[];
}

export default function ShowReport({ report }: ShowReportProps) {
  const data = report[0];

  const categories = (() => {
    try {
      return JSON.parse(data.categories) as string[];
    } catch {
      return [];
    }
  })();

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Laporan', href: '/admin/report' },
        { title: `Laporan #${data.id}`, href: `/admin/report/${data.id}` },
      ]}
      userType="admin"
    >
      <Head title={`Laporan #${data.id}`} />

      <div className="flex h-full w-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className='text-xl py-2 font-semibold'>Detail Laporan</h1>
        </div>
        <div className='grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 items-start gap-4 w-full'>
          <div className='grid items-center col-span-2 gap-4'>
            <div className='grid gap-4 mt-2 col-span-2'>
              <Label>ID Laporan</Label>
              <Input value={data.id} disabled className="w-full" />
            </div>
            <div className='grid gap-4 mt-2 col-span-2'>
              <Label>Nama Pemesan</Label>
              <Input value={data.order?.nama ?? "-"} disabled className="w-full" />
            </div>
            <div className='grid gap-4 mt-2 col-span-2'>
              <Label>Nama Tenant</Label>
              <Input value={data.order?.tenant?.nama ?? "-"} disabled className="w-full" />
            </div>
            <div className='grid gap-4 mt-2 col-span-2'>
              <Label>Telepon Tenant</Label>
              <Input value={data.order?.tenant?.telepon ?? "-"} disabled className="w-full" />
            </div>
            <div className='grid gap-4 mt-2 col-span-2'>
              <Label>Status Pesanan</Label>
              <Input value={data.order?.status ?? "-"} disabled className="w-full" />
            </div>
            <div className='grid gap-4 mt-2 col-span-2'>
              <Label>Total Harga</Label>
              <Input value={`Rp${data.order?.total_harga?.toLocaleString() ?? "-"}`} disabled className="w-full" />
            </div>
            <div className='grid gap-4 mt-2 col-span-2'>
              <Label>Tanggal Dibuat</Label>
              <Input
                value={new Date(data.created_at).toLocaleString('id-ID', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                disabled
                className="w-full"
              />
            </div>
            <div className='grid gap-4 mt-2 col-span-2'>
              <Label>Alasan Laporan</Label>
              <Textarea
                value={data.reason}
                disabled
                className="w-full min-h-[100px]"
              />
            </div>
          </div>

          <div className='grid items-start col-span-2 gap-4'>
            {data.order?.bukti_pembayaran && (
              <>
                <div className='grid gap-4 mt-2 col-span-2'>
                  <Label>Bukti Pembayaran</Label>
                  <Input
                    value={data.order?.bukti_pembayaran}
                    disabled
                    className="w-full"
                  />
                </div>
                <div className='grid gap-4 mt-2 col-span-2'>
                  <AspectRatio ratio={16 / 9} className='relative'>
                    <img
                      src={`${window.location.origin}/storage/${data.order.bukti_pembayaran}`}
                      alt="Bukti Pembayaran"
                      className="h-full w-full rounded-md object-contain aspect-video"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className={cn("absolute top-0 right-0 m-2")}
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = `${window.location.origin}/storage/${data.order.bukti_pembayaran}`;
                        link.download = `bukti_pembayaran-${data.order.nama}.png`;
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
            <div className='grid gap-4 mt-2 col-span-2'>
              <Label>Kategori Laporan</Label>
              {categories.length > 0 ? (
                <ul className="mt-2 list-disc list-inside text-sm">
                  {categories.map((category, idx) => (
                    <li key={idx}>{category}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">Tidak ada kategori</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
