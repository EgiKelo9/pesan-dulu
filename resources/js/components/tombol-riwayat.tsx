import { Button } from "@/components/ui/button";
import { router, usePage } from "@inertiajs/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@radix-ui/react-separator";

type RiwayatItem = {
  id: number;
  tenant: string;
  total_harga: number;
  jumlah_item: number;
  tanggal_pesanan: string;
  status: string;
};

export function RiwayatDropdown({ riwayat }: { riwayat: RiwayatItem[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Riwayat Pesanan</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto" align="end">
        {riwayat.length === 0 && (
          <DropdownMenuItem disabled>Tidak ada riwayat pesanan.</DropdownMenuItem>
        )}
        {riwayat.map((item) => (
          <DropdownMenuItem
            key={item.id}
                onSelect={() => {
                router.get(`/status_pesanan/${item.id}`);
                }}
            className="flex flex-col items-start space-y-1 cursor-pointer"
          >
            <div className="font-semibold">{item.tenant}</div>
            <div className="text-sm text-gray-600">
              Rp{item.total_harga.toLocaleString()}{" "}
              <span className="text-xs">
                ({item.jumlah_item} item)
              </span>
            </div>
            <div className="text-xs text-gray-500 flex justify-between w-full">
              <span>{item.status}</span>
              <span>
                {new Date(item.tanggal_pesanan).toLocaleDateString()}{" "}
                {new Date(item.tanggal_pesanan).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <Separator></Separator>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
