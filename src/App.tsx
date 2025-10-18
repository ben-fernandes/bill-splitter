import { useState } from 'react'
import './App.css'

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
    { id: '1', name: 'Item 1', price: 0 },
    { id: '2', name: 'Item 2', price: 0 }
  ])
  
  const [shares, setShares] = useState<Share[]>([])
  const [serviceCharge, setServiceCharge] = useState<number>(0)

  const addPerson = () => {
    const newId = Date.now().toString()
    setPeople([...people, { id: newId, name: `Person ${people.length + 1}` }])
  }

  const addItem = () => {
    const newId = Date.now().toString()
    setItems([...items, { id: newId, name: `Item ${items.length + 1}`, price: 0 }])
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
    <div className="app">
      <h1>Bill Splitter</h1>
      
      <div className="table-container">
        <table className="bill-table">
          <thead>
            <tr>
              <th>Item / Person</th>
              {people.map(person => (
                <th key={person.id}>
                  <input
                    type="text"
                    value={person.name}
                    onChange={(e) => updatePersonName(person.id, e.target.value)}
                    className="header-input"
                  />
                </th>
              ))}
              <th>
                <button onClick={addPerson} className="add-btn">+ Person</button>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>
                  <div className="item-cell">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItemName(item.id, e.target.value)}
                      className="item-name-input"
                      placeholder="Item name"
                    />
                    <input
                      type="number"
                      value={item.price || ''}
                      onChange={(e) => updateItemPrice(item.id, parseFloat(e.target.value) || 0)}
                      className="item-price-input"
                      placeholder="Price"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </td>
                {people.map(person => (
                  <td key={person.id}>
                    <input
                      type="number"
                      value={getShare(person.id, item.id) || ''}
                      onChange={(e) => updateShare(person.id, item.id, parseFloat(e.target.value) || 0)}
                      className="share-input"
                      placeholder="0"
                      min="0"
                      max="100"
                    />
                  </td>
                ))}
                <td></td>
              </tr>
            ))}
            <tr>
              <td colSpan={people.length + 2}>
                <button onClick={addItem} className="add-btn">+ Item</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="service-charge">
        <label>
          Service Charge (%):
          <input
            type="number"
            value={serviceCharge || ''}
            onChange={(e) => setServiceCharge(parseFloat(e.target.value) || 0)}
            className="service-charge-input"
            placeholder="0"
            min="0"
            max="100"
          />
        </label>
      </div>

      <div className="summary-container">
        <h2>Summary</h2>
        <table className="summary-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount Owed</th>
            </tr>
          </thead>
          <tbody>
            {people.map(person => (
              <tr key={person.id}>
                <td>{person.name}</td>
                <td>£{calculateAmountOwed(person.id).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
