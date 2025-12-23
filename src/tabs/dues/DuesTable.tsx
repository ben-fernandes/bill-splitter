import { useBill } from '../../context/BillContext'

export function DuesTable() {
  const { people, calculateAmountsOwedWithRounding } = useBill()

  // Get amounts with proper rounding adjustment
  const amounts = calculateAmountsOwedWithRounding()

  // Calculate sum of adjusted amounts (matches grand total exactly)
  const totalOwed = Array.from(amounts.values()).reduce((sum, amount) => sum + amount, 0)

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2">
            <th className="text-left py-2 px-3 font-semibold">Name</th>
            <th className="text-left py-2 px-3 font-semibold">Amount Owed</th>
          </tr>
        </thead>
        <tbody>
          {people.map(person => (
            <tr key={person.id} className="border-b">
              <td className="py-2 px-3">{person.name}</td>
              <td className="py-2 px-3 font-bold text-lg numeric">
                £{(amounts.get(person.id) || 0).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2">
            <td className="py-2 px-3 text-right font-bold">Total:</td>
            <td className="py-2 px-3 font-bold text-lg numeric">
              £{totalOwed.toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
