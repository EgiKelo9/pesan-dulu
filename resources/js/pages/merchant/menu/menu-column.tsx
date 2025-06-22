"use client"

import { ColumnDef } from "@tanstack/react-table"
import { createTableColumns, BaseEntity } from "@/components/ui/columns"

export type Menu = {
    id: number
    foto: File
    nama: string
    harga: number
    deskripsi: string
    category_id: number
    status: "tersedia" | "tidak tersedia"
} & BaseEntity

export const MenuColumns: ColumnDef<Menu>[] = createTableColumns<Menu>({
    dataColumns: [
        {
            key: "foto",
            header: "Foto",
            sortable: false,
            type: "image",
        },
        {
            key: "nama",
            header: "Nama",
            sortable: true,
            type: "text",
        },
        {
            key: "harga",
            header: "Harga",
            sortable: true,
            type: "currency",
        },
        {
            key: "deskripsi",
            header: "Deskripsi",
            sortable: false,
            type: "text",
        },
        {
            key: "category_id",
            header: "Kategori",
            sortable: true,
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
        basePath: "merchant.menu",
        showEdit: true,
        showDelete: true,
        showSwitch: true,
        showActionButton: false,
        switchLabel: "Status",
        switchKey: "status",
        getSwitchChecked: (item) => item.status === 'tersedia',
        switchTrueValue: 'tersedia',
        switchFalseValue: 'tidak tersedia',
    },
    showSelectColumn: true,
})