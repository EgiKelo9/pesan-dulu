import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { FiArrowLeft, FiDownload, FiImage, FiCheckCircle } from "react-icons/fi";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Button } from "@/components/ui/button";
import { CircleArrowLeft } from "lucide-react";

type CartItem = {
  menu_id: number;
  nama: string;
  jumlah: number;
  catatan: string;
  foto?: string;
  harga: number;
};

type PageProps = {
  cart: CartItem[];
  tenant: any;
  pelanggan: any;
};

export default function Payment() {
  const { cart, tenant, pelanggan } = usePage<PageProps>().props;
  const [file, setFile] = useState<File | null>(null);

  const [qrisPreview, setQrisPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setQrisPreview(URL.createObjectURL(e.dataTransfer.files[0]));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setQrisPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleDownloadQRIS = () => {
    if (!tenant?.qris) return;

    const qrisUrl = `${window.location.origin}/storage/${tenant.qris}`;
    const link = document.createElement('a');
    link.href = qrisUrl;
    link.download = `QRIS-${tenant.nama || 'Pembayaran'}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = () => {
    if (!file) {
      alert('Silakan pilih bukti pembayaran terlebih dahulu.');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran file terlalu besar. Maksimal 10MB.');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      alert('Format file tidak didukung. Gunakan JPG, PNG, atau JPEG.');
      return;
    }

    setIsSubmitting(true);

    // Create FormData
    const formData = new FormData();
    formData.append('bukti_pembayaran', file);

    router.post('/cart/payment', formData, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: (page) => {
        setIsSubmitting(false);
        // The backend should redirect to status page
        console.log('Payment submitted successfully');
      },
      onError: (errors) => {
        setIsSubmitting(false);
        console.error('Upload error:', errors);
        
        // Handle specific error messages
        if (errors.bukti_pembayaran) {
          alert(`Error: ${errors.bukti_pembayaran[0]}`);
        } else if (errors.cart) {
          alert(`Error: ${errors.cart[0]}`);
        } else {
          alert('Gagal mengunggah bukti pembayaran. Silakan coba lagi.');
        }
      },
      onFinish: () => {
        setIsSubmitting(false);
      }
    });
  };

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
          <h1 className="text-lg md:text-2xl font-bold">Pembayaran</h1>
          <div className="h-10 w-10 md:h-12 md:w-12" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* QRIS Section */}
            <div className="order-1 lg:order-1">
              <h2 className="text-lg md:text-xl font-semibold mb-4">Kode QRIS Pembayaran</h2>
              <div className="bg-card rounded-xl shadow-sm border p-4 md:p-6 flex flex-col items-center">
                <div className="relative w-full max-w-xs md:max-w-sm aspect-square mb-4">
                  <AspectRatio ratio={1} className="rounded-lg overflow-hidden">
                    <img
                      src={
                        tenant?.qris
                          ? `${window.location.origin}/storage/${tenant.qris}`
                          : `${window.location.origin}/images/blank-photo-icon.jpg`
                      }
                      alt={tenant.qris}
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    />
                  </AspectRatio>
                  <button
                    className="absolute top-2 right-2 md:top-3 md:right-3 bg-white bg-opacity-80 rounded-full p-1.5 md:p-2 shadow hover:bg-opacity-100 transition"
                    onClick={handleDownloadQRIS}
                    type="button"
                  >
                    <FiDownload size={16} className="md:hidden" />
                    <FiDownload size={20} className="hidden md:block" />
                  </button>
                </div>

                {/* Payment Instructions */}
                <div className="w-full text-center text-sm md:text-base text-muted-foreground">
                  <p className="mb-2">Scan QRIS di atas untuk melakukan pembayaran</p>
                  <p className="text-xs md:text-sm">Atau gunakan aplikasi mobile banking Anda</p>
                </div>
              </div>
            </div>

            {/* Upload Section */}
            <div className="order-2 lg:order-2">
              <h2 className="text-lg md:text-xl font-semibold mb-4">Unggah Bukti Pembayaran</h2>

              {/* File Upload Area */}
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center min-h-[180px] md:min-h-[200px] cursor-pointer mb-4 p-4 hover:border-gray-400 transition-colors"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => document.getElementById("bukti_pembayaran")?.click()}
              >
                <FiImage size={32} className="text-gray-400 mb-2 md:hidden" />
                <FiImage size={40} className="text-gray-400 mb-2 hidden md:block" />
                <div className="text-gray-500 mb-1 text-center text-xs md:text-sm">
                  <span className="block md:inline">Seret dan jatuhkan gambar Anda disini atau </span>
                  <span className="underline font-semibold text-primary cursor-pointer">jelajahi dokumen</span>
                </div>
                <p className="text-xs text-gray-400 text-center mt-1">
                  Format: JPG, PNG, atau JPEG (Max 10MB)
                </p>
                <input
                  id="bukti_pembayaran"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {/* Preview Section */}
              {qrisPreview && (
                <div className="bg-card border rounded-xl p-4 mb-4">
                  <h3 className="font-medium mb-3 text-sm md:text-base">Preview Bukti Pembayaran</h3>
                  <div className="flex justify-center">
                    <img
                      src={qrisPreview}
                      alt="Preview Bukti Pembayaran"
                      className="w-auto h-40 md:h-48 object-cover rounded-lg border"
                    />
                  </div>
                </div>
              )}

              {/* File Info */}
              {file && (
                <div className="flex items-center bg-green-50 border border-green-200 rounded-xl p-3 md:p-4">
                  <FiImage size={24} className="text-green-600 mr-3 flex-shrink-0 md:hidden" />
                  <FiImage size={28} className="text-green-600 mr-3 flex-shrink-0 hidden md:block" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm md:text-base truncate">{file.name}</div>
                    <div className="text-xs text-gray-500 truncate">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                  <FiCheckCircle size={20} className="text-green-500 ml-2 flex-shrink-0 md:hidden" />
                  <FiCheckCircle size={24} className="text-green-500 ml-2 flex-shrink-0 hidden md:block" />
                </div>
              )}
            </div>
          </div>

          {/* Confirmation Button */}
          <div className="mt-8">
            <Button
              className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-3 md:py-4 text-sm md:text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!file || isSubmitting}
              onClick={handleSubmit}
              type="button"
            >
              {!file ? 'Pilih Bukti Pembayaran' : 'Konfirmasi Pembayaran'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}