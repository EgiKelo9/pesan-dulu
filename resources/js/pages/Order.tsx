import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Button } from "@/components/ui/button"
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
// import { useFlashMessages } from '@/hooks/use-flash-messages';


type Tenant = {
  nama: string;
  alamat: string;
  telepon: string;
  jam_buka: string;
  jam_tutup: string;
};

type Category = {
  id: number;
  nama: string;
  menus: {
    id: number;
    nama: string;
    harga: number;
    foto: string; // URL atau path ke foto menu
  }[];
};

type cartItem = {
  menu_id: number;
  jumlah: number;
  catatan: string;
};

type cart = {
  menu_id: number;
  nama: string;
  jumlah: number;
  catatan: string;
  harga_satuan: number;
  total_harga: number; 
};

export default function WarungPublik({ tenant, categories, cart}: { tenant: Tenant; categories: Category[]; cart: cart[] }) {

  // const { ToasterComponent } = useFlashMessages();
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = (data: cartItem) => {
    
    setIsSubmitting(true);
    router.post('/cart/add', data, {
      preserveScroll: true,
      onSuccess: () => {
        setIsSubmitting(false);
        // setIsModalOpen(false); // ✅ tutup modal saat sukses
        router.reload({ only: ['cart'] }); // reload cart data jika perlu
      },
      onError: () => {
        setIsSubmitting(false);
        alert('❌ Gagal menambahkan item ke keranjang!');
      }
    });
  };

  const showCart = () => {
    router.get('/cart');
  }

  // console.log(categories[0]?.menus[0]?.foto); // Debugging: Cek apakah foto tersedia

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        {/* Kiri: Logo */}
        <div className="flex items-center">
          <img
        src="/images/logo.png"
        alt="Logo"
        className="w-12 h-12 object-contain mr-4"
          />
        </div>
        {/* Tengah: Judul dan Jam */}
        <div className="flex flex-col items-center flex-1">
          <h1 className="text-2xl font-bold">🍽 {tenant.nama}</h1>
          <p className="text-gray-600">Buka mulai pukul {tenant.jam_buka} hingga {tenant.jam_tutup}</p>
        </div>
        {/* Kanan: Tombol Search & Cart */}
        <div className="flex items-center space-x-2">
          <Button size="icon" variant="outline">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none"/>
          <line x1="16.65" y1="16.65" x2="21" y2="21" stroke="currentColor" strokeWidth="2"/>
        </svg>
          </Button>
            <div className="relative">
            <Button
              size="icon"
              variant="outline"
              onClick={async () => {
                if (cart.length > 0) {
                  await showCart();
                } else {
                  console.log('Keranjang kosong');
                }
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="7" cy="21" r="1" stroke="currentColor" strokeWidth="2"/>
                <circle cx="17" cy="21" r="1" stroke="currentColor" strokeWidth="2"/>
              </svg>
              {/* Badge jumlah item di cart */}
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Button>
            </div>
        </div>
      </div>
    <Separator/>
      {categories.map((category) => (
        <div key={category.id} className="mt-4">
          <h2 className="text-xl font-semibold">{category.nama}</h2>
            <ScrollArea className="w-full rounded-md whitespace-nowrap">
            <div className="flex w-max space-x-4 p-4">
            {category.menus.length === 0 ? (
              <h2 className="text-lg">Maaf, menu belum tersedia.</h2>
            ) : (
              category.menus.map((menu) => (
                <div
                  key={menu.id}
                  className="shrink-0 border rounded-lg p-3 overflow-hidden w-96"
                >
                  <AspectRatio ratio={16 / 9} className="mb-4">
                    <img
                      src={
                        menu.foto
                          ? `${window.location.origin}/storage/${menu.foto}`
                          : `${window.location.origin}/images/blank-photo-icon.jpg`
                      }
                      alt={menu.nama}
                      className="rounded-lg object-fill"
                    />
                  </AspectRatio>
                  <h3 className="font-semibold mt-2">{menu.nama}</h3>
                  <p className="text-sm mb-2">
                    Rp{menu.harga.toLocaleString()}
                  </p>
                  <Dialog>
                    <form>
                      <DialogTrigger asChild>
                        <Button variant="outline">Open Dialog</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <AspectRatio ratio={16 / 9} className="mb-4">
                            <img
                              src={
                                menu.foto
                                  ? `${window.location.origin}/storage/${menu.foto}`
                                  : `${window.location.origin}/images/blank-photo-icon.jpg`
                              }
                              alt={menu.nama}
                              className="rounded-lg"
                            />
                          </AspectRatio>
                          <DialogDescription className="text-base">
                            {menu.nama}
                          </DialogDescription>
                          <DialogTitle>
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                            }).format(menu.harga)}
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
                                    setQuantity((q) => Math.max(1, q - 1))
                                  }
                                >
                                  −
                                </Button>
                                <span className="text-sm">{quantity}</span>
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="outline"
                                  className="h-7 w-7 p-0 text-base"
                                  onClick={() => setQuantity((q) => q + 1)}
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
                            disabled={isSubmitting}
                            onClick={async () => {
                              await handleAddToCart({
                                menu_id: menu.id,
                                jumlah: quantity,
                                catatan:
                                  (document.getElementById(
                                    "name-1"
                                  ) as HTMLInputElement)?.value || "",
                              });
                              const closeBtn = document.querySelector<HTMLButtonElement>(
                                "[data-dialog-close]"
                              );
                              closeBtn?.click();
                            }}
                          >
                            {isSubmitting
                              ? "Menambah..."
                              : `Tambah Pesanan - Rp${(
                                  menu.harga * quantity
                                ).toLocaleString()}`}
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
                </div>
              ))
            )}
          </div>
          <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
      ))} 
    </div>
  );
}