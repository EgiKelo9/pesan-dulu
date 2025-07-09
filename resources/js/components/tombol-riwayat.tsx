import { Button } from "@/components/ui/button";
import { router, usePage } from "@inertiajs/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@radix-ui/react-separator";
import { History } from "lucide-react";

type RiwayatItem = {
  id: number;
  tenant: string;
  total_harga: number;
  jumlah_item: number;
  tanggal_pesanan: string;
  status: 'menunggu' | 'diterima' | 'siap' | 'diambil' | 'gagal';
};

export function RiwayatDropdown({ riwayat }: { riwayat: RiwayatItem[] }) {
  const statusColor = {
    menunggu: "bg-amber-600 text-white",
    diterima: "bg-blue-600 text-white",
    siap: "bg-green-600 text-white",
    diambil: "bg-gray-600 text-white",
    gagal: "bg-red-600 text-white"
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline"><History /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto" align="end">
        <DropdownMenuLabel>
          Riwayat Pemesanan
        </DropdownMenuLabel>
        <Separator />
        {riwayat.length === 0 && (
          <DropdownMenuItem disabled>Tidak ada riwayat pesanan.</DropdownMenuItem>
        )}
        {riwayat.map((item) => (
          <DropdownMenuItem
            key={item.id}
            onSelect={() => {
              router.get(`/status_pesanan/${item.id}`);
            }}
            className="flex justify-between items-start cursor-pointer my-1"
          >
            <div className="flex flex-col space-y-1 h-full w-full">
              <span className="font-semibold">{item.tenant}</span>
              <div className="text-sm text-gray-600">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR'
                }).format(item.total_harga + 200)}{" "}
                <span className="text-xs">
                  ({item.jumlah_item} item)
                </span>
              </div>
            </div>
            <div className="text-xs text-gray-500 flex flex-col justify-between items-end h-full w-full space-y-1">
              <span className={`${statusColor[item.status]} py-1 px-2 rounded-md capitalize`}>{item.status}</span>
              <span>
                {new Date(item.tanggal_pesanan).toLocaleDateString()}{" "}
                {new Date(item.tanggal_pesanan).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
