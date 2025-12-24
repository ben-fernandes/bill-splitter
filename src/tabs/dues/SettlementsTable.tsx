import { useBill } from '../../context/BillContext'

export function SettlementsTable() {
  const { calculateSettlements } = useBill()

  // Get settlement transactions
  const settlements = calculateSettlements()

  if (settlements.length === 0) {
    return null
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2">
              <th className="text-left py-2 px-3 font-semibold">From</th>
              <th className="text-left py-2 px-3 font-semibold">To</th>
              <th className="text-right py-2 px-3 font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {settlements.map((settlement, index) => (
              <tr key={index} className="border-b">
                <td className="py-2 px-3">{settlement.from}</td>
                <td className="py-2 px-3">{settlement.to}</td>
                <td className="py-2 px-3 font-bold numeric text-right">
                  £{settlement.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm opacity-70 mt-2">
        {settlements.length} transaction{settlements.length !== 1 ? 's' : ''} needed to settle all debts
      </p>
    </>
  )
}
