import { useState } from 'react'
import { useBill } from '../../context/BillContext'
import { PeopleTable } from './PeopleTable'
import { ItemsTable } from './ItemsTable'
import { PeopleEditModal } from './modals/PeopleEditModal'
import { ItemsEditModal } from './modals/ItemsEditModal'
import { ConfigResetConfirmationModal } from './modals/ConfigResetConfirmationModal'

export function ConfigTab() {
  const {
    people,
    items,
    shares,
    serviceCharge,
    setPeople,
    setItems,
    setServiceCharge,
    setShares
  } = useBill()

  const [editingPeople, setEditingPeople] = useState(false)
  const [editingItems, setEditingItems] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const handleSavePeople = (updatedPeople: typeof people) => {
    setPeople(updatedPeople)
    
    // Clean up shares for removed people
    const updatedPeopleIds = new Set(updatedPeople.map(p => p.id))
    const cleanedShares = shares.filter(share => updatedPeopleIds.has(share.personId))
    if (cleanedShares.length !== shares.length) {
      setShares(cleanedShares)
    }
    
    setEditingPeople(false)
  }

  const handleSaveItems = (updatedItems: typeof items, updatedServiceCharge: number) => {
    setItems(updatedItems)
    setServiceCharge(updatedServiceCharge)
    
    // Clean up shares for removed items
    const updatedItemIds = new Set(updatedItems.map(i => i.id))
    const cleanedShares = shares.filter(share => updatedItemIds.has(share.itemId))
    if (cleanedShares.length !== shares.length) {
      setShares(cleanedShares)
    }
    
    setEditingItems(false)
  }

  const handleResetAll = () => {
    setPeople([])
    setItems([])
    setShares([])
    setServiceCharge(0)
    setShowResetConfirm(false)
  }

  return (
    <div className="space-y-8">
      {/* People and Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* People Section - Level 2 */}
        <div className="p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">People</h2>
          {people.length > 0 && (
            <button
              onClick={() => setEditingPeople(true)}
              className="text-sm text-purple-600 hover:text-purple-800 font-semibold transition-colors cursor-pointer"
            >
              Edit
            </button>
          )}
        </div>

        {/* View Mode */}
        <PeopleTable onEdit={() => setEditingPeople(true)} />
      </div>

      <PeopleEditModal
        isOpen={editingPeople}
        people={people}
        onSave={handleSavePeople}
        onClose={() => setEditingPeople(false)}
      />

      {/* Items Section - Level 2 */}
      <div className="p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Items</h2>
          {items.length > 0 && (
            <button
              onClick={() => setEditingItems(true)}
              className="text-sm text-purple-600 hover:text-purple-800 font-semibold transition-colors cursor-pointer"
            >
              Edit
            </button>
          )}
        </div>

        {/* View Mode */}
        <ItemsTable onEdit={() => setEditingItems(true)} />
      </div>
      </div>

      <ItemsEditModal
        isOpen={editingItems}
        items={items}
        serviceCharge={serviceCharge}
        onSave={handleSaveItems}
        onClose={() => setEditingItems(false)}
      />

      {/* Reset All Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={() => setShowResetConfirm(true)}
          className="px-6 py-2 font-semibold transition-colors cursor-pointer"
          style={{ background: 'none', color: '#dc2626' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#991b1b')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#dc2626')}
        >
          Reset All
        </button>
      </div>

      <ConfigResetConfirmationModal
        isOpen={showResetConfirm}
        onConfirm={handleResetAll}
        onClose={() => setShowResetConfirm(false)}
      />
    </div>
  )
}
