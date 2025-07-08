import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
import { Search} from 'lucide-react';


type Tenant = {
  nama: string;
  jam_buka: string;
  jam_tutup: string;
  tautan: string;
};

export default function WarungPublik({ tenants }: { tenants: Tenant[] }) {
      const [searchQuery, setSearchQuery] = useState('');
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
        {/* Tengah: Judul */}
        <div className="flex flex-col items-center flex-1">
          <h1 className="text-xl font-semibold">List Tenant</h1>
        </div>
        {/* Kanan: Search */}
        <div className="flex items-center space-x-2">
        <Dialog>
            <DialogTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="hidden sm:flex md:hidden"
              >
                <Search className="h-4 w-4" />
              </Button>
            </DialogTrigger>
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
        </div>
      </div>

      <Separator />

      {/* List Tenants */}
      <div className="mt-4 space-y-4">
        {tenants.map((tenant, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between"
          >
            <div>
              <h2 className="text-lg font-semibold">{tenant.nama}</h2>
              <p className="text-sm text-gray-600">
                Buka: {tenant.jam_buka} - {tenant.jam_tutup}
              </p>
            </div>
            <Button
              variant="outline"
              className="mt-2 md:mt-0"
              onClick={() => window.location.href = tenant.tautan}
            >
              Lihat Detail
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
