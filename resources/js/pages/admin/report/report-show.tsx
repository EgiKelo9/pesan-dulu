import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ShowReportProps {
  report: any[];
}

export default function ShowReport({ report }: ShowReportProps) {
  const data = report[0]; // Ambil item pertama

  // Parse kategori
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

      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-xl font-semibold">Detail Laporan</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Nama Pemesan</Label>
            <Input value={data.order?.nama ?? "-"} disabled />
          </div>

          <div>
            <Label>Nama Tenant</Label>
            <Input value={data.order?.tenant?.nama ?? "-"} disabled />
          </div>

          <div>
            <Label>Telepon Tenant</Label>
            <Input value={data.order?.tenant?.telepon ?? "-"} disabled />
          </div>

          <div>
            <Label>Status Pesanan</Label>
            <Input value={data.order?.status ?? "-"} disabled />
          </div>

          <div>
            <Label>Total Harga</Label>
            <Input value={`Rp${data.order?.total_harga?.toLocaleString() ?? "-"}`} disabled />
          </div>

          <div>
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
            />
          </div>

          {/* Alasan Laporan full lebar */}
          <div className="md:col-span-2">
            <Label>Alasan Laporan</Label>
            <textarea
              value={data.reason}
              disabled
              className="w-full mt-2 border rounded p-2 min-h-[100px] resize-none bg-muted"
            />
          </div>

          {data.order?.bukti_pembayaran && (
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div className="relative">
                <Label>Bukti Pembayaran</Label>
                <img
                  src={`${window.location.origin}/storage/${data.order.bukti_pembayaran}`}
                  alt="Bukti Pembayaran"
                  className="max-w-xs mt-2 rounded"
                />
                {/* Tombol kecil di pojok kanan atas */}
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    "absolute top-2 right-2 p-2 bg-white/70 backdrop-blur border border-border hover:bg-white"
                  )}
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = `${window.location.origin}/storage/${data.order.bukti_pembayaran}`;
                    link.download = `bukti_pembayaran-${data.order.nama}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  ⬇
                </Button>
              </div>
              <div>
                <Label>Kategori Laporan</Label>
                {categories.length > 0 ? (
                  <ul className="mt-2 list-disc list-inside">
                    {categories.map((category, idx) => (
                      <li key={idx}>{category}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">Tidak ada kategori</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
