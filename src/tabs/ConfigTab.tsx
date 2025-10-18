import { useState } from 'react'
import { useBill } from '../context/BillContext'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import type { Person, MenuItem } from '../context/BillContext'

export function ConfigTab() {
  const {
    people,
    items,
    serviceCharge,
    setPeople,
    setItems,
    setServiceCharge
  } = useBill()

  const [editingPeople, setEditingPeople] = useState(false)
  const [editingItems, setEditingItems] = useState(false)
  const [tempPeople, setTempPeople] = useState<Person[]>([])
  const [tempItems, setTempItems] = useState<MenuItem[]>([])
  const [errors, setErrors] = useState<string[]>([])

  const startEditingPeople = () => {
    setTempPeople(JSON.parse(JSON.stringify(people)))
    setEditingPeople(true)
    setErrors([])
  }

  const startEditingItems = () => {
    setTempItems(JSON.parse(JSON.stringify(items)))
    setEditingItems(true)
    setErrors([])
  }

  const savePeople = () => {
    const validationErrors: string[] = []
    
    tempPeople.forEach((person, index) => {
      if (!person.name.trim()) {
        validationErrors.push(`Person ${index + 1} must have a name`)
      }
    })

    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    setPeople(tempPeople)
    setEditingPeople(false)
    setErrors([])
  }

  const saveItems = () => {
    const validationErrors: string[] = []
    
    tempItems.forEach((item, index) => {
      if (!item.name.trim()) {
        validationErrors.push(`Item ${index + 1} must have a name`)
      }
      if (item.price <= 0) {
        validationErrors.push(`Item ${index + 1} must have a price greater than 0`)
      }
    })

    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    setItems(tempItems)
    setEditingItems(false)
    setErrors([])
  }

  const cancelEditingPeople = () => {
    setEditingPeople(false)
    setErrors([])
  }

  const cancelEditingItems = () => {
    setEditingItems(false)
    setErrors([])
  }

  const addTempPerson = () => {
    const newId = Date.now().toString()
    setTempPeople([...tempPeople, { id: newId, name: '' }])
  }

  const addTempItem = () => {
    const newId = Date.now().toString()
    setTempItems([...tempItems, { id: newId, name: '', price: 0 }])
  }

  const removeTempPerson = (id: string) => {
    setTempPeople(tempPeople.filter(p => p.id !== id))
  }

  const removeTempItem = (id: string) => {
    setTempItems(tempItems.filter(i => i.id !== id))
  }

  const updateTempPersonName = (id: string, name: string) => {
    setTempPeople(tempPeople.map(p => p.id === id ? { ...p, name } : p))
  }

  const updateTempItemName = (id: string, name: string) => {
    setTempItems(tempItems.map(i => i.id === id ? { ...i, name } : i))
  }

  const updateTempItemPrice = (id: string, price: number) => {
    setTempItems(tempItems.map(i => i.id === id ? { ...i, price } : i))
  }

  return (
    <div className="space-y-8">
      {/* People Section - Level 2 */}
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">People</h2>
          {!editingPeople && (
            <button
              onClick={startEditingPeople}
              className="text-sm text-purple-600 hover:text-purple-800 font-semibold transition-colors cursor-pointer"
            >
              Edit
            </button>
          )}
        </div>

        {!editingPeople ? (
          // View Mode
          <div className="space-y-2">
            {people.map(person => (
              <div key={person.id} className="py-2 px-3 bg-gray-50 rounded">
                <span className="text-gray-800">{person.name}</span>
              </div>
            ))}
          </div>
        ) : (
          // Edit Mode
          <div className="space-y-3">
            {tempPeople.map(person => (
              <div key={person.id} className="flex gap-3 items-center">
                <Input
                  value={person.name}
                  onChange={(value) => updateTempPersonName(person.id, value)}
                  placeholder="Person name"
                  className="flex-1"
                />
                <button
                  onClick={() => removeTempPerson(person.id)}
                  className="text-sm text-red-600 hover:text-red-800 transition-colors cursor-pointer px-3"
                >
                  Remove
                </button>
              </div>
            ))}
            <Button onClick={addTempPerson}>+ Add Person</Button>
            
            {errors.length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded">
                {errors.map((error, index) => (
                  <p key={index} className="text-sm text-red-600">{error}</p>
                ))}
              </div>
            )}
            
            <div className="flex gap-3 pt-2">
              <Button onClick={savePeople}>Save</Button>
              <button
                onClick={cancelEditingPeople}
                className="px-5 py-2 text-gray-600 hover:text-gray-800 font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Items Section - Level 2 */}
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Items</h2>
          {!editingItems && (
            <button
              onClick={startEditingItems}
              className="text-sm text-purple-600 hover:text-purple-800 font-semibold transition-colors cursor-pointer"
            >
              Edit
            </button>
          )}
        </div>

        {!editingItems ? (
          // View Mode
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.id} className="py-2 px-3 bg-gray-50 rounded flex justify-between">
                <span className="text-gray-800">{item.name || 'Unnamed Item'}</span>
                <span className="text-gray-600 font-semibold">£{item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        ) : (
          // Edit Mode
          <div className="space-y-3">
            {tempItems.map(item => (
              <div key={item.id} className="flex gap-3 items-center">
                <Input
                  value={item.name}
                  onChange={(value) => updateTempItemName(item.id, value)}
                  placeholder="Item name"
                  className="flex-1"
                />
                <div className="flex items-center gap-1">
                  <span className="text-gray-600 font-semibold">£</span>
                  <Input
                    type="number"
                    value={item.price || ''}
                    onChange={(value) => updateTempItemPrice(item.id, parseFloat(value) || 0)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-24"
                  />
                </div>
                <button
                  onClick={() => removeTempItem(item.id)}
                  className="text-sm text-red-600 hover:text-red-800 transition-colors cursor-pointer px-3"
                >
                  Remove
                </button>
              </div>
            ))}
            <Button onClick={addTempItem}>+ Add Item</Button>
            
            {errors.length > 0 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded">
                {errors.map((error, index) => (
                  <p key={index} className="text-sm text-red-600">{error}</p>
                ))}
              </div>
            )}
            
            <div className="flex gap-3 pt-2">
              <Button onClick={saveItems}>Save</Button>
              <button
                onClick={cancelEditingItems}
                className="px-5 py-2 text-gray-600 hover:text-gray-800 font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
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
