import { useState } from 'react'
import { Button } from './components/Button'
import { Input } from './components/Input'
import { Table, TableHeader, TableCell, TableRow } from './components/Table'

interface Person {
  id: string
  name: string
}

interface MenuItem {
  id: string
  name: string
  price: number
}

interface Share {
  personId: string
  itemId: string
  percentage: number
}

function App() {
  const [people, setPeople] = useState<Person[]>([
    { id: '1', name: 'Person 1' },
    { id: '2', name: 'Person 2' }
  ])
  
  const [items, setItems] = useState<MenuItem[]>([
    { id: '1', name: '', price: 0 },
    { id: '2', name: '', price: 0 }
  ])
  
  const [shares, setShares] = useState<Share[]>([])
  const [serviceCharge, setServiceCharge] = useState<number>(0)

  const addPerson = () => {
    const newId = Date.now().toString()
    setPeople([...people, { id: newId, name: `Person ${people.length + 1}` }])
  }

  const addItem = () => {
    const newId = Date.now().toString()
    setItems([...items, { id: newId, name: '', price: 0 }])
  }

  const removePerson = (id: string) => {
    setPeople(people.filter(p => p.id !== id))
    // Also remove all shares for this person
    setShares(shares.filter(s => s.personId !== id))
  }

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id))
    // Also remove all shares for this item
    setShares(shares.filter(s => s.itemId !== id))
  }

  const updatePersonName = (id: string, name: string) => {
    setPeople(people.map(p => p.id === id ? { ...p, name } : p))
  }

  const updateItemName = (id: string, name: string) => {
    setItems(items.map(i => i.id === id ? { ...i, name } : i))
  }

  const updateItemPrice = (id: string, price: number) => {
    setItems(items.map(i => i.id === id ? { ...i, price } : i))
  }

  const updateShare = (personId: string, itemId: string, percentage: number) => {
    const existingShareIndex = shares.findIndex(
      s => s.personId === personId && s.itemId === itemId
    )
    
    if (existingShareIndex >= 0) {
      const newShares = [...shares]
      newShares[existingShareIndex] = { personId, itemId, percentage }
      setShares(newShares)
    } else {
      setShares([...shares, { personId, itemId, percentage }])
    }
  }

  const getShare = (personId: string, itemId: string): number => {
    const share = shares.find(s => s.personId === personId && s.itemId === itemId)
    return share?.percentage || 0
  }

  const calculateAmountOwed = (personId: string): number => {
    let subtotal = 0
    
    items.forEach(item => {
      const share = getShare(personId, item.id)
      subtotal += (item.price * share) / 100
    })
    
    const serviceChargeAmount = (subtotal * serviceCharge) / 100
    return subtotal + serviceChargeAmount
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Bill Splitter</h1>
      
      <Table className="mb-8">
        <thead>
          <tr>
            <TableHeader>
              <div className="text-center">Item / Person</div>
            </TableHeader>
            {people.map(person => (
              <TableHeader key={person.id}>
                <div className="flex flex-col gap-2">
                  <Input
                    value={person.name}
                    onChange={(value) => updatePersonName(person.id, value)}
                    variant="header"
                  />
                  <button
                    onClick={() => removePerson(person.id)}
                    className="text-xs text-white/70 hover:text-white transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </TableHeader>
            ))}
            <TableHeader>
              <Button onClick={addPerson} variant="secondary">
                + Person
              </Button>
            </TableHeader>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <TableRow key={item.id} hover>
              <TableCell>
                <div className="flex gap-2 items-center">
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
                      className="w-20"
                    />
                  </div>
                </div>
              </TableCell>
              {people.map(person => (
                <TableCell key={person.id} className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Input
                      type="number"
                      value={getShare(person.id, item.id) || ''}
                      onChange={(value) => updateShare(person.id, item.id, parseFloat(value) || 0)}
                      placeholder="0"
                      min="0"
                      max="100"
                      className="w-16 text-center"
                    />
                    <span className="text-gray-600 font-semibold">%</span>
                  </div>
                </TableCell>
              ))}
              <TableCell>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-sm text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                >
                  Remove
                </button>
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={people.length + 2}>
              <Button onClick={addItem}>+ Item</Button>
            </TableCell>
          </TableRow>
        </tbody>
      </Table>

      <div className="mb-8 p-6 bg-white rounded-lg shadow-lg">
        <label className="flex items-center gap-4 text-lg font-semibold text-gray-700">
          Service Charge (%):
          <Input
            type="number"
            value={serviceCharge || ''}
            onChange={(value) => setServiceCharge(parseFloat(value) || 0)}
            placeholder="0"
            min="0"
            max="100"
            className="w-32"
          />
        </label>
      </div>

      <div className="mt-12 p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Summary</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <TableHeader>
                <div className="text-left">Name</div>
              </TableHeader>
              <TableHeader>
                <div className="text-left">Amount Owed</div>
              </TableHeader>
            </tr>
          </thead>
          <tbody>
            {people.map(person => (
              <TableRow key={person.id} hover>
                <TableCell>{person.name}</TableCell>
                <TableCell className="font-bold text-purple-600 text-lg">
                  £{calculateAmountOwed(person.id).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
