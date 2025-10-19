import { useBill } from '../../context/BillContext'

export function DuesTable() {
  const { people, calculateAmountOwed } = useBill()

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
              <td className="py-2 px-3 font-bold text-lg">
                £{calculateAmountOwed(person.id).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
