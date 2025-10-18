import { useState } from 'react'
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

  const handleOpen = () => {
    setTempPeople(JSON.parse(JSON.stringify(people)))
    setErrors([])
  }

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
  }

  const removePerson = (id: string) => {
    setTempPeople(tempPeople.filter(p => p.id !== id))
  }

  const updatePersonName = (id: string, name: string) => {
    setTempPeople(tempPeople.map(p => p.id === id ? { ...p, name } : p))
  }

  // Initialize temp data when modal opens
  if (isOpen && tempPeople.length === 0 && people.length > 0) {
    handleOpen()
  }

  // Reset temp data when modal opens from empty state
  if (isOpen && people.length === 0 && tempPeople.length === 0) {
    setTempPeople([{ id: Date.now().toString(), name: '' }])
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
