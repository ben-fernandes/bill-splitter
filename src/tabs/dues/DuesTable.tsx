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
            <th className="text-right py-2 px-3 font-semibold">Amount Owed</th>
            <th className="text-right py-2 px-3 font-semibold">Amount Paid</th>
            <th className="text-right py-2 px-3 font-semibold">Balance</th>
          </tr>
        </thead>
        <tbody>
          {people.map(person => {
            const owed = amounts.get(person.id) || 0
            const balance = owed - person.amountPaid
            return (
              <tr key={person.id} className="border-b">
                <td className="py-2 px-3">{person.name}</td>
                <td className="py-2 px-3 font-bold text-lg numeric text-right">
                  £{owed.toFixed(2)}
                </td>
                <td className="py-2 px-3 numeric text-right">
                  £{person.amountPaid.toFixed(2)}
                </td>
                <td className={`py-2 px-3 font-bold numeric text-right ${
                  balance > 0.005 ? 'text-red-600' : balance < -0.005 ? 'text-green-600' : ''
                }`}>
                  {balance > 0.005 ? '-' : balance < -0.005 ? '+' : ''}£{Math.abs(balance).toFixed(2)}
                </td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr className="border-t-2">
            <td className="py-2 px-3 text-right font-bold">Total:</td>
            <td className="py-2 px-3 font-bold text-lg numeric text-right">
              £{totalOwed.toFixed(2)}
            </td>
            <td className="py-2 px-3 font-bold numeric text-right">
              £{people.reduce((sum, p) => sum + p.amountPaid, 0).toFixed(2)}
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
