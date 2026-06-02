import React from 'react'

type Column<T> = {
  header: string
  accessor?: keyof T | string
  render?: (row: T) => React.ReactNode
  className?: string
}

export default function Table<T extends Record<string, any>>({
  columns,
  data,
  rowKey = 'id',
  onRowClick,
}: {
  columns: Column<T>[]
  data: T[]
  rowKey?: string
  onRowClick?: (row: T) => void
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-slate-300">
        <thead>
          <tr className="text-slate-400">
            {columns.map((c, idx) => (
              <th key={idx} className={`pb-2 ${c.className || ''}`}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rIdx) => (
            <tr key={(row as any)[rowKey] ?? rIdx} onClick={() => onRowClick?.(row)} className={`border-t border-slate-800 ${onRowClick ? 'cursor-pointer hover:bg-slate-800/40 hover:border-slate-600' : ''}`}>
              {columns.map((c, cIdx) => (
                <td key={cIdx} className={`py-3 ${c.className || ''}`}>
                  {c.render ? c.render(row) : (row as any)[c.accessor as string]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
