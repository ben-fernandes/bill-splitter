import { useState } from 'react'
import { Modal } from '../../../components/Modal'
import { Button } from '../../../components/Button'
import { Input } from '../../../components/Input'
import type { MenuItem } from '../../../context/BillContext'

interface ItemsEditModalProps {
  isOpen: boolean
  items: MenuItem[]
  onSave: (items: MenuItem[]) => void
  onClose: () => void
}

export function ItemsEditModal({ isOpen, items, onSave, onClose }: ItemsEditModalProps) {
  const [tempItems, setTempItems] = useState<MenuItem[]>([])
  const [errors, setErrors] = useState<string[]>([])

  const handleOpen = () => {
    setTempItems(JSON.parse(JSON.stringify(items)))
    setErrors([])
  }

  const handleSave = () => {
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

    onSave(tempItems)
    setErrors([])
  }

  const handleClose = () => {
    setErrors([])
    onClose()
  }

  const addItem = () => {
    const newId = Date.now().toString()
    setTempItems([...tempItems, { id: newId, name: '', price: 0, quantity: 1 }])
    // Focus the new item's name field
    setTimeout(() => {
      const inputs = document.querySelectorAll('input[placeholder="Item name"]')
      const lastInput = inputs[inputs.length - 1] as HTMLInputElement
      lastInput?.focus()
    }, 0)
  }

  const removeItem = (id: string) => {
    setTempItems(tempItems.filter(i => i.id !== id))
  }

  const updateItemName = (id: string, name: string) => {
    setTempItems(tempItems.map(i => i.id === id ? { ...i, name } : i))
  }

  const updateItemPrice = (id: string, price: number) => {
    setTempItems(tempItems.map(i => i.id === id ? { ...i, price } : i))
  }

  const updateItemQuantity = (id: string, quantity: number) => {
    setTempItems(tempItems.map(i => i.id === id ? { ...i, quantity } : i))
  }

  const handleKeyDown = (e: React.KeyboardEvent, itemId: string, fieldType?: 'name' | 'price' | 'quantity') => {
    // Ctrl/Cmd+Enter to save
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSave()
      return
    }
    
    // Regular Enter to add new row (only from price or quantity fields in last row)
    if (e.key === 'Enter') {
      e.preventDefault()
      const currentIndex = tempItems.findIndex(i => i.id === itemId)
      const isLastRow = currentIndex === tempItems.length - 1
      const isLastField = fieldType === 'price' || fieldType === 'quantity'
      
      if (isLastRow && isLastField) {
        // If this is the last row and in price/quantity field, add a new item
        const newId = Date.now().toString()
        setTempItems([...tempItems, { id: newId, name: '', price: 0, quantity: 1 }])
        // Focus the name field of the new row
        setTimeout(() => {
          const inputs = document.querySelectorAll('input[placeholder="Item name"]')
          const lastInput = inputs[inputs.length - 1] as HTMLInputElement
          lastInput?.focus()
        }, 0)
      }
    }
  }

  // Initialize temp data when modal opens
  if (isOpen && tempItems.length === 0 && items.length > 0) {
    handleOpen()
  }

  // Reset temp data when modal opens from empty state
  if (isOpen && items.length === 0 && tempItems.length === 0) {
    setTempItems([{ id: Date.now().toString(), name: '', price: 0, quantity: 1 }])
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title="Edit Items"
      footer={<Button onClick={handleSave}>Save</Button>}
    >
      <div className="space-y-3">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-2 px-2 text-gray-700 font-semibold text-sm">Item</th>
              <th className="text-right py-2 px-2 text-gray-700 font-semibold text-sm">Price</th>
              <th className="text-right py-2 px-2 text-gray-700 font-semibold text-sm">Qty</th>
              <th className="text-right py-2 px-2 text-gray-700 font-semibold text-sm">Total</th>
              <th className="py-2 px-2"></th>
            </tr>
          </thead>
          <tbody>
            {tempItems.map(item => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-2 px-2">
                  <Input
                    value={item.name}
                    onChange={(value) => updateItemName(item.id, value)}
                    onKeyDown={(e) => handleKeyDown(e, item.id, 'name')}
                    placeholder="Item name"
                    className="w-full"
                  />
                </td>
                <td className="py-2 px-2">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-600 font-semibold">£</span>
                    <Input
                      type="number"
                      value={item.price || ''}
                      onChange={(value) => updateItemPrice(item.id, parseFloat(value) || 0)}
                      onKeyDown={(e) => handleKeyDown(e, item.id, 'price')}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-24"
                    />
                  </div>
                </td>
                <td className="py-2 px-2">
                  <Input
                    type="number"
                    value={item.quantity || ''}
                    onChange={(value) => updateItemQuantity(item.id, parseInt(value) || 1)}
                    onKeyDown={(e) => handleKeyDown(e, item.id, 'quantity')}
                    placeholder="1"
                    min="1"
                    className="w-16"
                  />
                </td>
                <td className="py-2 px-2 text-right text-gray-800 font-semibold">
                  £{(item.price * item.quantity).toFixed(2)}
                </td>
                <td className="py-2 px-2">
                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={tempItems.length === 1}
                    className={`text-sm px-3 transition-colors ${
                      tempItems.length === 1
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-red-600 hover:text-red-800 cursor-pointer'
                    }`}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-300">
              <td colSpan={3} className="py-2 px-2 text-right text-gray-700 font-bold">Subtotal:</td>
              <td className="py-2 px-2 text-right text-purple-600 font-bold">
                £{tempItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
        <Button onClick={addItem}>+ Add Item</Button>
        
        {errors.length > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            {errors.map((error, index) => (
              <p key={index} className="text-sm text-red-600">{error}</p>
            ))}
          </div>
        )}
      </div>
    </Modal>
  )
}
