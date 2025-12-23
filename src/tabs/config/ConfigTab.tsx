import { useState } from 'react'
import { useBill } from '../../context/BillContext'
import { Button } from '../../components/Button'
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
        {people.length > 0 ? (
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
        ) : (
          <div className="text-center py-8">
            <p className="opacity-60 mb-4">No people added yet</p>
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
        {items.length > 0 ? (
          <div>
            <table className="w-full">
              <thead>
                <tr className="border-b-2">
                  <th className="text-left py-2 px-3 font-semibold">Item</th>
                  <th className="text-right py-2 px-3 font-semibold">Price</th>
                  <th className="text-right py-2 px-3 font-semibold">Qty</th>
                  <th className="text-right py-2 px-3 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} className="border-b">
                    <td className="py-2 px-3">{item.name || 'Unnamed Item'}</td>
                    <td className="py-2 px-3 text-right opacity-75 numeric">£{item.price.toFixed(2)}</td>
                    <td className="py-2 px-3 text-right opacity-75 numeric">{item.quantity}</td>
                    <td className="py-2 px-3 text-right font-semibold numeric">£{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2">
                  <td colSpan={3} className="py-2 px-3 text-right font-semibold">Subtotal:</td>
                  <td className="py-2 px-3 text-right font-semibold numeric">
                    £{items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                  </td>
                </tr>
                {serviceCharge > 0 && (
                  <tr>
                    <td colSpan={3} className="py-2 px-3 text-right opacity-75">Service Charge ({serviceCharge}%):</td>
                    <td className="py-2 px-3 text-right opacity-75 numeric">
                      £{((items.reduce((sum, item) => sum + (item.price * item.quantity), 0) * serviceCharge) / 100).toFixed(2)}
                    </td>
                  </tr>
                )}
                <tr className="border-t">
                  <td colSpan={3} className="py-2 px-3 text-right font-bold">Grand Total:</td>
                  <td className="py-2 px-3 text-right font-bold text-lg numeric">
                    £{(() => {
                      const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                      const serviceChargeAmount = (subtotal * serviceCharge) / 100
                      return (subtotal + serviceChargeAmount).toFixed(2)
                    })()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="opacity-60 mb-4">No items added yet</p>
            <Button onClick={() => setEditingItems(true)}>Add Items</Button>
          </div>
        )}
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
