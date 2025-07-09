import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
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
import { Search, ShoppingCart } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { RiwayatDropdown } from '@/components/tombol-riwayat';

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
  deskripsi: string;
  menus: {
    id: number;
    nama: string;
    harga: number;
    foto: string;
    deskripsi: string;
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

type RiwayatItem = {
  id: number;
  tenant: string;
  total_harga: number;
  jumlah_item: number;
  tanggal_pesanan: string;
  status: 'menunggu' | 'diterima' | 'siap' | 'diambil' | 'gagal';
};

export default function WarungPublik({ tenant, categories, cart, riwayat }: { tenant: Tenant; categories: Category[]; cart: cart[], riwayat: RiwayatItem[] }) {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddToCart = (data: cartItem) => {
    setIsSubmitting(true);
    router.post('/cart/add', data, {
      preserveScroll: true,
      onSuccess: () => {
        setIsSubmitting(false);
        router.reload({ only: ['cart'] });
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

  // Filter kategori berdasarkan pilihan
  const filteredCategories = selectedCategory
    ? categories.filter(category => category.id === selectedCategory)
    : categories;

  // Filter menu berdasarkan search query
  const filteredCategoriesWithSearch = filteredCategories.map(category => ({
    ...category,
    menus: category.menus.filter(menu =>
      menu.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      menu.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.menus.length > 0 || searchQuery === '');

  return (
    <div>
      {/* Header - Responsive */}
      <div className="flex flex-col sm:flex-row items-center justify-between my-1 md:my-2 gap-4 py-2 sm:py-4 px-4 sm:px-8">
        {/* Logo - Hidden on mobile, visible on tablet+ */}
        <a href='/' className="hidden sm:flex items-center">
          <img
            src="/logo-pesan-dulu-white.png"
            alt="Logo"
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain mr-1 sm:mr-2"
          />
          <span className="text-lg sm:text-xl font-bold text-[#127074] hidden sm:flex">Pesan Dulu</span>
        </a>

        {/* Tengah: Judul dan Jam */}
        <div className="flex flex-col items-center flex-1 text-center">
          <h1 className="text-xl md:text-2xl font-bold">🍽 {tenant.nama}</h1>
          <p className="text-xs md:text-sm text-gray-600">
            Buka mulai pukul {new Date(`1970-01-01T${tenant.jam_buka}`).toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
            })} WITA hingga {new Date(`1970-01-01T${tenant.jam_tutup}`).toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
            })} WITA
          </p>
        </div>

        {/* Kanan: Search & Cart */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Input
              placeholder="Cari menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex sm:hidden md:w-40 pr-8"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 flex sm:hidden"
              >
                ✕
              </button>
            )}
          </div>
          <Dialog>
            <div className='hidden sm:flex'>
              <DialogTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="flex"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </DialogTrigger>
            </div>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Cari Menu</DialogTitle>
                <DialogDescription>
                  Ketik nama menu yang ingin kamu cari.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="search-menu"
                      placeholder="Cari menu..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 pr-8"
                      autoComplete="off"
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={() => {
                    // Close the search dialog
                    const closeBtn = document.querySelector<HTMLButtonElement>("[data-dialog-close]");
                    closeBtn?.click();
                  }}
                >
                  Cari
                </Button>
                <DialogClose asChild>
                  <button data-dialog-close style={{ display: "none" }} />
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <RiwayatDropdown riwayat={riwayat} />
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
              <ShoppingCart className="h-4 w-4" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Filter Kategori - Responsive */}
      <div className="my-2">
        <ScrollArea className="w-full rounded-md whitespace-nowrap">
          <div className="flex w-max space-x-2 my-1 md:my-2 py-1 md:py-2 px-4 md:px-8">
            {/* Tombol "Semua Menu" */}
            <Button
              variant={selectedCategory === null ? "secondary" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="shrink-0 text-xs sm:text-sm"
            >
              Semua Menu
            </Button>

            {/* Tombol untuk setiap kategori */}
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="shrink-0 capitalize text-xs sm:text-sm"
              >
                {category.nama}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="px-4 sm:px-8 py-2">
          <p className="text-sm text-gray-600">
            Hasil pencarian untuk "{searchQuery}" - {filteredCategoriesWithSearch.reduce((total, cat) => total + cat.menus.length, 0)} menu ditemukan
            <button
              onClick={() => setSearchQuery('')}
              className="ml-2 text-primary hover:underline"
            >
              Hapus pencarian
            </button>
          </p>
        </div>
      )}

      {/* Show message when no results found */}
      {searchQuery && filteredCategoriesWithSearch.length === 0 && (
        <div className="px-4 sm:px-8 py-8 text-center">
          <p className="text-gray-500">Tidak ada menu yang ditemukan untuk "{searchQuery}"</p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-2 text-primary hover:underline"
          >
            Lihat semua menu
          </button>
        </div>
      )}

      {/* Tampilkan kategori yang difilter - Responsive */}
      {filteredCategoriesWithSearch.map((category) => (
        <div key={category.id} className="mt-1 sm:mt-2 pb-2 sm:pb-4 px-4 sm:px-8">
          <h2 className="text-lg sm:text-xl font-semibold capitalize">{category.nama}</h2>
          <p className="text-xs sm:text-sm font-light sm:mt-1 text-gray-600">{category.deskripsi}</p>

          {/* Desktop/Tablet: Grid layout (same as mobile but with more columns) */}
          <div className="hidden md:block">
            <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4 w-full">
              {category.menus.length === 0 ? (
                <div className="col-span-3 lg:col-span-4 xl:col-span-5 text-center py-8">
                  <h2 className="text-lg">Maaf, menu belum tersedia.</h2>
                </div>
              ) : (
                category.menus.map((menu) => (
                  <div
                    key={menu.id}
                    className="border rounded-lg p-3 overflow-hidden flex flex-col h-full"
                  >
                    <AspectRatio ratio={4 / 3} className="mb-3 flex-shrink-0">
                      <img
                        src={
                          menu.foto
                            ? `${window.location.origin}/storage/${menu.foto}`
                            : `${window.location.origin}/images/blank-photo-icon.jpg`
                        }
                        alt={menu.nama}
                        className="rounded-lg object-cover w-full h-full"
                      />
                    </AspectRatio>
                    <div className="flex flex-col flex-grow">
                      <p
                        className="text-sm font-normal my-2 text-left overflow-hidden flex-grow"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {menu.nama}
                      </p>
                      <p className="text-lg font-semibold mb-3 text-left">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(menu.harga)}
                      </p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="primary" size='sm' className="w-full mt-auto">
                            Tambah
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-80 sm:max-w-80 md:max-w-96 mx-4 md:mx-auto">
                          <DialogHeader>
                            <AspectRatio ratio={4 / 3} className="mb-3 md:mb-4 max-w-80 md:max-w-96">
                              <img
                                src={
                                  menu.foto
                                    ? `${window.location.origin}/storage/${menu.foto}`
                                    : `${window.location.origin}/images/blank-photo-icon.jpg`
                                }
                                alt={menu.nama}
                                className="rounded-lg object-cover aspect-[4/3]"
                              />
                            </AspectRatio>
                            <DialogDescription className='text-primary text-left'>
                              <span className='text-base md:text-lg font-medium'>{menu.nama}</span>
                              <br />
                              <span className='text-xs md:text-sm/4'>{menu.deskripsi}</span>
                            </DialogDescription>
                            <DialogTitle className="text-lg md:text-xl font-bold text-left">
                              {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                              }).format(menu.harga)}
                            </DialogTitle>
                          </DialogHeader>
                          <Separator />
                          <div className="grid gap-2 md:gap-4">
                            <div className="grid gap-2 md:gap-3">
                              <Label htmlFor={`name-desktop-${menu.id}`} className="text-sm md:text-base">
                                <span className="font-bold">Catatan</span>{" "}
                                <span className="font-normal">(Opsional)</span>
                              </Label>
                              <Textarea
                                id={`name-desktop-${menu.id}`}
                                name="name"
                                placeholder="ex: Goreng Kering"
                                className="text-xs md:text-sm"
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
                                      setQuantity((q) => Math.max(1, q - 1))
                                    }
                                  >
                                    −
                                  </Button>
                                  <span className="text-xs md:text-sm font-medium min-w-[1rem] text-center">{quantity}</span>
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="outline"
                                    className="h-6 w-6 md:h-7 md:w-7 p-0 text-sm md:text-base"
                                    onClick={() => setQuantity((q) => q + 1)}
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
                              variant={"primary"}
                              className="w-full text-sm md:text-base py-2 md:py-3"
                              disabled={isSubmitting}
                              onClick={async () => {
                                await handleAddToCart({
                                  menu_id: menu.id,
                                  jumlah: quantity,
                                  catatan:
                                    (document.getElementById(
                                      `name-desktop-${menu.id}`
                                    ) as HTMLInputElement)?.value || "",
                                });
                                const closeBtn = document.querySelector<HTMLButtonElement>(
                                  "[data-dialog-close]"
                                );
                                closeBtn?.click();
                                setQuantity(1);
                              }}
                            >
                              {isSubmitting
                                ? "Menambah..."
                                : `Tambah Pesanan - ${new Intl.NumberFormat("id-ID", {
                                  style: "currency",
                                  currency: "IDR",
                                }).format(menu.harga * quantity)}`}
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
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Mobile: Grid layout dengan ukuran seragam */}
          <div className="block md:hidden">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 w-full">
              {category.menus.length === 0 ? (
                <div className="col-span-2 sm:col-span-3 text-center py-8">
                  <h2 className="text-base">Maaf, menu belum tersedia.</h2>
                </div>
              ) : (
                category.menus.map((menu) => (
                  <div
                    key={menu.id}
                    className="border rounded-lg p-2 overflow-hidden flex flex-col h-full"
                  >
                    <AspectRatio ratio={4 / 3} className="mb-2 flex-shrink-0">
                      <img
                        src={
                          menu.foto
                            ? `${window.location.origin}/storage/${menu.foto}`
                            : `${window.location.origin}/images/blank-photo-icon.jpg`
                        }
                        alt={menu.nama}
                        className="rounded-lg object-cover w-full h-full"
                      />
                    </AspectRatio>
                    <div className="flex flex-col flex-grow">
                      <p
                        className="text-sm font-normal my-1 text-left overflow-hidden flex-grow"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {menu.nama}
                      </p>
                      <p className="text-base font-semibold mb-2 text-left">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        }).format(menu.harga)}
                      </p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="primary" size='sm' className="w-full text-sm mt-auto">
                            Tambah
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-[calc(100vw-2rem)] max-w-80 sm:max-w-80 md:max-w-96 mx-4 md:mx-auto">
                          <DialogHeader>
                            <AspectRatio ratio={4 / 3} className="mb-3 md:mb-4 max-w-80 md:max-w-96">
                              <img
                                src={
                                  menu.foto
                                    ? `${window.location.origin}/storage/${menu.foto}`
                                    : `${window.location.origin}/images/blank-photo-icon.jpg`
                                }
                                alt={menu.nama}
                                className="rounded-lg object-cover aspect-[4/3]"
                              />
                            </AspectRatio>
                            <DialogDescription className="text-primary text-left">
                              <span className='text-base md:text-lg font-medium'>{menu.nama}</span>
                              <br />
                              <span className='text-xs md:text-sm/4'>{menu.deskripsi}</span>
                            </DialogDescription>
                            <DialogTitle className="text-lg md:text-xl text-left">
                              {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                              }).format(menu.harga)}
                            </DialogTitle>
                          </DialogHeader>
                          <Separator />
                          <div className="grid gap-3 md:gap-4">
                            <div className="grid gap-2 md:gap-3">
                              <Label htmlFor={`name-mobile-${menu.id}`} className="text-sm md:text-base">
                                <span className="font-bold">Catatan</span>{" "}
                                <span className="font-normal">(Opsional)</span>
                              </Label>
                              <Input
                                id={`name-mobile-${menu.id}`}
                                name="name"
                                placeholder="ex: Goreng Kering"
                                className="text-xs md:text-sm"
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
                                      setQuantity((q) => Math.max(1, q - 1))
                                    }
                                  >
                                    −
                                  </Button>
                                  <span className="text-xs md:text-sm font-medium min-w-[1rem] text-center">{quantity}</span>
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="outline"
                                    className="h-6 w-6 md:h-7 md:w-7 p-0 text-sm md:text-base"
                                    onClick={() => setQuantity((q) => q + 1)}
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
                              variant={'primary'}
                              className="w-full text-sm md:text-base py-2 md:py-3"
                              disabled={isSubmitting}
                              onClick={async () => {
                                await handleAddToCart({
                                  menu_id: menu.id,
                                  jumlah: quantity,
                                  catatan:
                                    (document.getElementById(
                                      `name-mobile-${menu.id}`
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
                                : `Tambah - Rp${(menu.harga * quantity).toLocaleString()}`}
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
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Footer - Responsive */}
      <footer className="mt-8 sm:mt-12 border-t bg-gray-50 rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left: Logo and Company Info */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <img
                src="/logo-pesan-dulu.png"
                alt="Pesan Dulu Logo"
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
              />
              <span className="text-sm sm:text-base font-semibold text-[#127074]">
                PesanDulu
              </span>
            </div>
          </div>

          {/* Right: Links and Contact */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-sm">
            <div className="text-gray-500 text-center sm:text-right">
              <p className="hidden sm:block">© 2025 PesanDulu. All Rights Reserved.</p>
              <p className="sm:hidden">© 2025 PesanDulu</p>
            </div>
          </div>
        </div>

        {/* Bottom: Additional Info (only on larger screens) */}
        <div className="hidden sm:block mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-gray-500">
            <div className="flex flex-col items-center md:items-start gap-2">
              <span>📍 Alamat: {tenant.alamat}</span>
              <span>📞 Telepon: {tenant.telepon}</span>
            </div>
            <div>
              <span>🕐 Jam Operasional: {tenant.jam_buka} - {tenant.jam_tutup} WITA</span>
            </div>
          </div>
        </div>

        {/* Mobile: Simplified tenant info */}
        <div className="block sm:hidden mt-3 pt-3 border-t border-gray-200 text-center">
          <div className="text-sm text-gray-500 space-y-1">
            <p>📍 {tenant.alamat}</p>
            <p>📞 {tenant.telepon}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}