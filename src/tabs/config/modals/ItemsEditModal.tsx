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
    setTempItems([...tempItems, { id: newId, name: '', price: 0 }])
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

  // Initialize temp data when modal opens
  if (isOpen && tempItems.length === 0 && items.length > 0) {
    handleOpen()
  }

  // Reset temp data when modal opens from empty state
  if (isOpen && items.length === 0 && tempItems.length === 0) {
    setTempItems([{ id: Date.now().toString(), name: '', price: 0 }])
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title="Edit Items"
      footer={<Button onClick={handleSave}>Save</Button>}
    >
      <div className="space-y-3">
        {tempItems.map(item => (
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
