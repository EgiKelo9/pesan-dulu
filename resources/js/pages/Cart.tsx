import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { CircleArrowLeft, Pencil, Trash2 } from "lucide-react";

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
    <div className="min-h-screen bg-background">
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
        <h2 className="text-base md:text-lg font-semibold mb-4">
          Checkout Pesanan ({cart.length})
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Daftar Item */}
          <div className="bg-card shadow-sm border rounded-lg p-4 md:p-6">
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🛒</div>
                <h3 className="text-lg font-medium mb-2">Keranjang Kosong</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Belum ada item yang ditambahkan ke keranjang belanja Anda.
                </p>
                <Button
                  variant="primary"
                  onClick={() => window.history.back()}
                >
                  Kembali Belanja
                </Button>
              </div>
            ) : (
              <>
                <ul className="space-y-3 md:space-y-4">
                  {cart.map((item, index) => (
                    <li
                      key={item.menu_id}
                      className="border-b last:border-b-0 pb-3 last:pb-0 flex gap-3"
                    >
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
                        {item.catatan && (
                          <p className="text-xs md:text-sm text-muted-foreground truncate">{item.catatan}</p>
                        )}
                        <p className="text-xs md:text-sm mt-1">
                          {item.jumlah} x Rp{item.harga.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right font-semibold self-center flex flex-col items-end gap-1">
                        <div className="flex gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-xs md:text-sm">
                                <Pencil className="h-3 w-3 md:h-4 md:w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="w-[calc(100vw-2rem)] max-w-sm md:max-w-md mx-4 md:mx-auto">
                              <DialogHeader>
                                <AspectRatio ratio={4 / 3} className="mb-3 md:mb-4">
                                  <img
                                    src={
                                      item.foto
                                        ? `${window.location.origin}/storage/${item.foto}`
                                        : `${window.location.origin}/images/blank-photo-icon.jpg`
                                    }
                                    alt={item.nama}
                                    className="rounded-lg object-cover aspect-[4/3]"
                                  />
                                </AspectRatio>
                                <DialogDescription className="text-primary">
                                  <span className="text-base md:text-lg font-medium">{item.nama}</span>
                                </DialogDescription>
                                <DialogTitle className="text-lg md:text-xl font-bold">
                                  {new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                  }).format(item.harga)}
                                </DialogTitle>
                              </DialogHeader>
                              <Separator />
                              <div className="grid gap-2 md:gap-4">
                                <div className="grid gap-2 md:gap-3">
                                  <Label htmlFor={`catatan-${index}`} className="text-sm md:text-base">
                                    <span className="font-bold">Catatan</span>{" "}
                                    <span className="font-normal">(Opsional)</span>
                                  </Label>
                                  <Textarea
                                    id={`catatan-${index}`}
                                    name="catatan"
                                    placeholder="ex: Goreng Kering"
                                    defaultValue={item.catatan}
                                    className="text-sm md:text-base"
                                  />
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs md:text-sm mr-2">Total Pesanan</span>
                                    <div className="flex items-center space-x-2">
                                      <Button
                                        type="button"
                                        size="icon"
                                        variant="outline"
                                        className="h-6 w-6 md:h-7 md:w-7 p-0 text-sm md:text-base"
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
                                      <span className="text-xs md:text-sm font-medium min-w-[1rem] text-center">{quantities[index]}</span>
                                      <Button
                                        type="button"
                                        size="icon"
                                        variant="outline"
                                        className="h-6 w-6 md:h-7 md:w-7 p-0 text-sm md:text-base"
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
                              <DialogFooter className="p-0 pt-2 md:pt-4">
                                <Button
                                  type="button"
                                  variant="primary"
                                  className="w-full text-sm md:text-base py-2 md:py-3"
                                  onClick={async () => {
                                    const catatanInput = document.getElementById(`catatan-${index}`) as HTMLInputElement;
                                    router.post('/cart/update', {
                                      jumlah: quantities[index],
                                      catatan: catatanInput?.value || "",
                                      index: index,
                                    });
                                    // Close the dialog properly
                                    const closeBtn = document.querySelector<HTMLButtonElement>(
                                      "[data-dialog-close]"
                                    );
                                    closeBtn?.click();
                                  }}
                                >
                                  Ubah Pesanan - {new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                  }).format(item.harga * quantities[index])}
                                </Button>
                                <DialogClose asChild>
                                  <button
                                    style={{ display: "none" }}
                                    data-dialog-close
                                  />
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-xs md:text-sm text-red-600 hover:text-red-700 hover:bg-red-50">
                                <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="w-[calc(100vw-2rem)] max-w-sm mx-4 md:mx-auto">
                              <DialogHeader>
                                <DialogTitle className="text-lg md:text-xl font-bold text-left">
                                  Hapus {item.nama} dari Keranjang?
                                </DialogTitle>
                                <DialogDescription className="text-left text-sm md:text-base">
                                  Apakah Anda yakin ingin menghapus <span className="font-medium text-primary">{item.nama}</span> dari keranjang belanja?
                                </DialogDescription>
                              </DialogHeader>
                              <Separator />
                              <DialogFooter className="flex-col sm:flex-row gap-2 pt-2 md:pt-4">
                                <DialogClose asChild>
                                  <Button
                                    variant="outline"
                                    className="w-full sm:w-auto text-sm md:text-base"
                                  >
                                    Batal
                                  </Button>
                                </DialogClose>
                                <Button
                                  variant="destructive"
                                  className="w-full sm:w-auto text-sm md:text-base"
                                  onClick={async () => {
                                    router.delete('/cart/delete', {
                                      data: { index: index },
                                      preserveScroll: true,
                                      onSuccess: () => {
                                        // Close the dialog properly
                                        const closeBtn = document.querySelector<HTMLButtonElement>(
                                          "[data-dialog-close-delete]"
                                        );
                                        closeBtn?.click();
                                      },
                                      onError: () => {
                                        alert('❌ Gagal menghapus item dari keranjang!');
                                      }
                                    });
                                  }}
                                >
                                  <Trash2 className="mr-1 h-3 w-3 md:h-4 md:w-4" />
                                  Hapus Item
                                </Button>
                                <DialogClose asChild>
                                  <button
                                    style={{ display: "none" }}
                                    data-dialog-close-delete
                                  />
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>                    </div>

                        <span className="text-right text-xs md:text-sm font-semibold mt-1">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(item.harga * item.jumlah)}
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
            <form
              onSubmit={e => {
                e.preventDefault();
                router.post('/cart/checkout', {
                  nama_pelanggan: (document.getElementById("nama_pelanggan") as HTMLInputElement)?.value || "",
                  nomor_hp: (document.getElementById("nomor_hp") as HTMLInputElement)?.value || "",
                  waktu_pengambilan: (document.getElementById("waktu_pengambilan") as HTMLInputElement)?.value || "",
                });
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="nama_pelanggan" className="text-sm md:text-base">
                  Nama Pelanggan
                </Label>
                <Input
                  id="nama_pelanggan"
                  type="text"
                  name="nama_pelanggan"
                  required
                  className="mt-1"
                  placeholder="Masukkan nama panggilan Anda"
                />
              </div>

              <div>
                <Label htmlFor="nomor_hp" className="text-sm md:text-base">
                  Nomor HP/WA Pelanggan
                </Label>
                <Input
                  id="nomor_hp"
                  type="tel"
                  name="nomor_hp"
                  className="mt-1"
                  placeholder="Masukkan nomor HP/WA Anda"
                  required
                />
              </div>

              <div>
                <Label htmlFor="waktu_pengambilan" className="text-sm md:text-base">
                  Waktu Pengambilan
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="waktu_pengambilan"
                    required
                    name="waktu_pengambilan"
                    type="time"
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
                  className="w-full text-sm md:text-base py-2 md:py-3"
                  variant="primary"
                  type="submit"
                  disabled={cart.length === 0}
                >
                  Pesan Sekarang - {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(total)}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
