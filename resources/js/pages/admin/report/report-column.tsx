"use client"

import { ColumnDef } from "@tanstack/react-table"
import { createTableColumns, BaseEntity } from "@/components/ui/columns"

export type Report = {
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
