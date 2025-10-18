import { useBill } from '../context/BillContext'
import { TableHeader, TableCell, TableRow } from '../components/Table'

export function DuesTab() {
  const { people, calculateAmountOwed } = useBill()

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Amount Owed</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <TableHeader>
              <div className="text-left">Name</div>
            </TableHeader>
            <TableHeader>
              <div className="text-left">Amount Owed</div>
            </TableHeader>
          </tr>
        </thead>
        <tbody>
          {people.map(person => (
            <TableRow key={person.id} hover>
              <TableCell>{person.name}</TableCell>
              <TableCell className="font-bold text-purple-600 text-lg">
                £{calculateAmountOwed(person.id).toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </table>
    </div>
  )
}
