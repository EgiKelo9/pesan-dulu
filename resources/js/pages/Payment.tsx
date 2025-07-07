import React, { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { FiArrowLeft, FiDownload, FiImage, FiCheckCircle } from "react-icons/fi";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Button } from "@/components/ui/button"


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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center px-8 py-6 shadow-md ">
        <button className="mr-4" onClick={() => window.history.back()}>
          <FiArrowLeft size={28} />
        </button>
        <h1 className="text-2xl font-semibold mx-auto">Pembayaran Pesanan</h1>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto mt-10 flex gap-10">
        {/* QRIS Section */}
        <div className="flex-1">
            <h2 className="text-xl font-semibold mb-4">Kode QRIS Pembayaran</h2>
            <div className="rounded-xl shadow-lg p-6 flex flex-col items-center relative">
                <div className="relative w-full aspect-square mb-4">
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
                      className="absolute top-3 right-3 bg-white bg-opacity-80 rounded-full p-2 shadow hover:bg-opacity-100 transition"
                      onClick={() => {
                        const qrisUrl = tenant?.qris
                          ? `${window.location.origin}/storage/${tenant.qris}`
                          : `${window.location.origin}/images/blank-photo-icon.jpg`;
                        const link = document.createElement("a");
                        link.href = qrisUrl;
                        link.download = "qris.png";
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      type="button"
                    >
                      <FiDownload size={24} />
                    </button>
                </div>
            </div>
        </div>

        {/* Upload Section */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-4">Unggah Bukti Pembayaran</h2>
          <div
            className="border-2 border-dashed border-gray-400 rounded-xl flex flex-col items-center justify-center h-48 cursor-pointer mb-6 relative"
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
                <FiImage size={40} className="text-gray-400 mb-2" />
                <div className="text-gray-500 mb-1">
                  Seret dan jatuhkan gambar Anda disini atau{" "}
                  <span className="underline font-semibold">jelajahi dokumen</span>
                </div>
              </>
            ) : (
              <div className="relative w-full h-48 flex items-center justify-center">
              <img
                src={qrisPreview}
                alt="Preview Bukti Pembayaran"
                className="max-h-40 max-w-xs w-auto h-auto object-contain rounded-lg border mx-auto"
                style={{ background: "#f9fafb" }}
              />
              <Button
                id="remove-preview"
                type="button"
                className="absolute top-2 right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center p-0 shadow hover:bg-red-500 hover:text-white transition"
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
          {file && (
            <div className="flex items-center rounded-xl shadow p-4 mb-6">
              <FiImage size={32} className="text-gray-400 mr-3" />
              <div className="flex-1">
                <div className="font-semibold">{file.name}</div>
                <div className="text-xs text-gray-500">
                  {file.webkitRelativePath || file.name}
                </div>
              </div>
              <FiCheckCircle size={28} className="text-green-500 ml-2" />
            </div>
          )}
        </div>
      </div>

      {/* Button */}
      <div className="max-w-2xl mx-auto mt-10">
        <button
          className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-4 rounded-xl text-lg transition"
          id="confirm-payment"
          disabled={!file}
            onClick={() => {
                alert("Pembayaran telah dikonfirmasi!");
                router.post('/cart/payment', {
                    bukti_pembayaran: file,
                })
            }}
            type="submit"
            
        >
          Konfirmasi Pembayaran
        </button>
      </div>
    </div>
  );
}