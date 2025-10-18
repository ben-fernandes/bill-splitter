import { useBill } from '../../context/BillContext'
import { Input } from '../../components/Input'
import { Table, TableHeader, TableCell, TableRow } from '../../components/Table'

export function SplitTable() {
  const { people, items, updateShare, getShare } = useBill()

  return (
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
                {item.name || 'Unnamed Item'} - £{item.price.toFixed(2)} × {item.quantity}
              </div>
            </TableCell>
            {people.map(person => (
              <TableCell key={person.id} className="text-center">
                <div className="flex items-center justify-center">
                  <Input
                    type="number"
                    value={getShare(person.id, item.id) || ''}
                    onChange={(value) => updateShare(person.id, item.id, parseFloat(value) || 0)}
                    placeholder="0"
                    min="0"
                    step="0.5"
                    className="w-20 text-center"
                  />
                </div>
              </TableCell>
            ))}
          </TableRow>
        ))}
      </tbody>
    </Table>
  )
}
