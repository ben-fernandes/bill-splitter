import { useBill } from '../../context/BillContext'
import { Button } from '../../components/Button'

interface ItemsTableProps {
  onEdit: () => void
}

export function ItemsTable({ onEdit }: ItemsTableProps) {
  const { items, serviceCharge } = useBill()

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="opacity-60 mb-4">No items added yet</p>
        <Button onClick={onEdit}>Add Items</Button>
      </div>
    )
  }

  return (
    <div>
      <table className="w-full">
        <thead>
          <tr className="border-b-2">
            <th className="text-left py-2 px-3 font-semibold">Item</th>
            <th className="text-right py-2 px-3 font-semibold">Price</th>
            <th className="text-right py-2 px-3 font-semibold">Qty</th>
            <th className="text-right py-2 px-3 font-semibold">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className="border-b">
              <td className="py-2 px-3">{item.name || 'Unnamed Item'}</td>
              <td className="py-2 px-3 text-right opacity-75 numeric">£{item.price.toFixed(2)}</td>
              <td className="py-2 px-3 text-right opacity-75 numeric">{item.quantity}</td>
              <td className="py-2 px-3 text-right font-semibold numeric">£{(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2">
            <td colSpan={3} className="py-2 px-3 text-right font-semibold">Subtotal:</td>
            <td className="py-2 px-3 text-right font-semibold numeric">
              £{items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
            </td>
          </tr>
          {serviceCharge > 0 && (
            <tr>
              <td colSpan={3} className="py-2 px-3 text-right opacity-75">Service Charge ({serviceCharge}%):</td>
              <td className="py-2 px-3 text-right opacity-75 numeric">
                £{((items.reduce((sum, item) => sum + (item.price * item.quantity), 0) * serviceCharge) / 100).toFixed(2)}
              </td>
            </tr>
          )}
          <tr className="border-t">
            <td colSpan={3} className="py-2 px-3 text-right font-bold">Grand Total:</td>
            <td className="py-2 px-3 text-right font-bold text-lg numeric">
              £{(() => {
                const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                const serviceChargeAmount = (subtotal * serviceCharge) / 100
                return (subtotal + serviceChargeAmount).toFixed(2)
              })()}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
