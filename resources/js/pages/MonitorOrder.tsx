import React from "react";
import { router, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RiwayatDropdown } from "@/components/tombol-riwayat";
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { CircleArrowLeft, TriangleAlert } from "lucide-react";
import { useFlashMessages } from "@/hooks/use-flash-messages";

type RiwayatItem = {
  id: number;
  tenant: string;
  total_harga: number;
  jumlah_item: number;
  tanggal_pesanan: string;
  status: 'menunggu' | 'diterima' | 'siap' | 'diambil' | 'gagal';
};

type Pivot = {
  order_id: number;
  menu_id: number;
  jumlah: number;
  harga_satuan: number;
  total_harga: number;
  catatan: string | null;
  created_at: string;
  updated_at: string;
};

type MenuPivot = {
  id: number;
  nama: string;
  harga: number;
  foto?: string;
  status: string;
  deskripsi: string;
  category_id: number;
  tenant_id: number;
  created_at: string;
  updated_at: string;
  pivot: Pivot; // <-- pivot adalah objek, bukan array!
};

type Order = {
  id: number;
  tanggal_pesanan: string;
  nama: string;
  telepon: string;
  waktu_diambil: string;
  status: 'menunggu' | 'diterima' | 'siap' | 'diambil' | 'gagal';
  total_harga: number;
  bukti_pembayaran: string;
  tenant_id: number;
  created_at: string;
  updated_at: string;
  order_menus: MenuPivot[];
};

type PageProps = {
  order?: Order;
  tenant?: any;
  riwayat: RiwayatItem[];
};

