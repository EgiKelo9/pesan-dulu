"use client"

import { ColumnDef } from "@tanstack/react-table"
import { createTableColumns, BaseEntity } from "@/components/ui/columns"

export type Report = {
    id: number
    categories: string[]
    reason: string
    order_id: number
    order: {
        id: number
        tanggal_pesanan: Date
        nama: string
        telepon: string
        waktu_diambil: Date
        status: 'menunggu' | 'diterima' | 'siap' | 'diambil' | 'gagal'
        total_harga: number
        tenant_id: number
        menus: any[]
    }
} & BaseEntity

export const ReportColumns: ColumnDef<Report>[] = createTableColumns<Report>({
    dataColumns: [
        {
            key: "nama",
            header: "Nama Pedagang",
            sortable: true,
            type: "text",
        },
        {
            key: "telepon",
            header: "Telepon",
            sortable: false,
            type: "text",
        },
        {
            key: "email",
            header: "Email",
            sortable: false,
            type: "text",
        },
        {
            key: "status",
            header: "Status",
            sortable: true,
            type: "badge",
        },
    ],
    actionConfig: {
        basePath: "admin.report",
        showEdit: true,
        showDelete: true,
        showSwitch: true,
        showActionButton: false,
        switchLabel: "Status",
        switchKey: "status",
        getSwitchChecked: (item) => item.status === 'aktif',
        switchTrueValue: 'aktif',
        switchFalseValue: 'nonaktif',
    },
    showSelectColumn: true,
})