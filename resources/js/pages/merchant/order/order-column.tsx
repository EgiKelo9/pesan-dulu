"use client"

import { ColumnDef } from "@tanstack/react-table"
import { createTableColumns, BaseEntity } from "@/components/ui/columns"

export type Order = {
    id: number
    tanggal_pesanan: Date
    nama: string
    telepon: string
    waktu_diambil: Date
    status: 'menunggu' | 'diterima' | 'siap' | 'diambil' | 'gagal'
    total_harga: number
    tenant_id: number
    menus: any[]
} & BaseEntity

export const OrderColumns: ColumnDef<Order>[] = createTableColumns<Order>({
    dataColumns: [
        {
            key: "id",
            header: "ID",
            sortable: true,
            type: "text",
        },
        {
            key: "nama",
            header: "Nama Pelanggan",
            sortable: true,
            type: "text",
        },
        {
            key: "tanggal_pesanan",
            header: "Waktu Masuk",
            sortable: true,
            type: "time",
        },
        {
            key: "waktu_diambil",
            header: "Waktu Diambil",
            sortable: true,
            type: "time",
        },
        {
            key: "menus",
            header: "Pesanan",
            sortable: false,
            type: "list",
        },
    ],
    actionConfig: {
        basePath: "merchant.order",
        showEdit: false,
        showDelete: true,
        showSwitch: false,
        showActionButton: true,
        deleteLabel: 'Tolak',
        actionButtonLabel: "Konfirmasi",
        actionButtonKey: "status",
        actionButtonValues: ["menunggu", "diterima", "siap", "diambil"],
        actionButtonVariant: "primary",
        actionButtonPath: ".updateStatus",  
    },
    showSelectColumn: false,
})