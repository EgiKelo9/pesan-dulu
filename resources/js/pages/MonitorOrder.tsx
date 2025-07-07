import React from "react";
import { router, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RiwayatDropdown } from "@/components/tombol-riwayat"; // atau sesuaikan path-nya
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

type RiwayatItem = {
  id: number;
  tenant: string;
  total_harga: number;
  jumlah_item: number;
  tanggal_pesanan: string;
  status: string;
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
  status: string;
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
    console.log("test",order)
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
    { id: "1", label: "Pesanan tidak lengkap" },
    { id: "2", label: "Pesanan salah" },
    { id: "3", label: "Kualitas makanan buruk" },
    { id: "4", label: "Pesanan terlambat" },
    { id: "5", label: "Porsi kurang dari seharusnya" },
    { id: "6", label: "Permintaan khusus diabaikan" },
    { id: "7", label: "Lainnya" },
  ];

  // Handler toggle centang
  const toggleCategory = (id: string) => {
    setSelectedCategories(prev =>
      prev.includes(id)
        ? prev.filter(cat => cat !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        {/* Tombol Back */}
        <Button
          size="icon"
          variant="outline"
          className="w-12 h-12"
          onClick={() => window.history.back()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 h-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth={2}
              fill="none"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 8l-4 4 4 4"
            />
            <line
              x1="16"
              y1="12"
              x2="8"
              y2="12"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            />
          </svg>
        </Button>

        {/* Judul */}
        <div className="flex flex-col items-center flex-1">
          <h1 className="text-2xl font-bold">Rincian Pesanan</h1>
        </div>

        {/* Tombol Lapor */}
        <div className="flex gap-2">
          <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.29 3.86L1.82 18a1.5 1.5 0 001.29 2.25h18.78a1.5 1.5 0 001.29-2.25L13.71 3.86a1.5 1.5 0 00-2.42 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v4m0 4h.01"
            />
          </svg>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.29 3.86L1.82 18a1.5 1.5 0 001.29 2.25h18.78a1.5 1.5 0 001.29-2.25L13.71 3.86a1.5 1.5 0 00-2.42 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v4m0 4h.01"
              />
            </svg>
            Laporkan
          </DialogTitle>
            <DialogDescription>
              Jumlah Pesanan {orderMenus.length}, Total: {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(total)}
            </DialogDescription>
            <DialogDescription>
              Pesanan Dibuat Pada : {order.tanggal_pesanan}
            </DialogDescription>
            <DialogDescription>
              Status Pesanan : {order.status && order.status
                      .split(' ')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')}
            </DialogDescription>
          <Separator/>
        </DialogHeader>

        {/* List Checkbox */}
          <DialogDescription className="font-bold text-black-600">
              Masukan Kategori Laporan
          </DialogDescription>
          <DialogDescription>
            Pilih kategori dan tambahkan alasan jika diperlukan.
          </DialogDescription>
        <div className="grid gap-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center gap-3">
              <Checkbox
                className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary"
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
              />
              <Label htmlFor={category.id} className="font-light">{category.label}</Label>
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
      <hr />
      <h1 className="text-lg font-semibold mt-5">
        Pesanan ({orderMenus.length})
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daftar Item */}
        <div className="shadow p-4 rounded">
          <ul>
            {orderMenus.length === 0 && (
              <li className="text-gray-500 py-3">Tidak ada menu.</li>
            )}
            {orderMenus.map((item) => (
              <li key={item.id} className="border-b py-3 flex gap-3">
                <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
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
                <div className="flex-1 self-center">
                  <h3 className="font-medium">{item.nama}</h3>
                  <p className="text-sm text-gray-600">
                    {item.pivot?.catatan ?? "-"}
                  </p>
                  <p className="mt-1">
                    {item.pivot?.jumlah ?? 0} x Rp
                    {(item.pivot?.harga_satuan ?? 0).toLocaleString()}
                  </p>
                </div>
                <div className="text-right font-semibold self-center flex flex-col items-end gap-1">
                  <span className="text-right mx-1">
                    Rp
                    {(item.pivot?.total_harga ?? 0).toLocaleString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold">Subtotal</span>
              <span className="font-semibold">Rp{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center mb-1 text-gray-500">
              <span>Biaya Pesan</span>
              <span>Rp{biayaPesan.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-lg">Rp{total.toLocaleString()}</span>
            </div>
          </div>
        </div>
        {/* Data Pelanggan */}
        <div className="shadow p-4 rounded">
          <h2 className="text-lg font-semibold mb-4">Data Pelanggan</h2>
          <div className="mx-4 mb-4">
            <div className="mb-3 mt-6">
              <Label className="block text-sm mb-1">Nama Pelanggan</Label>
              <Input
                value={order.nama ?? ""}
                readOnly
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div className="mb-3 mt-6">
              <Label className="block text-sm mb-1">
                Nomor HP/WA Pelanggan
              </Label>
              <Input
                value={order.telepon ?? ""}
                readOnly
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div className="mb-3 mt-6">
              <Label className="block text-sm mb-1">Waktu Pengambilan</Label>
              <Input
                value={order.waktu_diambil ?? ""}
                readOnly
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div className="flex items-center justify-between mt-6 mb-2">
              <h2 className="text-lg font-semibold">Total</h2>
              <span className="text-lg font-bold">
                Rp{total.toLocaleString()}
              </span>
            </div>
              <div className="mt-4 capitalize">
                <Button
                  className={`w-full ${statusColor[order.status] || "bg-slate-400 text-white"}`}
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
  );
}

                  