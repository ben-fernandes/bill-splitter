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
        setTempPeople([{ id: Date.now().toString(), name: '' }])
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
    setTempPeople([...tempPeople, { id: newId, name: '' }])
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

  const handleKeyDown = (e: React.KeyboardEvent, personId: string) => {
    // Ctrl/Cmd+Enter to save
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSave()
      return
    }
    
    // Regular Enter to add new row
    if (e.key === 'Enter') {
      e.preventDefault()
      const currentIndex = tempPeople.findIndex(p => p.id === personId)
      if (currentIndex === tempPeople.length - 1) {
        // If this is the last row, add a new person
        const newId = Date.now().toString()
        setTempPeople([...tempPeople, { id: newId, name: '' }])
        // Focus will happen automatically when the new input renders
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
        {tempPeople.map(person => (
          <div key={person.id} className="flex gap-3 items-center">
            <Input
              value={person.name}
              onChange={(value) => updatePersonName(person.id, value)}
              onKeyDown={(e) => handleKeyDown(e, person.id)}
              placeholder="Person name"
              className="flex-1"
            />
            <button
              onClick={() => removePerson(person.id)}
              disabled={tempPeople.length === 1}
              className={`text-sm px-3 transition-colors ${
                tempPeople.length === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'cursor-pointer'
              }`}
              style={tempPeople.length > 1 ? { background: 'none', color: '#dc2626' } : undefined}
              onMouseEnter={(e) => tempPeople.length > 1 && (e.currentTarget.style.color = '#991b1b')}
              onMouseLeave={(e) => tempPeople.length > 1 && (e.currentTarget.style.color = '#dc2626')}
            >
              Remove
            </button>
          </div>
        ))}
        <Button onClick={addPerson}>+ Add Person</Button>
        
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
