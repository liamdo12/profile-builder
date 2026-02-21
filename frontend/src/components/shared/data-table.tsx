import { useState } from 'react'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

export interface Column<T> {
  key: string
  header: string
  width?: string
  render?: (value: unknown, record: T) => ReactNode
}

interface DataTableProps<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: Column<any>[]
  data: T[]
  rowKey: keyof T
  loading?: boolean
  emptyText?: string
  pagination?: { pageSize: number } | false
  rowSelection?: {
    selectedKeys: (string | number)[]
    onChange: (keys: (string | number)[]) => void
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  rowKey,
  loading = false,
  emptyText = 'No data',
  pagination,
  rowSelection,
}: DataTableProps<T>) {
  const [page, setPage] = useState(0)

  if (loading) return <LoadingSpinner label="Loading..." />

  const pageSize = pagination ? pagination.pageSize : data.length
  const totalPages = Math.ceil(data.length / pageSize)
  const pageData = pagination ? data.slice(page * pageSize, (page + 1) * pageSize) : data

  const allKeys = pageData.map((row) => row[rowKey] as string | number)
  const allSelected =
    rowSelection && allKeys.length > 0 && allKeys.every((k) => rowSelection.selectedKeys.includes(k))

  const toggleAll = () => {
    if (!rowSelection) return
    if (allSelected) {
      rowSelection.onChange(rowSelection.selectedKeys.filter((k) => !allKeys.includes(k)))
    } else {
      const merged = new Set([...rowSelection.selectedKeys, ...allKeys])
      rowSelection.onChange(Array.from(merged))
    }
  }

  const toggleRow = (key: string | number) => {
    if (!rowSelection) return
    if (rowSelection.selectedKeys.includes(key)) {
      rowSelection.onChange(rowSelection.selectedKeys.filter((k) => k !== key))
    } else {
      rowSelection.onChange([...rowSelection.selectedKeys, key])
    }
  }

  return (
    <div>
      <div className="rounded-md border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              {rowSelection && (
                <th className="w-10 px-3 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected || false}
                    onChange={toggleAll}
                    className="h-4 w-4 rounded border-input"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-3 py-3 text-left font-medium text-muted-foreground"
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (rowSelection ? 1 : 0)}
                  className="px-3 py-8 text-center text-muted-foreground"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              pageData.map((row) => {
                const key = row[rowKey] as string | number
                const isSelected = rowSelection?.selectedKeys.includes(key)
                return (
                  <tr key={key} className="border-b transition-colors hover:bg-muted/50">
                    {rowSelection && (
                      <td className="px-3 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected || false}
                          onChange={() => toggleRow(key)}
                          className="h-4 w-4 rounded border-input"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className="px-3 py-3">
                        {col.render
                          ? col.render(row[col.key], row)
                          : (row[col.key] as ReactNode)}
                      </td>
                    ))}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-3">
          <p className="text-sm text-muted-foreground">
            Page {page + 1} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
