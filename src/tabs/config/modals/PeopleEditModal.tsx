import { useState, useEffect } from 'react'
import { Modal } from '../../../components/Modal'
import { Button } from '../../../components/Button'
import { Input } from '../../../components/Input'
import type { Person } from '../../../context/BillContext'

interface PeopleEditModalProps {
  isOpen: boolean
  people: Person[]
  onSave: (people: Person[]) => void
  onClose: () => void
}

export function PeopleEditModal({ isOpen, people, onSave, onClose }: PeopleEditModalProps) {
  const [tempPeople, setTempPeople] = useState<Person[]>([])
  const [errors, setErrors] = useState<string[]>([])

  // Reset temp data whenever modal opens
  useEffect(() => {
    if (isOpen) {
      if (people.length > 0) {
        setTempPeople(JSON.parse(JSON.stringify(people)))
      } else {
        setTempPeople([{ id: Date.now().toString(), name: '', amountPaid: 0 }])
      }
      setErrors([])
    }
  }, [isOpen, people])

  const handleSave = () => {
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

    onSave(tempPeople)
    setErrors([])
  }

  const handleClose = () => {
    setErrors([])
    onClose()
  }

  const addPerson = () => {
    const newId = Date.now().toString()
    setTempPeople([...tempPeople, { id: newId, name: '', amountPaid: 0 }])
    // Focus the new input field
    setTimeout(() => {
      const inputs = document.querySelectorAll('input[placeholder="Person name"]')
      const lastInput = inputs[inputs.length - 1] as HTMLInputElement
      lastInput?.focus()
    }, 0)
  }

  const removePerson = (id: string) => {
    setTempPeople(tempPeople.filter(p => p.id !== id))
  }

  const updatePersonName = (id: string, name: string) => {
    setTempPeople(tempPeople.map(p => p.id === id ? { ...p, name } : p))
  }

  const updatePersonAmountPaid = (id: string, amountPaid: number) => {
    setTempPeople(tempPeople.map(p => p.id === id ? { ...p, amountPaid } : p))
  }

  const handleKeyDown = (e: React.KeyboardEvent, personId: string, fieldType?: 'name' | 'amountPaid') => {
    // Ctrl/Cmd+Enter to save
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSave()
      return
    }
    
    // Regular Enter to add new row (from name or amountPaid field in last row)
    if (e.key === 'Enter') {
      e.preventDefault()
      const currentIndex = tempPeople.findIndex(p => p.id === personId)
      const isLastRow = currentIndex === tempPeople.length - 1
      
      if (isLastRow && (fieldType === 'name' || fieldType === 'amountPaid')) {
        // If this is the last row, add a new person
        const newId = Date.now().toString()
        setTempPeople([...tempPeople, { id: newId, name: '', amountPaid: 0 }])
        // Focus the name field of the new row
        setTimeout(() => {
          const inputs = document.querySelectorAll('input[placeholder="Person name"]')
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
      title="Edit People"
      footer={<Button onClick={handleSave}>Save</Button>}
    >
      <div className="space-y-3">
        <table className="w-full">
          <thead>
            <tr className="border-b-2">
              <th className="text-left py-2 px-3 font-semibold text-sm">Name</th>
              <th className="text-right py-2 px-3 font-semibold text-sm">Amount Paid</th>
              <th className="py-2 px-3"></th>
            </tr>
          </thead>
          <tbody>
            {tempPeople.map(person => (
              <tr key={person.id} className="border-b">
                <td className="py-2 px-3">
                  <Input
                    value={person.name}
                    onChange={(value) => updatePersonName(person.id, value)}
                    onKeyDown={(e) => handleKeyDown(e, person.id, 'name')}
                    placeholder="Person name"
                    className="w-full"
                  />
                </td>
                <td className="py-2 px-3">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold opacity-75">£</span>
                    <Input
                      type="number"
                      value={person.amountPaid || ''}
                      onChange={(value) => updatePersonAmountPaid(person.id, parseFloat(value) || 0)}
                      onKeyDown={(e) => handleKeyDown(e, person.id, 'amountPaid')}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="w-24"
                    />
                  </div>
                </td>
                <td className="py-2 px-3">
                  <button
                    onClick={() => removePerson(person.id)}
                    disabled={tempPeople.length === 1}
                    className={`text-sm px-3 transition-colors ${
                      tempPeople.length === 1
                        ? 'opacity-40 cursor-not-allowed'
                        : 'cursor-pointer'
                    }`}
                    style={tempPeople.length > 1 ? { background: 'none', color: '#dc2626' } : undefined}
                    onMouseEnter={(e) => tempPeople.length > 1 && (e.currentTarget.style.color = '#991b1b')}
                    onMouseLeave={(e) => tempPeople.length > 1 && (e.currentTarget.style.color = '#dc2626')}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2">
              <td colSpan={3} className="py-3 px-3">
                <Button onClick={addPerson}>+ Add Person</Button>
              </td>
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
