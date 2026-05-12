"use client"

import { useState, useMemo } from 'react'
import { Search, ArrowUpDown } from 'lucide-react'

interface Column<T> {
  key: string
  label: string
  sortable?: boolean
  render?: (item: T) => React.ReactNode
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  searchable?: boolean
  searchKeys?: string[]
  pageSize?: number
}

export default function Table<T extends { [key: string]: any }>({
  columns,
  data,
  searchable = true,
  searchKeys,
  pageSize = 10,
}: TableProps<T>) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(0)

  const filtered = useMemo(() => {
    let items = [...data]
    if (search && searchKeys) {
      const q = search.toLowerCase()
      items = items.filter(item =>
        searchKeys.some(key => String(item[key] ?? '').toLowerCase().includes(q))
      )
    }
    if (sortKey) {
      items.sort((a, b) => {
        const av = a[sortKey] ?? ''
        const bv = b[sortKey] ?? ''
        const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv))
        return sortDir === 'asc' ? cmp : -cmp
      })
    }
    return items
  }, [data, search, sortKey, sortDir, searchKeys])

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pages - 1)
  const paged = filtered.slice(currentPage * pageSize, (currentPage + 1) * pageSize)

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  return (
    <div>
      {searchable && (
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0) }}
            placeholder="Search..."
            className="w-full bg-dark-bg border border-gray-800 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
          />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              {columns.map(col => (
                <th
                  key={col.key}
                  className={`text-left text-xs font-bold uppercase tracking-widest text-gray-500 py-3 px-4 ${col.sortable ? 'cursor-pointer hover:text-primary select-none' : ''}`}
                  onClick={() => col.sortable && toggleSort(col.key)}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && <ArrowUpDown size={12} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12 text-gray-500">
                  No results found
                </td>
              </tr>
            ) : (
              paged.map((item, i) => (
                <tr key={item._id ?? i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  {columns.map(col => (
                    <td key={col.key} className="py-3 px-4 text-sm">
                      {col.render ? col.render(item) : (item[col.key] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
          <span className="text-xs text-gray-500">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`px-3 py-1 text-xs font-bold uppercase tracking-wider border transition-colors ${
                  i === currentPage
                    ? 'border-primary bg-primary text-dark-bg'
                    : 'border-gray-800 text-gray-400 hover:border-primary'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
