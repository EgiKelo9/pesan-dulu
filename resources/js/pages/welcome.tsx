import React, { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Clock, ChefHat } from 'lucide-react';

type Tenant = {
  nama: string;
  jam_buka: string;
  jam_tutup: string;
  tautan: string;
  deskripsi?: string;
  alamat?: string;
};

export default function WarungPublik({ tenants }: { tenants: Tenant[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  // Filter tenants berdasarkan search query
  const filteredTenants = useMemo(() => {
    if (!searchQuery.trim() && !showAll) {
      // Jika tidak ada search query dan tidak show all, tampilkan 6 tenant pertama
      return tenants.slice(0, 6);
    }

    if (!searchQuery.trim() && showAll) {
      // Jika show all aktif, tampilkan semua tenant
      return tenants;
    }

    return tenants.filter(tenant =>
      tenant.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tenant.deskripsi && tenant.deskripsi.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (tenant.alamat && tenant.alamat.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [tenants, searchQuery, showAll]);

  // Generate dummy data untuk tenant yang tidak memiliki deskripsi/alamat
  const enrichedTenants = filteredTenants.map(tenant => ({
    ...tenant,
    deskripsi: tenant.deskripsi || "Warung makan tradisional dengan berbagai pilihan menu lezat dan berkualitas",
    alamat: tenant.alamat || "Jl. Raya No. " + Math.floor(Math.random() * 100 + 1)
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white">
        <div className="container mx-auto px-6 lg:px-8 py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              <a href='/' className="flex items-center mb-6">
                <img
                  src="/logo-pesan-dulu-white.png"
                  alt="Pesan Dulu Logo"
                  className="w-16 h-16 object-contain mr-4"
                />
                <h1 className="text-4xl lg:text-5xl font-bold text-white">Pesan Dulu</h1>
              </a>
              <p className="text-xl lg:text-2xl mb-8 opacity-90">
                Temukan warung makan terbaik di sekitar Anda dan pesan makanan favorit dengan mudah!
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <ChefHat className="w-5 h-5 mr-2" />
                  <span>10+ Warung</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>Tersebar di Seluruh Kota</span>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 w-full lg:max-w-md flex justify-center lg:justify-end">
              <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md lg:max-w-full">
                <h3 className="text-gray-800 text-xl font-semibold mb-4 text-center">
                  Cari Warung Favoritmu
                </h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Cari warung..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-3 text-gray-800 text-base border-2 border-gray-200 focus:border-[#127074] rounded-xl"
                  />
                  {searchQuery && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-center">
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setShowAll(false);
                        }}
                        className="text-primary text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {searchQuery ? `Hasil pencarian "${searchQuery}"` : showAll ? 'Semua Warung' : 'Warung Pilihan Terbaik'}
          </h2>
          <p className="text-gray-600">
            {searchQuery
              ? `Ditemukan ${enrichedTenants.length} warung`
              : showAll
                ? `Menampilkan semua ${enrichedTenants.length} warung`
                : 'Rekomendasi warung makan terpopuler untuk Anda'
            }
          </p>
        </div>

        {enrichedTenants.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl p-8 shadow-lg max-w-md mx-auto">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Warung tidak ditemukan
              </h3>
              <p className="text-gray-500 mb-4">
                Coba gunakan kata kunci yang berbeda atau hapus filter pencarian
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setShowAll(false);
                }}
                className="bg-[#127074] hover:bg-[#0f5d61] text-white"
              >
                Lihat Semua Warung
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrichedTenants.map((tenant, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-200"
              >
                <div className="relative">
                  <div className="h-48">
                    <img
                      src="/images/warung-makan.jpg"
                      alt="Warung Makan"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#127074] transition-colors">
                    {tenant.nama}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {tenant.deskripsi}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{tenant.jam_buka.slice(0, 5)} - {tenant.jam_tutup.slice(0, 5)} WITA</span>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="truncate">{tenant.alamat}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => window.location.href = tenant.tautan}
                    className="w-full bg-[#127074] hover:bg-[#0f5d61] text-white font-semibold py-2 rounded-lg transition-colors"
                  >
                    Lihat Menu & Pesan
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!searchQuery && !showAll && tenants.length > 6 && (
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Terdapat {tenants.length - 6} warung lainnya
            </p>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowAll(true)}
              className="border-2 border-[#127074] text-[#127074] hover:bg-[#127074] hover:text-white"
            >
              Lihat Semua Warung
            </Button>
          </div>
        )}

        {showAll && !searchQuery && (
          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowAll(false)}
              className="border-2 border-[#127074] text-[#127074] hover:bg-[#127074] hover:text-white"
            >
              Tampilkan Lebih Sedikit
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-8 sm:mt-12 border-t bg-gray-50 rounded-lg p-4 sm:p-6">
        <div className="container mx-auto">
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
        </div>
      </footer>
    </div>
  );
}
