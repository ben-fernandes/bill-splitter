import { useBill } from '../../context/BillContext'
import { DuesTable } from './DuesTable'
import { SettlementsTable } from './SettlementsTable'

export function DuesTab() {
  const { people, items } = useBill()

  return (
    <div className="space-y-8">
      <div className="p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Amount Owed</h2>
        
        {people.length > 0 && items.length > 0 ? (
          <DuesTable />
        ) : (
          <div className="text-center py-12">
            <p className="opacity-60 text-lg">
              {people.length === 0 && items.length === 0 
                ? 'Please add people and items in the Config tab to see amounts owed.'
                : people.length === 0
                ? 'Please add people in the Config tab to see amounts owed.'
                : 'Please add items in the Config tab to see amounts owed.'}
            </p>
          </div>
        )}
      </div>

      {people.length > 0 && items.length > 0 && (
        <div className="p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Settlement Transactions</h2>
          <SettlementsTable />
        </div>
      )}
    </div>
  )
}
