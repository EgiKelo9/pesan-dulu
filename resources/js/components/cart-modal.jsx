import React, { useState } from 'react';

export default function CartModal({ menu, onClose, onSubmit, isSubmitting }) {
  const [jumlah, setJumlah] = useState(1);
  const [catatan, setCatatan] = useState('');

  const total = jumlah * menu.harga;

  const handleSubmit = () => {
    onSubmit({
      menu_id: menu.id,
      jumlah,
      catatan,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md w-96 shadow-lg">
        <h2 className="text-xl font-bold mb-2">{menu.nama}</h2>
        <p className="text-lg mb-4">Rp{menu.harga.toLocaleString()}</p>

        <label className="block mb-2 font-semibold">Catatan (Opsional):</label>
        <textarea
          className="w-full border rounded p-2 mb-4"
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
        />

        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setJumlah(Math.max(1, jumlah - 1))}>➖</button>
          <span>{jumlah}</span>
          <button onClick={() => setJumlah(jumlah + 1)}>➕</button>
        </div>

        <button
          className="w-full bg-teal-600 text-white py-2 rounded disabled:opacity-50"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Menambahkan...' : `Tambah Pesanan - Rp${total.toLocaleString()}`}
        </button>
        <button className="text-gray-500 mt-2 block w-full" onClick={onClose}>
          Batal
        </button>
      </div>
    </div>
  );
}