export default function MonitorOrder({ riwayat }: { riwayat: RiwayatItem[] }) {
  const { ToasterComponent } = useFlashMessages();
  const statusColor = {
    menunggu: "bg-amber-600 text-white",
    diterima: "bg-blue-600 text-white",
    siap: "bg-green-600 text-white",
    diambil: "bg-gray-600 text-white",
    gagal: "bg-red-600 text-white"
  };
  const { props } = usePage<PageProps>();
  const order = props.order;

  // Pastikan order dan order_menus ada
  const orderMenus: MenuPivot[] = order?.order_menus ?? [];

  React.useEffect(() => {
    console.log("test", order)
    orderMenus.forEach((item) => {
      console.log("Menu:", {
        id: item.id,
        nama: item.nama,
        harga: item.harga,
        foto: item.foto,
      });
      console.log("Pivot:", {
        jumlah: item.pivot?.jumlah,
        harga_satuan: item.pivot?.harga_satuan,
        total_harga: item.pivot?.total_harga,
        catatan: item.pivot?.catatan,
      });
    });
  }, [orderMenus]);

  console.log(riwayat);

  // Hitung subtotal dengan pengecekan aman
  const subtotal = orderMenus.reduce(
    (sum, item) => sum + (item.pivot?.total_harga ?? 0),
    0
  );
  const biayaPesan = 200;
  const total = subtotal + biayaPesan;

  if (!order) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold">Data pesanan tidak ditemukan.</h1>
      </div>
    );
  }

  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  // State untuk alasan
  const [reason, setReason] = React.useState("");

  // Data kategori
  const categories = [
    { label: "Pesanan tidak lengkap" },
    { label: "Pesanan salah" },
    { label: "Kualitas makanan buruk" },
    { label: "Pesanan terlambat" },
    { label: "Porsi kurang dari seharusnya" },
    { label: "Permintaan khusus diabaikan" },
    { label: "Lainnya" },
  ];

  // Handler toggle centang
  const toggleCategory = (label: string) => {
    setSelectedCategories(prev =>
      prev.includes(label)
        ? prev.filter(cat => cat !== label)
        : [...prev, label]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <ToasterComponent />
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center justify-between p-4 md:p-6">
          <Button
            size="icon"
            variant="outline"
            className="h-10 w-10 md:h-12 md:w-12"
            onClick={() => window.history.back()}
          >
            <CircleArrowLeft className="h-5 w-5 md:h-6 md:w-6 scale-125" />
          </Button>
          <h1 className="text-lg md:text-2xl font-bold">Rincian Pesanan</h1>
          <div className="h-10 w-10 md:h-12 md:w-12" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          {/* Title for mobile */}
          <h2 className="text-base md:text-lg font-semibold">
            Pesanan ({orderMenus.length})
          </h2>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  <TriangleAlert className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-red-600 font-bold">
                    <TriangleAlert className="h-5 w-5" />
                    Laporkan
                  </DialogTitle>
                  <DialogDescription className="flex flex-col gap-1 mt-2">
                    <span>
                      Jumlah Pesanan : {orderMenus.length} item
                    </span>
                    <span>
                      Total Harga : {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(total)}
                    </span>
                    <span>
                      Pesanan Dibuat : {new Date(order.tanggal_pesanan).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <span>
                      Status Pesanan : {order.status && order.status
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')}
                    </span>
                  </DialogDescription>
                  <Separator />
                </DialogHeader>

                {/* List Checkbox */}
                <DialogDescription className="flex flex-col gap-2">
                  <span className="font-bold text-primary">
                    Masukan Kategori Laporan
                    <span className="text-red-600 font-extralight">*</span>
                  </span>
                  <span>Pilih kategori dan tambahkan alasan jika diperlukan.</span>
                </DialogDescription>
                <div className="grid gap-3">
                  {categories.map((category) => (
                    <div key={category.label} className="flex items-center gap-3">
                      <Checkbox
                        className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary"
                        id={category.label}
                        checked={selectedCategories.includes(category.label)}
                        onCheckedChange={() => toggleCategory(category.label)}
                      />
                      <Label htmlFor={category.label} className="font-light">{category.label}</Label>
                    </div>
                  ))}
                </div>
                {/* Alasan */}
                <div className="grid gap-3">
                  <Label htmlFor="reason">
                    <span className="font-bold">Alasan</span>{" "}
                    <span className="font-normal">(Opsional)</span>
                  </Label>
                  <Textarea
                    id="reason"
                    placeholder="Masukan alasan di sini"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => {
                        router.post(`/laporan/${order.id}`, {
                          categories: selectedCategories,
                          reason: reason,
                        });
                      }}
                    >
                      Lapor
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {/* Tombol Riwayat */}
            <RiwayatDropdown riwayat={props.riwayat} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Daftar Item */}
          <div className="bg-card shadow-sm border rounded-lg p-4 md:p-6">
            {orderMenus.length === 0 ? (
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
                  {orderMenus.map((item) => (
                    <li key={item.id} className="border-b last:border-b-0 pb-3 last:pb-0 flex gap-3">
                      {/* Gambar di kiri */}
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded overflow-hidden flex-shrink-0">
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
                      <div className="flex-1 self-center min-w-0">
                        <h3 className="font-medium text-sm md:text-base truncate">{item.nama}</h3>
                        {item.pivot?.catatan && (
                          <p className="text-xs md:text-sm text-muted-foreground truncate">
                            {item.pivot.catatan}
                          </p>
                        )}
                        <p className="text-xs md:text-sm mt-1">
                          {item.pivot?.jumlah ?? 0} x {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(item.pivot?.harga_satuan ?? 0)}
                        </p>
                      </div>
                      <div className="text-right font-semibold self-center">
                        <span className="text-xs md:text-sm font-semibold">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(item.pivot?.total_harga ?? 0)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Summary */}
                <div className="mt-4 pt-4 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Biaya Pesan:</span>
                    <span>{new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(biayaPesan)}</span>
                  </div>
                  <div className="flex justify-between text-base md:text-lg font-bold pt-2 border-t">
                    <span>Total:</span>
                    <span>{new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(total)}</span>
                  </div>
                </div>
              </>
            )}
          </div>
          {/* Data Pelanggan */}
          <div className="bg-card shadow-sm border rounded-lg p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold mb-4">Data Pelanggan</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nama_pelanggan" className="text-sm md:text-base">
                  Nama Pelanggan
                </Label>
                <Input
                  id="nama_pelanggan"
                  value={order.nama ?? ""}
                  readOnly
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="nomor_hp" className="text-sm md:text-base">
                  Nomor HP/WA Pelanggan
                </Label>
                <Input
                  id="nomor_hp"
                  value={order.telepon ?? ""}
                  readOnly
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="waktu_pengambilan" className="text-sm md:text-base">
                  Waktu Pengambilan
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="waktu_pengambilan"
                    value={(order.waktu_diambil ?? "").slice(0, 5)}
                    readOnly
                    className="pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs md:text-sm pointer-events-none">
                    WITA
                  </span>
                </div>
              </div>

              {/* Order Summary */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base md:text-lg font-semibold">Total</h3>
                  <span className="text-base md:text-lg font-bold">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(total)}
                  </span>
                </div>

                <Button
                  className={`w-full text-sm md:text-base py-2 md:py-3 ${statusColor[order.status] || "bg-slate-400 text-white"}`}
                  disabled={true}
                >
                  {order.status &&
                    order.status
                      .split(' ')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

