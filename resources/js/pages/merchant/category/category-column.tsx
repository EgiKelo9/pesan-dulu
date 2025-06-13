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
        },
        {
            key: "deskripsi",
            header: "Deskripsi",
            sortable: false,
        },
    ],
    actionConfig: {
        basePath: "merchant.category",
        showEdit: true,
        showDelete: true,
    },
    showSelectColumn: true,
})