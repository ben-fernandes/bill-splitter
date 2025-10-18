import { useBill } from '../context/BillContext'
import { Button } from '../components/Button'
import { Input } from '../components/Input'

export function ConfigTab() {
  const {
    people,
    items,
    serviceCharge,
    updatePersonName,
    updateItemName,
    updateItemPrice,
    removePerson,
    removeItem,
    addPerson,
    addItem,
    setServiceCharge
  } = useBill()

  return (
    <div className="space-y-8">
      {/* People Section - Level 2 */}
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">People</h2>
        <div className="space-y-3">
          {people.map(person => (
            <div key={person.id} className="flex gap-3 items-center">
              <Input
                value={person.name}
                onChange={(value) => updatePersonName(person.id, value)}
                placeholder="Person name"
                className="flex-1"
              />
              <button
                onClick={() => removePerson(person.id)}
                className="text-sm text-red-600 hover:text-red-800 transition-colors cursor-pointer px-3"
              >
                Remove
              </button>
            </div>
          ))}
          <Button onClick={addPerson}>+ Add Person</Button>
        </div>
      </div>

      {/* Items Section - Level 2 */}
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Items</h2>
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="flex gap-3 items-center">
              <Input
                value={item.name}
                onChange={(value) => updateItemName(item.id, value)}
                placeholder="Item name"
                className="flex-1"
              />
              <div className="flex items-center gap-1">
                <span className="text-gray-600 font-semibold">£</span>
                <Input
                  type="number"
                  value={item.price || ''}
                  onChange={(value) => updateItemPrice(item.id, parseFloat(value) || 0)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-24"
                />
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-sm text-red-600 hover:text-red-800 transition-colors cursor-pointer px-3"
              >
                Remove
              </button>
            </div>
          ))}
          <Button onClick={addItem}>+ Add Item</Button>
        </div>
      </div>

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
    </div>
  )
}
