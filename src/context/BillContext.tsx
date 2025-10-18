import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export interface Person {
  id: string
  name: string
}

export interface MenuItem {
  id: string
  name: string
  price: number
}

export interface Share {
  personId: string
  itemId: string
  percentage: number
}

interface BillContextType {
  people: Person[]
  items: MenuItem[]
  shares: Share[]
  serviceCharge: number
  setPeople: (people: Person[]) => void
  setItems: (items: MenuItem[]) => void
  setShares: (shares: Share[]) => void
  setServiceCharge: (charge: number) => void
  addPerson: () => void
  addItem: () => void
  removePerson: (id: string) => void
  removeItem: (id: string) => void
  updatePersonName: (id: string, name: string) => void
  updateItemName: (id: string, name: string) => void
  updateItemPrice: (id: string, price: number) => void
  updateShare: (personId: string, itemId: string, percentage: number) => void
  getShare: (personId: string, itemId: string) => number
  calculateAmountOwed: (personId: string) => number
}

const BillContext = createContext<BillContextType | undefined>(undefined)

export function BillProvider({ children }: { children: ReactNode }) {
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
    setShares(shares.filter(s => s.personId !== id))
  }

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id))
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
    <BillContext.Provider
      value={{
        people,
        items,
        shares,
        serviceCharge,
        setPeople,
        setItems,
        setShares,
        setServiceCharge,
        addPerson,
        addItem,
        removePerson,
        removeItem,
        updatePersonName,
        updateItemName,
        updateItemPrice,
        updateShare,
        getShare,
        calculateAmountOwed
      }}
    >
      {children}
    </BillContext.Provider>
  )
}

export function useBill() {
  const context = useContext(BillContext)
  if (context === undefined) {
    throw new Error('useBill must be used within a BillProvider')
  }
  return context
}
