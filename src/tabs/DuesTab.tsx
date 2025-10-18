import { useBill } from '../context/BillContext'
import { TableHeader, TableCell, TableRow } from '../components/Table'

export function DuesTab() {
  const { people, items, calculateAmountOwed } = useBill()

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Amount Owed</h2>
      
      {people.length > 0 && items.length > 0 ? (
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
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {people.length === 0 && items.length === 0 
              ? 'Please add people and items in the Config tab to see amounts owed.'
              : people.length === 0
              ? 'Please add people in the Config tab to see amounts owed.'
              : 'Please add items in the Config tab to see amounts owed.'}
          </p>
        </div>
      )}
    </div>
  )
}
