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
            <div className="text-left">Item</div>
          </TableHeader>
          <TableHeader>
            <div className="text-right">Price</div>
          </TableHeader>
          <TableHeader>
            <div className="text-right">Qty</div>
          </TableHeader>
          <TableHeader>
            <div className="text-right">Total</div>
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
                {item.name || 'Unnamed Item'}
              </div>
            </TableCell>
            <TableCell className="text-right text-gray-600">
              £{item.price.toFixed(2)}
            </TableCell>
            <TableCell className="text-right text-gray-600">
              {item.quantity}
            </TableCell>
            <TableCell className="text-right font-semibold">
              £{(item.price * item.quantity).toFixed(2)}
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
