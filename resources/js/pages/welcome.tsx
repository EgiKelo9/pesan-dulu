import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Tenant = {
  nama: string;
  jam_buka: string;
  jam_tutup: string;
  tautan: string;
};

export default function WarungPublik({ tenants }: { tenants: Tenant[] }) {
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
          <Button size="icon" variant="outline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <line x1="16.65" y1="16.65" x2="21" y2="21" stroke="currentColor" strokeWidth="2" />
            </svg>
          </Button>
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
