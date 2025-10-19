import { useBill } from '../../context/BillContext'

export function DuesTable() {
  const { people, calculateAmountOwed } = useBill()

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-gray-300">
            <th className="text-left py-2 px-3 text-gray-700 font-semibold">Name</th>
            <th className="text-left py-2 px-3 text-gray-700 font-semibold">Amount Owed</th>
          </tr>
        </thead>
        <tbody>
          {people.map(person => (
            <tr key={person.id} className="border-b border-gray-200">
              <td className="py-2 px-3 text-gray-800">{person.name}</td>
              <td className="py-2 px-3 font-bold text-purple-600 text-lg">
                £{calculateAmountOwed(person.id).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
