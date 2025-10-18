import { useBill } from '../context/BillContext'
import { Input } from '../components/Input'
import { Table, TableHeader, TableCell, TableRow } from '../components/Table'

export function SplitTab() {
  const { people, items, updateShare, getShare } = useBill()

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Bill Splitting</h2>
      <Table>
        <thead>
          <tr>
            <TableHeader>
              <div className="text-center">Item</div>
            </TableHeader>
            {people.map(person => (
              <TableHeader key={person.id}>
                <div className="text-center">{person.name}</div>
              </TableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <TableRow key={item.id} hover>
              <TableCell>
                <div className="font-semibold">
                  {item.name || 'Unnamed Item'} - £{item.price.toFixed(2)}
                </div>
              </TableCell>
              {people.map(person => (
                <TableCell key={person.id} className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Input
                      type="number"
                      value={getShare(person.id, item.id) || ''}
                      onChange={(value) => updateShare(person.id, item.id, parseFloat(value) || 0)}
                      placeholder="0"
                      min="0"
                      max="100"
                      className="w-16 text-center"
                    />
                    <span className="text-gray-600 font-semibold">%</span>
                  </div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
