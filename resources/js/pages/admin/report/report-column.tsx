"use client"

import { ColumnDef } from "@tanstack/react-table"
import { createTableColumns, BaseEntity } from "@/components/ui/columns"

export type Report = {
    id: number
    categories: string | string[] // Bisa string JSON atau array
    reason: string
    order_id: number
    order: {
        id: number
        tanggal_pesanan: string // Ubah dari Date ke string untuk konsistensi
        nama: string
        telepon: string
        waktu_diambil: string // Ubah dari Date ke string untuk konsistensi
        status: 'menunggu' | 'diterima' | 'siap' | 'diambil' | 'gagal'
        total_harga: number
        tenant_id: number
        tenant: {
            id: number
            foto: string // Ubah dari File ke string (path foto)
            nama: string
            harga: number
            deskripsi: string
            category_id: number
            status: "aktif" | "nonaktif"
            user: {
                id: number
                nama: string
                email: string
                telepon: string
            }
        }
        menus: any[]
    }
} & BaseEntity

export const ReportColumns: ColumnDef<Report>[] = createTableColumns<Report>({
    dataColumns: [
        {
            key: "order_id",
            header: "ID",
            sortable: true,
            type: "text",
        },
        {
            key: "order.tenant.nama",
            header: "Nama Warung",
            sortable: true,
            type: "text",
        },
        {
            key: "categories",
            header: "Kategori Laporan",
            sortable: true,
            type: "custom",
            customRenderer: (item: Report) => {
                if (!item.categories) {
                    return "Tidak ada kategori";
                }

                // Langsung hapus kurung siku dan tanda petik dari categories
                const cleanedString = String(item.categories)
                    .replace(/^\[|\]$/g, '') // Hapus kurung siku di awal dan akhir
                    .replace(/"/g, '') // Hapus semua tanda petik
                    .replace(/'/g, '') // Hapus semua tanda petik tunggal
                    .trim();

                return cleanedString || "Tidak ada kategori";
            }
        },
        {
            key: "reason",
            header: "Alasan",
            sortable: true,
            type: "text",
            customRenderer: (item: Report) => {
                return item.reason || "Tidak ada alasan";
            }
        },
    ],
    actionConfig: {
        basePath: "admin.report",
        showEdit: false,
        showDelete: false,
        showSwitch: false, // Reports biasanya tidak perlu switch status
        showActionButton: false, // Tambahkan action button untuk detail
        showMultipleButtons: false,
        switchLabel: "Status",
        switchKey: "status",
        getSwitchChecked: (item) => item.status === 'aktif',
        switchTrueValue: 'aktif',
        switchFalseValue: 'nonaktif',
    },
    showSelectColumn: false,
})