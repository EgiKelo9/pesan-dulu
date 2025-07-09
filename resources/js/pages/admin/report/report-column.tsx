"use client"

import { ColumnDef } from "@tanstack/react-table"
import { createTableColumns, BaseEntity } from "@/components/ui/columns"

export type Report = {
<<<<<<< HEAD
  id: number
  order?: {
    id: number
    nama: string
    tenant?: {
      id: number
      nama: string
      telepon: string
    }
  }
  reason: string
  created_at: string
  updated_at: string
} & BaseEntity

export const ReportColumns: ColumnDef<Report>[] = createTableColumns<Report>({
  dataColumns: [
    {
      key: "id",
      header: "ID",
      sortable: true,
      type: "text",
    },
    {
      key: "order.nama",
      header: "Nama Pemesan",
      sortable: true,
      type: "text",
    //   accessorFn: (row) => row.order?.nama ?? "-",
    },
    {
      key: "order.tenant.nama",
      header: "Nama Tenant",
      sortable: true,
      type: "text",
    //   accessorFn: (row) => row.order?.tenant?.nama ?? "-",
    },
    {
      key: "reason",
      header: "Alasan",
      sortable: false,
      type: "text",
    },
    {
      key: "created_at",
      header: "Dibuat Pada",
      sortable: true,
      type: "text", 
    },
  ],
  actionConfig: {
    basePath: "admin.report",
    showEdit: true,
    showDelete: true,
    showActionButton: false,
  },
  showSelectColumn: true,
})
=======
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
>>>>>>> 4861ae46f152f511e40c4ff9fb5e06088126299e
