"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button, buttonVariants } from "@/components/ui/button"
import { router } from "@inertiajs/react"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { useState } from 'react'

import {
  ArrowUpDown,
  EllipsisVertical,
  LoaderCircle,
  Pencil,
  Trash2,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"

export interface BaseEntity {
  id: number
  [key: string]: any
}

export interface DataColumnConfig {
  key: string
  header: string
  sortable?: boolean
}

export interface ActionConfig {
  basePath: string
  showEdit?: boolean
  showDelete?: boolean
  editLabel?: string
  deleteLabel?: string
  onEdit?: (item: BaseEntity) => void
  onDelete?: (item: BaseEntity) => void
}

export interface ColumnGeneratorConfig {
  dataColumns: DataColumnConfig[]
  actionConfig: ActionConfig
  showSelectColumn?: boolean
}

/**
 * Generator fungsi untuk membuat kolom tabel yang dapat digunakan kembali
 * 
 * @param config - Konfigurasi untuk membuat kolom
 * @returns Array definisi kolom untuk react-table
 */
export function createTableColumns<T extends BaseEntity>(
  config: ColumnGeneratorConfig
): ColumnDef<T>[] {
  const columns: ColumnDef<T>[] = []

  // Tambahkan kolom seleksi jika diminta
  if (config.showSelectColumn !== false) { // Default true
    columns.push({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    })
  }

  // Tambahkan kolom-kolom data
  config.dataColumns.forEach((columnConfig) => {
    const column: ColumnDef<T> = {
      accessorKey: columnConfig.key,
      header: columnConfig.sortable !== false ? // Default sortable
        ({ column }) => (
          <button
            onClick={() => {
              const currentSort = column.getIsSorted()
              if (currentSort === false) {
                column.toggleSorting(false) // set to asc
              } else if (currentSort === "asc") {
                column.toggleSorting(true) // set to desc
              } else {
                column.clearSorting() // clear sorting
              }
            }}
            className="flex items-center hover:text-primary transition-colors"
          >
            {columnConfig.header}
            <ArrowUpDown className={`ml-2 h-4 w-4 ${column.getIsSorted() === false ? 'opacity-50' : ''}`} />
          </button>
        ) :
        columnConfig.header,
    }
    columns.push(column)
  })

  // Tambahkan kolom aksi
  const { actionConfig } = config
  if (actionConfig.showEdit !== false || actionConfig.showDelete !== false) {
    columns.push({
      id: "actions",
      cell: ({ row }) => {
        const item = row.original
        const [deleting, setDeleting] = useState(false)
        const [showDeleteDialog, setShowDeleteDialog] = useState(false)

        // Handler untuk edit
        const handleEdit = () => {
          if (actionConfig.onEdit) {
            actionConfig.onEdit(item)
          } else {
            const path = `${actionConfig.basePath}.edit`
            console.log('Navigating to:', path, item.id)
            router.get(route(path, item.id), {
              preserveState: true,
            })
          }
        }

        // Handler untuk delete
        const handleDelete = () => {
          if (actionConfig.onDelete) {
            actionConfig.onDelete(item)
          } else {
            setDeleting(true)
            router.delete(route(actionConfig.basePath + '.destroy', item.id), {
              onSuccess: () => {
                router.reload()
              },
              onError: (error) => {
                console.error('Gagal menghapus item:', error)
                alert('Terjadi kesalahan saat menghapus item. Silakan coba lagi.')
              },
              onFinish: () => {
                setDeleting(false)
                setShowDeleteDialog(false)
                router.visit(route(actionConfig.basePath + '.index'))
              }
            })
          }
        }

        const handleDeleteClick = (e: React.MouseEvent) => {
          e.preventDefault()
          e.stopPropagation()
          handleDelete()
        }

        return (
          <>
            <div className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <EllipsisVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {actionConfig.showEdit !== false && (
                    <DropdownMenuItem onClick={handleEdit}>
                      <Pencil className="h-4 w-4 mr-2" />
                      {actionConfig.editLabel || 'Edit'}
                    </DropdownMenuItem>
                  )}
                  {actionConfig.showDelete !== false && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setShowDeleteDialog(true)
                      }}
                      variant="destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {actionConfig.deleteLabel || 'Hapus'}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Separate AlertDialog outside of DropdownMenu */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Apakah Anda yakin ingin menghapus item ini?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Aksi ini tidak dapat dibatalkan. Item ini akan dihapus secara permanen
                    dan tidak dapat dipulihkan lagi.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deleting}>
                    Batal
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteClick}
                    disabled={deleting}
                    className={cn(buttonVariants({ variant: 'destructive' }))}
                  >
                    {deleting ? (
                      <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      "Hapus"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )
      },
    })
  }

  return columns
}