import { useBill } from '../../context/BillContext'
import { Button } from '../../components/Button'

interface PeopleTableProps {
  onEdit: () => void
}

export function PeopleTable({ onEdit }: PeopleTableProps) {
  const { people } = useBill()

  if (people.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="opacity-60 mb-4">No people added yet</p>
        <Button onClick={onEdit}>Add People</Button>
      </div>
    )
  }

  return (
    <div>
      <table className="w-full">
        <thead>
          <tr className="border-b-2">
            <th className="text-left py-2 px-3 font-semibold">Name</th>
            <th className="text-right py-2 px-3 font-semibold">Amount Paid</th>
          </tr>
        </thead>
        <tbody>
          {people.map(person => (
            <tr key={person.id} className="border-b">
              <td className="py-2 px-3">{person.name}</td>
              <td className="py-2 px-3 text-right opacity-75 numeric">£{person.amountPaid.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2">
            <td className="py-2 px-3 text-right font-semibold">Total:</td>
            <td className="py-2 px-3 text-right font-semibold numeric">
              £{people.reduce((sum, person) => sum + person.amountPaid, 0).toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
