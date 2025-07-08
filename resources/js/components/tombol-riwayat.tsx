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
        <Button variant="outline">
            <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
            >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v1.5M17.25 3v1.5M6.75 21h10.5A1.5 1.5 0 0018.75 19.5V6.75A1.5 1.5 0 0017.25 5.25H6.75A1.5 1.5 0 005.25 6.75V19.5A1.5 1.5 0 006.75 21zM8.25 9.75h7.5m-7.5 3h7.5m-7.5 3h4.5"
            />
            </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 max-h-96 overflow-y-auto" align="end">
        <DropdownMenuLabel>
            Riwayat Pemesanan
        </DropdownMenuLabel>
        <Separator></Separator>
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
