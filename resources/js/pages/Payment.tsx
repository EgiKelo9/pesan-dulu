import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { FiArrowLeft, FiDownload, FiImage, FiCheckCircle } from "react-icons/fi";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Button } from "@/components/ui/button";
import { CircleArrowLeft, LoaderCircle } from "lucide-react";

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

    // Create FormData - THIS IS THE FIX
    const formData = new FormData();
    formData.append('bukti_pembayaran', file);

    // Send FormData directly, not wrapped in an object
    router.post('/cart/payment', formData, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: (page) => {
        setIsSubmitting(false);
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
            {/* QRIS Section */}
            <div className="order-1 lg:order-0">
              <h2 className="text-lg md:text-xl font-semibold mb-4">Kode QRIS Pembayaran</h2>
              <div className="bg-card rounded-xl shadow-sm border p-4 md:p-6 flex flex-col items-center">
                <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md aspect-square mb-4">
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
                    className="absolute top-2 right-2 md:top-3 md:right-3 bg-white bg-opacity-90 rounded-full p-1.5 md:p-2 shadow-lg hover:bg-opacity-100 transition-all hover:shadow-xl"
                    onClick={handleDownloadQRIS}
                    type="button"
                  >
                    <FiDownload size={16} className="md:hidden text-gray-700" />
                    <FiDownload size={20} className="hidden md:block text-gray-700" />
                  </button>
                </div>

                {/* Payment Instructions */}
                <div className="w-full text-center text-sm md:text-base text-muted-foreground px-2">
                  <p className="mb-2 font-medium">Scan QRIS di atas untuk melakukan pembayaran</p>
                  <p className="text-xs md:text-sm opacity-75">Atau gunakan aplikasi mobile banking Anda</p>
                </div>
              </div>
            </div>

            {/* Upload Section */}
            <div className="flex-1 order-1 lg:order-0">
              <h2 className="text-lg md:text-xl font-semibold mb-4">Unggah Bukti Pembayaran</h2>
              <div
                className="border-2 border-dashed border-gray-400 rounded-xl flex flex-col items-center justify-center aspect-square cursor-pointer mb-4 md:mb-6 relative hover:border-gray-500 transition-colors"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={(e) => {
                  // Agar klik tombol X tidak trigger file input
                  if ((e.target as HTMLElement).id !== "remove-preview") {
                    document.getElementById("bukti_pembayaran")?.click();
                  }
                }}
                style={{ transition: "border-color 0.2s" }}
              >
                {!qrisPreview ? (
                  <>
                    <FiImage size={32} className="md:hidden text-gray-400 mb-2" />
                    <FiImage size={40} className="hidden md:block text-gray-400 mb-2" />
                    <div className="text-gray-500 mb-1 text-center px-4 text-sm md:text-base">
                      <span className="block md:hidden">
                        Ketuk untuk memilih gambar atau{" "}
                        <span className="underline font-semibold">jelajahi file</span>
                      </span>
                      <span className="hidden md:block">
                        Seret dan jatuhkan gambar Anda disini atau{" "}
                        <span className="underline font-semibold">jelajahi dokumen</span>
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={qrisPreview}
                      alt="Preview Bukti Pembayaran"
                      className="max-h-[80%] max-w-[80%] w-auto h-auto object-contain rounded-lg border mx-auto"
                      style={{ background: "#f9fafb" }}
                    />
                    <Button
                      id="remove-preview"
                      type="button"
                      className="absolute top-1 right-1 md:top-2 md:right-2 bg-red-500 text-white rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center p-0 shadow hover:bg-red-600 transition text-xs md:text-sm font-bold"
                      onClick={e => {
                        e.stopPropagation();
                        setFile(null);
                        setQrisPreview(null);
                        const input = document.getElementById("bukti_pembayaran") as HTMLInputElement;
                        if (input) input.value = "";
                      }}
                    >
                      &#10005;
                    </Button>
                  </div>
                )}
                <input
                  id="bukti_pembayaran"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>

          {/* Confirmation Button */}
          <div className="mt-6 md:mt-8 sticky bottom-0 bg-background pt-4 border-t lg:border-t-0 lg:bg-transparent lg:pt-0 lg:static">
            <Button
              className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-4 md:py-6 text-base md:text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg md:rounded-xl shadow-lg"
              disabled={!file || isSubmitting}
              onClick={handleSubmit}
              type="button"
            >
              {isSubmitting
                ? (
                  <span className="flex items-center justify-center gap-2">
                    <LoaderCircle className="animate-spin h-5 w-5 md:h-6 md:w-6" />
                    Mengunggah...
                  </span>
                )
                : (!file
                  ? 'Pilih Bukti Pembayaran'
                  : 'Konfirmasi Pembayaran'
                )
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}