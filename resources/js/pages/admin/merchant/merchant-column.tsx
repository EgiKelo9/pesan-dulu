"use client"

import { ColumnDef } from "@tanstack/react-table"
import { createTableColumns, BaseEntity } from "@/components/ui/columns"

export type Merchant = {
    id: number
    avatar: File | string
    nama: string
    telepon: string
    email: string
    status: "aktif" | "nonaktif"
} & BaseEntity 

export const MerchantColumns: ColumnDef<Merchant>[] = createTableColumns<Merchant>({
    dataColumns: [
        {
            key: "avatar",
            header: "Avatar",
            sortable: false,
            type: "image",
        },
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
        basePath: "admin.merchant",
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