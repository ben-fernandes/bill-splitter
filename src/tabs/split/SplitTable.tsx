import { useBill } from '../../context/BillContext'
import { Input } from '../../components/Input'

export function SplitTable() {
  const { people, items, updateShare, getShare } = useBill()

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2">
            <th className="text-left py-2 px-3 font-semibold">Item</th>
            <th className="text-right py-2 px-3 font-semibold">Price</th>
            <th className="text-right py-2 px-3 font-semibold">Qty</th>
            <th className="text-right py-2 px-3 font-semibold">Total</th>
            {people.map(person => (
              <th key={person.id} className="text-center py-2 px-3 font-semibold">
                {person.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className="border-b">
              <td className="py-2 px-3 font-semibold">
                {item.name || 'Unnamed Item'}
              </td>
              <td className="py-2 px-3 text-right opacity-75">
                £{item.price.toFixed(2)}
              </td>
              <td className="py-2 px-3 text-right opacity-75">
                {item.quantity}
              </td>
              <td className="py-2 px-3 text-right font-semibold">
                £{(item.price * item.quantity).toFixed(2)}
              </td>
              {people.map(person => (
                <td key={person.id} className="py-2 px-3 text-center">
                  <div className="flex items-center justify-center">
                    <Input
                      type="number"
                      value={getShare(person.id, item.id) || ''}
                      onChange={(value) => updateShare(person.id, item.id, parseInt(value) || 0)}
                      min="0"
                      max={item.quantity.toString()}
                      step="1"
                      className="w-16 text-center"
                    />
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
