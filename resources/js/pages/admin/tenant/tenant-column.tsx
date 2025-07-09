"use client"

import { ColumnDef } from "@tanstack/react-table"
import { createTableColumns, BaseEntity } from "@/components/ui/columns"

export type Tenant = {
    id: number
    foto: File
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
} & BaseEntity

export const TenantColumns: ColumnDef<Tenant>[] = createTableColumns<Tenant>({
    dataColumns: [
        {
            key: "qris",
            header: "QRIS",
            sortable: false,
            type: "image",
        },
        {
            key: "nama",
            header: "Nama Warung",
            sortable: true,
            type: "text",
        },
        {
            key: "user.nama",
            header: "Pemilik Warung",
            sortable: true,
            type: "text",
        },
        {
            key: "alamat",
            header: "Alamat",
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
        basePath: "admin.tenant",
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
    showSelectColumn: false,
})