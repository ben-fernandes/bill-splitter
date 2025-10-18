import { useBill } from '../../context/BillContext'
import { TableHeader, TableCell, TableRow } from '../../components/Table'

export function DuesTable() {
  const { people, calculateAmountOwed } = useBill()

  return (
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
  )
}
