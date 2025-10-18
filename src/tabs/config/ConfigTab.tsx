import { useState } from 'react'
import { useBill } from '../../context/BillContext'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { PeopleEditModal } from './modals/PeopleEditModal'
import { ItemsEditModal } from './modals/ItemsEditModal'
import { ConfigResetConfirmationModal } from './modals/ConfigResetConfirmationModal'

export function ConfigTab() {
  const {
    people,
    items,
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
    setEditingPeople(false)
  }

  const handleSaveItems = (updatedItems: typeof items) => {
    setItems(updatedItems)
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
        <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">People</h2>
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
        {people.length > 0 ? (
          <div className="space-y-2">
            {people.map(person => (
              <div key={person.id} className="py-2 px-3 bg-gray-50 rounded">
                <span className="text-gray-800">{person.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No people added yet</p>
            <Button onClick={() => setEditingPeople(true)}>Add People</Button>
          </div>
        )}
      </div>

      <PeopleEditModal
        isOpen={editingPeople}
        people={people}
        onSave={handleSavePeople}
        onClose={() => setEditingPeople(false)}
      />

      {/* Items Section - Level 2 */}
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Items</h2>
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
        {items.length > 0 ? (
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.id} className="py-2 px-3 bg-gray-50 rounded flex justify-between">
                <span className="text-gray-800">{item.name || 'Unnamed Item'}</span>
                <span className="text-gray-600 font-semibold">£{item.price.toFixed(2)} × {item.quantity}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No items added yet</p>
            <Button onClick={() => setEditingItems(true)}>Add Items</Button>
          </div>
        )}
      </div>
      </div>

      <ItemsEditModal
        isOpen={editingItems}
        items={items}
        onSave={handleSaveItems}
        onClose={() => setEditingItems(false)}
      />

      {/* Other Settings Section - Level 2 */}
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Other Settings</h2>
        
        {/* Service Charge - Level 3 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Service Charge</h3>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={serviceCharge || ''}
              onChange={(value) => setServiceCharge(parseFloat(value) || 0)}
              placeholder="0"
              min="0"
              max="100"
              className="w-20"
            />
            <span className="text-gray-600 font-semibold">%</span>
          </div>
        </div>
      </div>

      {/* Reset All Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={() => setShowResetConfirm(true)}
          className="px-6 py-2 text-red-600 hover:text-red-800 font-semibold transition-colors cursor-pointer"
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
