interface TableProps {
  children: React.ReactNode
  className?: string
}

export function Table({ children, className = '' }: TableProps) {
  return (
    <div className={`overflow-x-auto rounded-lg shadow-lg ${className}`}>
      <table className="w-full border-collapse bg-white">
        {children}
      </table>
    </div>
  )
}

interface TableHeaderProps {
  children: React.ReactNode
}

export function TableHeader({ children }: TableHeaderProps) {
  return (
    <th className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 border border-gray-200 font-semibold">
      {children}
    </th>
  )
}

interface TableCellProps {
  children?: React.ReactNode
  colSpan?: number
  className?: string
}

export function TableCell({ children, colSpan, className = '' }: TableCellProps) {
  return (
    <td colSpan={colSpan} className={`p-4 border border-gray-200 ${className}`}>
      {children}
    </td>
  )
}

interface TableRowProps {
  children: React.ReactNode
  hover?: boolean
}

export function TableRow({ children, hover = false }: TableRowProps) {
  return (
    <tr className={hover ? 'hover:bg-gray-50 transition-colors' : ''}>
      {children}
    </tr>
  )
}
