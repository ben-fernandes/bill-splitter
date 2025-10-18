import { useState } from 'react'
import { useBill } from '../context/BillContext'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { Modal } from '../components/Modal'
import { Table, TableHeader, TableCell, TableRow } from '../components/Table'

export function SplitTab() {
  const { people, items, updateShare, getShare, setShares } = useBill()
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const handleResetShares = () => {
    setShares([])
    setShowResetConfirm(false)
  }

  return (
    <>
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Bill Splitting</h2>
        <Table>
          <thead>
            <tr>
              <TableHeader>
                <div className="text-center">Item</div>
              </TableHeader>
              {people.map(person => (
                <TableHeader key={person.id}>
                  <div className="text-center">{person.name}</div>
                </TableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <TableRow key={item.id} hover>
                <TableCell>
                  <div className="font-semibold">
                    {item.name || 'Unnamed Item'} - £{item.price.toFixed(2)}
                  </div>
                </TableCell>
                {people.map(person => (
                  <TableCell key={person.id} className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Input
                        type="number"
                        value={getShare(person.id, item.id) || ''}
                        onChange={(value) => updateShare(person.id, item.id, parseFloat(value) || 0)}
                        placeholder="0"
                        min="0"
                        max="100"
                        className="w-16 text-center"
                      />
                      <span className="text-gray-600 font-semibold">%</span>
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Reset All Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={() => setShowResetConfirm(true)}
          className="px-6 py-2 text-red-600 hover:text-red-800 font-semibold transition-colors cursor-pointer"
        >
          Reset All Shares
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title="Reset All Shares"
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-5 py-2 text-gray-600 hover:text-gray-800 font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <Button onClick={handleResetShares}>Reset All</Button>
          </div>
        }
      >
        <p className="text-gray-700">
          Are you sure you want to reset all share percentages? This will clear all the splits you've entered.
        </p>
        <p className="text-red-600 font-semibold mt-4">
          This action cannot be undone.
        </p>
      </Modal>
    </>
  )
}
