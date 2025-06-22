"use client"

import { ColumnDef } from "@tanstack/react-table"
import { createTableColumns, BaseEntity } from "@/components/ui/columns"

export type Category = {
    id: number
    nama: string
    deskripsi: string
    tenant_id: number
} & BaseEntity

export const CategoryColumns: ColumnDef<Category>[] = createTableColumns<Category>({
    dataColumns: [
        {
            key: "nama",
            header: "Nama",
            sortable: true,
            type: "text",
        },
        {
            key: "deskripsi",
            header: "Deskripsi",
            sortable: false,
            type: "text",
        },
    ],
    actionConfig: {
        basePath: "merchant.category",
        showEdit: true,
        showDelete: true,
        showSwitch: false,
        showActionButton: false,
    },
    showSelectColumn: true,
})