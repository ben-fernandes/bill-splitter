import { useState } from 'react'
import { useBill } from '../../context/BillContext'
import { SplitTable } from './SplitTable'
import { SplitResetConfirmationModal } from './modals/SplitResetConfirmationModal'

export function SplitTab() {
  const { people, items, setShares } = useBill()
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const handleResetShares = () => {
    setShares([])
    setShowResetConfirm(false)
  }

  return (
    <>
      <div className="p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Bill Splitting</h2>
        
        {people.length > 0 && items.length > 0 ? (
          <SplitTable />
        ) : (
          <div className="text-center py-12">
            <p className="opacity-60 text-lg">
              {people.length === 0 && items.length === 0 
                ? 'Please add people and items in the Config tab to start splitting the bill.'
                : people.length === 0
                ? 'Please add people in the Config tab to start splitting the bill.'
                : 'Please add items in the Config tab to start splitting the bill.'}
            </p>
          </div>
        )}
      </div>

      {/* Reset All Button - only show if there are shares to reset */}
      {people.length > 0 && items.length > 0 && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-6 py-2 font-semibold transition-colors cursor-pointer"
            style={{ background: 'none', color: '#dc2626' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#991b1b')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#dc2626')}
          >
            Reset All Shares
          </button>
        </div>
      )}

      <SplitResetConfirmationModal
        isOpen={showResetConfirm}
        onConfirm={handleResetShares}
        onClose={() => setShowResetConfirm(false)}
      />
    </>
  )
}
