import React, { useMemo, useState } from 'react';

export interface Column<T> {
  key: string;
  title: string;
  dataIndex: keyof T;
  sortable?: boolean;
  render?: (value: any, record: T) => React.ReactNode;
  width?: string | number;
}

export type SelectMode = 'single' | 'multiple';

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  selectable?: boolean;
  selectMode?: SelectMode;
  selectedRowKeys?: (string | number)[];
  rowKey?: keyof T;
  onRowSelect?: (selectedRows: T[]) => void;
  onSort?: (key: string, direction: 'asc' | 'desc' | null) => void;
  className?: string;
}

function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  selectable = false,
  selectMode = 'multiple',
  selectedRowKeys,
  rowKey = 'id' as keyof T,
  onRowSelect,
  onSort,
  className = '',
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [internalSelectedKeys, setInternalSelectedKeys] = useState<(string | number)[]>([]);

  const selectedKeys = selectedRowKeys ?? internalSelectedKeys;

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;
    const { key, direction } = sortConfig;
    const sorted = [...data].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return direction === 'asc' ? -1 : 1;
      if (bVal == null) return direction === 'asc' ? 1 : -1;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return direction === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    return sorted;
  }, [data, sortConfig]);

  const toggleSort = (key: string, sortable?: boolean) => {
    if (!sortable) return;
    let next: { key: string; direction: 'asc' | 'desc' } | null = { key, direction: 'asc' };
    if (sortConfig?.key === key) {
      next = sortConfig.direction === 'asc' ? { key, direction: 'desc' } : null;
    }
    setSortConfig(next);
    onSort?.(next ? next.key : key, next ? next.direction : null);
  };

  const handleSelectAll = (checked: boolean) => {
    if (!selectable) return;
    if (checked) {
      const keys = data.map((r) => r[rowKey] as string | number);
      updateSelection(keys);
    } else {
      updateSelection([]);
    }
  };

  const updateSelection = (keys: (string | number)[]) => {
    if (selectedRowKeys === undefined) {
      setInternalSelectedKeys(keys);
    }
    const rows = data.filter((r) => keys.includes(r[rowKey] as string | number));
    onRowSelect?.(rows);
  };

  const toggleRow = (row: T) => {
    if (!selectable) return;
    const key = row[rowKey] as string | number;
    if (selectMode === 'single') {
      const isSelected = selectedKeys.includes(key);
      updateSelection(isSelected ? [] : [key]);
    } else {
      const isSelected = selectedKeys.includes(key);
      const next = isSelected ? selectedKeys.filter((k) => k !== key) : [...selectedKeys, key];
      updateSelection(next);
    }
  };

  if (loading) {
    return (
      <div className={`flex justify-center items-center h-48 ${className}`}>
        <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        <span className="ml-3 text-indigo-700">Loading data...</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={`flex justify-center items-center h-48 text-gray-600 dark:text-gray-300 ${className}`}>
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No data available</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Get started by adding some records.</p>
        </div>
      </div>
    );
  }

  const allSelected = data.length > 0 && selectedKeys.length === data.length;

  return (
    <div className={`overflow-x-auto shadow-lg sm:rounded-lg ${className}`}>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm" role="table">
        <thead className="bg-indigo-50 dark:bg-indigo-900/30">
          <tr>
            {selectable && (
              <th className="p-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    aria-label="Select all rows"
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    checked={allSelected}
                    className="w-4 h-4 text-indigo-600 bg-white border-gray-300 rounded focus:ring-indigo-500"
                  />
                </div>
              </th>
            )}
            {columns.map((col) => {
              const isSorted = sortConfig?.key === String(col.key);
              const ariaSort = isSorted ? (sortConfig!.direction === 'asc' ? 'ascending' : 'descending') : 'none';
              return (
                <th key={col.key} scope="col" className="px-4 py-3 text-left text-xs font-semibold text-indigo-700 dark:text-indigo-200 uppercase tracking-wider">
                  <div className="flex items-center">
                    <button onClick={() => toggleSort(String(col.key), col.sortable)} className={`flex items-center space-x-2 ${col.sortable ? 'cursor-pointer' : ''}`} aria-sort={ariaSort as 'none' | 'ascending' | 'descending'}>
                      <span>{col.title}</span>
                      {col.sortable && (<span className="text-xs" aria-hidden>{isSorted ? (sortConfig!.direction === 'asc' ? '↑' : '↓') : '↕'}</span>)}
                    </button>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {sortedData.map((row, rowIndex) => {
            const key = row[rowKey] as string | number;
            const isSelected = selectedKeys.includes(key);
            return (
              <tr key={String(key) || rowIndex} className={`hover:bg-indigo-50 dark:hover:bg-indigo-800 ${isSelected ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`} onClick={() => toggleRow(row)} role={selectable ? 'row' : undefined} tabIndex={0}>
                {selectable && (
                  <td className="w-4 p-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRow(row)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 text-indigo-600 bg-white border-gray-300 rounded focus:ring-indigo-500"
                        aria-label={`Select row ${String(key)}`}
                      />
                    </div>
                  </td>
                )}

                {columns.map((col) => (
                  <td key={col.key} className="px-4 sm:px-6 py-3 text-sm font-medium text-gray-900 dark:text-white max-w-[220px]">
  <div className="truncate">{col.render ? col.render(row[col.dataIndex], row) : String(row[col.dataIndex] ?? '')}</div>
</td>


                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
export const UsersTable = DataTable;
