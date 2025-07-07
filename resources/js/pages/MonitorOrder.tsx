import React from "react";
import { usePage } from "@inertiajs/react";
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
};

export default function MonitorOrder() {
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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
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
        <div className="flex flex-col items-center flex-1">
          <h1 className="text-2xl font-bold ">Rincian Pesanan</h1>
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
                  disabled
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