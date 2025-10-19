import { useState, useEffect } from 'react'
import { Modal } from '../../../components/Modal'
import { Button } from '../../../components/Button'
import { Input } from '../../../components/Input'
import type { MenuItem } from '../../../context/BillContext'

interface ItemsEditModalProps {
  isOpen: boolean
  items: MenuItem[]
  serviceCharge: number
  onSave: (items: MenuItem[], serviceCharge: number) => void
  onClose: () => void
}

export function ItemsEditModal({ isOpen, items, serviceCharge, onSave, onClose }: ItemsEditModalProps) {
  const [tempItems, setTempItems] = useState<MenuItem[]>([])
  const [tempServiceCharge, setTempServiceCharge] = useState(0)
  const [errors, setErrors] = useState<string[]>([])

  // Reset temp data whenever modal opens
  useEffect(() => {
    if (isOpen) {
      if (items.length > 0) {
        setTempItems(JSON.parse(JSON.stringify(items)))
      } else {
        setTempItems([{ id: Date.now().toString(), name: '', price: 0, quantity: 1 }])
      }
      setTempServiceCharge(serviceCharge)
      setErrors([])
    }
  }, [isOpen, items, serviceCharge])

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

    onSave(tempItems, tempServiceCharge)
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
            <tr className="border-b-2">
              <th className="text-left py-2 px-3 font-semibold text-sm">Item</th>
              <th className="text-right py-2 px-3 font-semibold text-sm">Price</th>
              <th className="text-right py-2 px-3 font-semibold text-sm">Qty</th>
              <th className="text-right py-2 px-3 font-semibold text-sm">Total</th>
              <th className="py-2 px-3"></th>
            </tr>
          </thead>
          <tbody>
            {tempItems.map(item => (
              <tr key={item.id} className="border-b">
                <td className="py-2 px-3">
                  <Input
                    value={item.name}
                    onChange={(value) => updateItemName(item.id, value)}
                    onKeyDown={(e) => handleKeyDown(e, item.id, 'name')}
                    placeholder="Item name"
                    className="w-full"
                  />
                </td>
                <td className="py-2 px-3">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold opacity-75">£</span>
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
                <td className="py-2 px-3">
                  <Input
                    type="number"
                    value={item.quantity || ''}
                    onChange={(value) => updateItemQuantity(item.id, parseInt(value) || 1)}
                    onKeyDown={(e) => handleKeyDown(e, item.id, 'quantity')}
                    placeholder="1"
                    min="1"
                    step="1"
                    className="w-16"
                  />
                </td>
                <td className="py-2 px-3 text-right font-semibold numeric">
                  £{(item.price * item.quantity).toFixed(2)}
                </td>
                <td className="py-2 px-3">
                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={tempItems.length === 1}
                    className={`text-sm px-3 transition-colors ${
                      tempItems.length === 1
                        ? 'opacity-40 cursor-not-allowed'
                        : 'cursor-pointer'
                    }`}
                    style={tempItems.length > 1 ? { background: 'none', color: '#dc2626' } : undefined}
                    onMouseEnter={(e) => tempItems.length > 1 && (e.currentTarget.style.color = '#991b1b')}
                    onMouseLeave={(e) => tempItems.length > 1 && (e.currentTarget.style.color = '#dc2626')}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2">
              <td colSpan={5} className="py-3 px-3">
                <Button onClick={addItem}>+ Add Item</Button>
              </td>
            </tr>
            <tr>
              <td colSpan={3} className="py-2 px-3 text-right font-semibold">Subtotal:</td>
              <td className="py-2 px-3 text-right font-semibold numeric">
                £{tempItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
              </td>
              <td></td>
            </tr>
            <tr>
              <td colSpan={3} className="py-2 px-3 text-right opacity-75">
                <div className="flex items-center justify-end gap-2">
                  <span>Service Charge:</span>
                  <Input
                    type="number"
                    value={tempServiceCharge || ''}
                    onChange={(value) => setTempServiceCharge(parseFloat(value) || 0)}
                    placeholder="0"
                    min="0"
                    max="100"
                    className="w-20"
                  />
                  <span>%</span>
                </div>
              </td>
              <td className="py-2 px-3 text-right opacity-75 numeric">
                {tempServiceCharge > 0 ? `£${((tempItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) * tempServiceCharge) / 100).toFixed(2)}` : '£0.00'}
              </td>
              <td></td>
            </tr>
            <tr className="border-t">
              <td colSpan={3} className="py-2 px-3 text-right font-bold">Grand Total:</td>
              <td className="py-2 px-3 text-right font-bold text-lg numeric">
                £{(() => {
                  const subtotal = tempItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
                  const serviceChargeAmount = (subtotal * tempServiceCharge) / 100
                  return (subtotal + serviceChargeAmount).toFixed(2)
                })()}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
        
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
