import { useState } from 'react'
import { useBill } from '../../context/BillContext'
import { useTheme } from '../../context/ThemeContext'
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
  
  const { mode, setMode } = useTheme()

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

  const handleExportData = () => {
    const exportData = {
      people,
      items,
      shares,
      serviceCharge,
      exportedAt: new Date().toISOString()
    }
    
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `bill-splitter-export-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const importedData = JSON.parse(content)
        
        // Validate the imported data has the expected structure
        if (importedData.people && importedData.items && importedData.shares !== undefined && importedData.serviceCharge !== undefined) {
          setPeople(importedData.people)
          setItems(importedData.items)
          setShares(importedData.shares)
          setServiceCharge(importedData.serviceCharge)
          alert('Data imported successfully!')
        } else {
          alert('Invalid file format. Please select a valid bill-splitter export file.')
        }
      } catch (error) {
        console.error('Error importing data:', error)
        alert('Error importing file. Please check the file format.')
      }
    }
    reader.readAsText(file)
    
    // Reset the input so the same file can be imported again if needed
    event.target.value = ''
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
          <div className="space-y-2">
            {people.map(person => (
              <div key={person.id} className="py-2 px-3 rounded border">
                <span>{person.name}</span>
              </div>
            ))}
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

      {/* Other Settings Section - Level 2 */}
      <div className="p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Other Settings</h2>
        
        {/* Theme - Level 3 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Theme</h3>
          <div className="inline-flex rounded-lg border overflow-hidden">
            <button
              onClick={() => setMode('light')}
              className={`px-4 py-2 font-semibold transition-colors ${
                mode === 'light'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                  : 'hover:bg-black/5'
              }`}
            >
              Light
            </button>
            <button
              onClick={() => setMode('dark')}
              className={`px-4 py-2 font-semibold transition-colors border-l border-r ${
                mode === 'dark'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                  : 'hover:bg-black/5'
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => setMode('auto')}
              className={`px-4 py-2 font-semibold transition-colors ${
                mode === 'auto'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                  : 'hover:bg-black/5'
              }`}
            >
              Auto
            </button>
          </div>
        </div>

        {/* Export/Import Data - Level 3 */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Backup & Restore</h3>
          <div className="flex gap-3">
            <Button onClick={handleExportData}>Export JSON</Button>
            <label className="px-5 py-2 bg-purple-600 text-white rounded font-semibold hover:bg-purple-700 transition-colors cursor-pointer">
              Import JSON
              <input
                type="file"
                accept=".json,application/json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

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
