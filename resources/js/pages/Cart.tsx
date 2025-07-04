import React, { useState }  from "react";
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
} from "@/components/ui/dialog"

type CartItem = {
  menu_id: number;
  nama: string;
  jumlah: number;
  catatan: string;
  foto?: string; 
  harga: number;
  index?: number; // Tambahkan properti index jika diperlukan
};

type PageProps = {
  cart: CartItem[];
  tenant: any; // Anda bisa ketatkan typing jika perlu
};


export default function Cart() {
  const { props } = usePage<PageProps>();
  const cart = props.cart;
  const subtotal = cart.reduce((sum, item) => sum + item.harga * item.jumlah, 0);
  const biayaPesan = 200;
  const total = subtotal + biayaPesan;
  const [quantities, setQuantities] = useState(
    cart.map((item) => item.jumlah)
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="">
            <Button size="icon" variant="outline" className="w-12 h-12" onClick={() => window.history.back()}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-12 h-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} fill="none" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 8l-4 4 4 4" />
                    <line x1="16" y1="12" x2="8" y2="12" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                </svg>
            </Button>
        </div>
        <div className="flex flex-col items-center flex-1">
            <h1 className="text-2xl font-bold ">Rincian Pesanan</h1>
        </div>
      </div>
      <hr />
      <h1 className="text-lg font-semibold mt-5">Checkout Pesanan ({cart.length})</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daftar Item */}
        <div className="shadow p-4 rounded">
          <ul>
            {cart.map((item, index) => (
                <li
                    key={item.menu_id}
                    className="border-b py-3 flex gap-3"
                >
                    {/* Gambar di kiri */}
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
                    <p className="text-sm text-gray-600">{item.catatan}</p>
                    <p className="mt-1">
                        {item.jumlah} x Rp{item.harga.toLocaleString()}
                    </p>
                    </div>
                    <div className="text-right font-semibold self-center flex flex-col items-end gap-1">
                        <Dialog>
                    <form>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="mb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil h-4 w-4 mr-1">
                                <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path>
                                <path d="m15 5 4 4"></path>
                            </svg>
                            Ubah
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <AspectRatio ratio={16 / 9} className="mb-4">
                            <img
                              src={
                                item.foto
                                  ? `${window.location.origin}/storage/${item.foto}`
                                  : `${window.location.origin}/images/blank-photo-icon.jpg`
                              }
                              alt={item.nama}
                              className="rounded-lg"
                            />
                          </AspectRatio>
                          <DialogDescription className="text-base">
                            {item.nama}
                          </DialogDescription>
                          <DialogTitle>
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                            }).format(item.harga)}
                          </DialogTitle>
                        </DialogHeader>
                        <Separator />
                        <div className="grid gap-4">
                          <div className="grid gap-3">
                            <Label htmlFor="name-1">
                              <span className="font-bold">Catatan</span>{" "}
                              <span className="font-normal">(Opsional)</span>
                            </Label>
                            <Input
                              id="name-1"
                              name="name"
                              placeholder="Goreng Kering"
                              defaultValue={item.catatan}
                            />
                            <div className="flex items-center justify-between">
                              <span className="text-sm mr-2">Total Pesanan</span>
                              <div className="flex items-center space-x-1">
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="outline"
                                  className="h-7 w-7 p-0 text-base"
                                  onClick={() =>
                                    setQuantities((prev) => {
                                      const copy = [...prev];
                                      copy[index] = Math.max(1, copy[index] - 1);
                                      return copy;
                                    })
                                  }
                                >
                                  −
                                </Button>
                                <span className="text-sm">{quantities[index]}</span>
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="outline"
                                  className="h-7 w-7 p-0 text-base"
                                  onClick={() => 
                                    setQuantities((prev) => {
                                      const copy = [...prev];
                                      copy[index] = Math.max(1, copy[index] + 1);
                                      return copy;
                                    })
                                  }
                                >
                                  +
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <DialogFooter className="p-0">
                          <Button
                            type="button"
                            className="w-full"
                            onClick={async() => {
                              router.post('/cart/update',{
                                jumlah: quantities[index],
                                catatan: (document.getElementById("name-1") as HTMLInputElement)?.value || "",
                                index: index,
                              });
                              const closeBtn = document.querySelector<HTMLButtonElement>(
                                "[data-dialog-close]"
                              );
                              closeBtn?.click();
                              router.reload({ only: ['cart'] });
                            }}
                          >
                            Tambah Pesanan - Rp{(item.harga * item.jumlah).toLocaleString()}
                          </Button>
                          <DialogClose asChild>
                            <button
                              style={{ display: "none" }}
                              data-dialog-close
                            />
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </form>
                  </Dialog>
                        <span className="text-right mx-1">Rp{(item.harga * item.jumlah).toLocaleString()}</span>
                    </div>
                </li>
                ))}
          </ul>
          <div className="mt-4 text-right">
            <p>Subtotal: Rp{subtotal.toLocaleString()}</p>
            <p>Biaya Pesan: Rp{biayaPesan.toLocaleString()}</p>
            <p className="font-bold text-lg mt-2">
              Total: Rp{total.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Data Pelanggan */}
        <div className="shadow p-4 rounded">
          <h2 className="text-lg font-semibold mb-4">Data Pelanggan</h2>
          <div className="mx-4 mb-4">
          <form
            onSubmit={e => {
            e.preventDefault();
            router.post('/cart/checkout', {
              nama_pelanggan: (document.getElementById("nama_pelanggan") as HTMLInputElement)?.value || "",
              nomor_hp: (document.getElementById("nomor_hp") as HTMLInputElement)?.value || "",
              waktu_pengambilan: (document.getElementById("waktu_pengambilan") as HTMLInputElement)?.value || "",
            });
          }}  
          >
            <div className="mb-3 mt-6">
              <Label className="block text-sm mb-1">Nama Pelanggan</Label>
              <Input
                id="nama_pelanggan"
                type="text"
                name="nama_pelanggan"
                required
                className="w-full border rounded px-2 py-1"
                placeholder="Masukkan nama panggilan Anda"
              />
            </div>
            <div className="mb-3 mt-6">
              <Label className="block text-sm mb-1">Nomor HP/WA Pelanggan</Label>
              <Input
                id="nomor_hp"
                type="number"
                name="nomor_hp"
                className="w-full border rounded px-2 py-1"
                placeholder="Masukkan nomor HP/WA Anda"
                required
              />
            </div>
            <div className="mb-3 mt-6">
              <Label className="block text-sm mb-1">Waktu Pengambilan</Label>
              <div className="relative flex items-center">
                <Input
                  id="waktu_pengambilan"
                  required
                  name="waktu_pengambilan"
                  type="time"
                  className="w-full border rounded px-2 py-1 pr-14"
                />
                <span className="absolute right-3 text-gray-500 text-sm pointer-events-none">WITA</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-6 mb-2">
              <h2 className="text-lg font-semibold">Total</h2>
              <span className="text-lg font-bold">Rp{total.toLocaleString()}</span>
            </div>
            <div className="mt-4">
              <Button 
              className="w-full" 
              type="submit"
              disabled={cart.length === 0}>
                Pesan Sekarang - Rp{total.toLocaleString()}
              </Button>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
}
