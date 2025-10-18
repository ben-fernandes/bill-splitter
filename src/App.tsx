import { useState } from 'react'

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
      
      <div className="overflow-x-auto mb-8 rounded-lg shadow-lg">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr>
              <th className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 border border-gray-200 text-center font-semibold">
                Item / Person
              </th>
              {people.map(person => (
                <th key={person.id} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 border border-gray-200">
                  <input
                    type="text"
                    value={person.name}
                    onChange={(e) => updatePersonName(person.id, e.target.value)}
                    className="w-full px-3 py-2 border-2 border-white/30 rounded bg-white/20 text-white font-semibold text-center placeholder-white/70 focus:outline-none focus:border-white/60 focus:bg-white/30"
                  />
                </th>
              ))}
              <th className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 border border-gray-200">
                <button 
                  onClick={addPerson} 
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-md font-semibold transition-all hover:scale-105 hover:shadow-lg"
                >
                  + Person
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 border border-gray-200">
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItemName(item.id, e.target.value)}
                      className="flex-1 px-3 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-purple-500"
                      placeholder="Item name"
                    />
                    <input
                      type="number"
                      value={item.price || ''}
                      onChange={(e) => updateItemPrice(item.id, parseFloat(e.target.value) || 0)}
                      className="w-24 px-3 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-purple-500"
                      placeholder="Price"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </td>
                {people.map(person => (
                  <td key={person.id} className="p-4 border border-gray-200 text-center">
                    <input
                      type="number"
                      value={getShare(person.id, item.id) || ''}
                      onChange={(e) => updateShare(person.id, item.id, parseFloat(e.target.value) || 0)}
                      className="w-20 px-3 py-2 border-2 border-gray-300 rounded text-center focus:outline-none focus:border-purple-500"
                      placeholder="0"
                      min="0"
                      max="100"
                    />
                  </td>
                ))}
                <td className="p-4 border border-gray-200"></td>
              </tr>
            ))}
            <tr>
              <td colSpan={people.length + 2} className="p-4 border border-gray-200">
                <button 
                  onClick={addItem} 
                  className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  + Item
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-8 p-6 bg-white rounded-lg shadow-lg">
        <label className="flex items-center gap-4 text-lg font-semibold text-gray-700">
          Service Charge (%):
          <input
            type="number"
            value={serviceCharge || ''}
            onChange={(e) => setServiceCharge(parseFloat(e.target.value) || 0)}
            className="w-32 px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-purple-500 text-base"
            placeholder="0"
            min="0"
            max="100"
          />
        </label>
      </div>

      <div className="mt-12 p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Summary</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 border border-gray-200 text-left font-semibold">
                Name
              </th>
              <th className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 border border-gray-200 text-left font-semibold">
                Amount Owed
              </th>
            </tr>
          </thead>
          <tbody>
            {people.map(person => (
              <tr key={person.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 border border-gray-200">{person.name}</td>
                <td className="p-4 border border-gray-200 font-bold text-purple-600 text-lg">
                  £{calculateAmountOwed(person.id).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
