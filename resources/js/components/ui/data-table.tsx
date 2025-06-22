"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from '@inertiajs/react';
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  CircleX,
  Settings2,
  Plus,
} from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  ColumnDef,
  flexRender,
  SortingState,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface DataTableProps<TData extends { id: string | number }, TValue> {
  title: string
  href: string
  activeTab?: string[]
  defaultTab?: string
  showSearch?: boolean
  showCreateButton?: boolean
  showColumnFilter?: boolean
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData extends { id: string | number }, TValue>({
  title,
  href,
  activeTab,
  defaultTab,
  showSearch = true,
  showCreateButton = true,
  showColumnFilter = true,
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div className="flex flex-col w-full gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* title */}
        <h1 className='text-xl font-semibold'>{title}</h1>
        <div className="flex items-center justify-center max-w-sm mb-2 gap-4">
          {/* search bar */}
          {showSearch && (
            <div className="flex justify-end items-center">
              <Input
                placeholder={`Cari ${title.toLowerCase()}...`}
                value={(table.getColumn("nama")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                  table.getColumn("nama")?.setFilterValue(event.target.value)
                }
                className="w-full"
              />
            </div>
          )}
          {/* column filter */}
          {showColumnFilter && (
            <DropdownMenu>
              <DropdownMenuTrigger className={cn(
                buttonVariants({ variant: "outline", size: "sm" }), "ml-auto h-9")}>
                <Settings2 />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[150px]">
                <DropdownMenuLabel>Kolom</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      typeof column.accessorFn !== "undefined" && column.getCanHide()
                  )
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id.replace('_id', '')}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {/* create button */}
          {showCreateButton && (
            <Button variant="primary" asChild>
              <Link href={`${href}/create`}><Plus />Buat</Link>
            </Button>
          )}
        </div>
      </div>
      {/* active tab */}
      {activeTab && (
        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center gap-2 py-2 px-2 bg-muted/50 rounded-md">
            {activeTab.map((tab) => {
              const urlParams = new URLSearchParams(window.location.search);
              const currentActiveTab = urlParams.get('activeTab') || defaultTab;
              return (
                <Button
                  key={tab}
                  variant={tab === currentActiveTab ? "secondary" : "ghost"}
                  size="lg"
                  className="h-8 px-4 capitalize"
                  asChild
                >
                  <Link href={`${href}?activeTab=${tab}`}>{tab}</Link>
                </Button>
              );
            })}
          </div>
        </div>
      )}
      {/* table */}
      <div className="rounded-md border">
        <Table>
          {/* active filter */}
          {table.getColumn("nama")?.getFilterValue() ? (
            <TableHeader>
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <div className="flex items-center gap-2 py-1 px-4">
                    <span className="text-sm font-medium">Filter aktif:</span>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-7 px-2"
                      onClick={() => table.getColumn("nama")?.setFilterValue("")}
                    >
                      {table.getColumn("nama")?.getFilterValue() as string}
                      <CircleX className="ml-2 size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableHeader>
          ) : null}
          <TableHeader>
            {/* table header */}
            {table.getRowModel().rows?.length ? (
              table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="py-4">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))
            ) : null}
          </TableHeader>
          {/* table body */}
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="truncate max-w-96">
                      {/* Only wrap non-action cells with Link */}
                      {cell.column.id === "actions" || cell.column.id === "select" ? (
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                      ) : (
                        <Link href={`${href}/${row.original.id}`} key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </Link>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-32 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <CircleX className="size-8 text-primary/70" />
                    <p>Tidak ada data yang ditemukan.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* pagination */}
      {table.getRowCount() > 0 ? (
        <div className="flex items-center mt-2 justify-between px-2">
          {/* rows selected */}
          <div className="text-muted-foreground text-sm">
            {table.getFilteredSelectedRowModel().rows.length} dari{" "}
            {table.getFilteredRowModel().rows.length} terpilih.
          </div>
          {/* rows number per page */}
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium hidden lg:block">per halaman</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 min-w-[70px] w-auto">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 25, 50, 100].map((pageSize) => (
                  <SelectItem
                    key={pageSize}
                    value={`${pageSize}`}
                  >
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-4 lg:space-x-6">
            {/* page information */}
            <div className="hidden w-auto md:flex md:items-center md:justify-center text-sm font-medium">
              Halaman {table.getState().pagination.pageIndex + 1} dari{" "}
              {table.getPageCount()}
            </div>
            {/* next previous button */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="hidden size-8 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Ke Halaman Pertama</span>
                <ChevronsLeft />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Ke Halaman Sebelumnya</span>
                <ChevronLeft />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Ke Halaman Selanjutnya</span>
                <ChevronRight />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="hidden size-8 lg:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Ke Halaman Terakhir</span>
                <ChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}