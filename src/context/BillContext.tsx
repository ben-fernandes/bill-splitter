import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { serializeData, deserializeData } from '../lib/serde'

export interface Person {
  id: string
  name: string
}

export interface MenuItem {
  id: string
  name: string
  price: number
  quantity: number
}

export interface Share {
  personId: string
  itemId: string
  portions: number
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
  updateItemQuantity: (id: string, quantity: number) => void
  updateShare: (personId: string, itemId: string, portions: number) => void
  getShare: (personId: string, itemId: string) => number
  calculateAmountsOwedWithRounding: () => Map<string, number>
}

const BillContext = createContext<BillContextType | undefined>(undefined)

export function BillProvider({ children }: { children: ReactNode }) {
  // Helper to load initial data from URL or localStorage
  const loadInitialData = () => {
    try {
      // Check for URL query parameter first
      const params = new URLSearchParams(window.location.search)
      const dataParam = params.get('data')
      
      if (dataParam) {
        // Deserialize and parse JSON
        const data = deserializeData(dataParam)
        
        // Save to localStorage
        if (data.people) localStorage.setItem('bill-splitter-people', JSON.stringify(data.people))
        if (data.items) localStorage.setItem('bill-splitter-items', JSON.stringify(data.items))
        if (data.shares) localStorage.setItem('bill-splitter-shares', JSON.stringify(data.shares))
        if (data.serviceCharge !== undefined) localStorage.setItem('bill-splitter-service-charge', JSON.stringify(data.serviceCharge))
        
        return data
      }
    } catch (error) {
      console.error('Error loading data from URL:', error)
    }
    
    // Fall back to localStorage
    try {
      return {
        people: JSON.parse(localStorage.getItem('bill-splitter-people') || '[]'),
        items: JSON.parse(localStorage.getItem('bill-splitter-items') || '[]'),
        shares: JSON.parse(localStorage.getItem('bill-splitter-shares') || '[]'),
        serviceCharge: JSON.parse(localStorage.getItem('bill-splitter-service-charge') || '0')
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error)
      return { people: [], items: [], shares: [], serviceCharge: 0 }
    }
  }

  const initialData = loadInitialData()
  
  const [people, setPeople] = useState<Person[]>(initialData.people)
  const [items, setItems] = useState<MenuItem[]>(initialData.items)
  const [shares, setShares] = useState<Share[]>(initialData.shares)
  const [serviceCharge, setServiceCharge] = useState<number>(initialData.serviceCharge)

  // Helper to update URL with current data
  const updateURL = (currentPeople: Person[], currentItems: MenuItem[], currentShares: Share[], currentServiceCharge: number) => {
    try {
      const data = {
        people: currentPeople,
        items: currentItems,
        shares: currentShares,
        serviceCharge: currentServiceCharge
      }
      
      const serialized = serializeData(data)
      
      const url = new URL(window.location.href)
      url.searchParams.set('data', serialized)
      window.history.replaceState({}, '', url.toString())
    } catch (error) {
      console.error('Error updating URL:', error)
    }
  }

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem('bill-splitter-people', JSON.stringify(people))
    } catch (error) {
      console.error('Error saving people to localStorage:', error)
    }
  }, [people])

  useEffect(() => {
    try {
      localStorage.setItem('bill-splitter-items', JSON.stringify(items))
    } catch (error) {
      console.error('Error saving items to localStorage:', error)
    }
  }, [items])

  useEffect(() => {
    try {
      localStorage.setItem('bill-splitter-shares', JSON.stringify(shares))
    } catch (error) {
      console.error('Error saving shares to localStorage:', error)
    }
  }, [shares])

  useEffect(() => {
    try {
      localStorage.setItem('bill-splitter-service-charge', JSON.stringify(serviceCharge))
    } catch (error) {
      console.error('Error saving service charge to localStorage:', error)
    }
  }, [serviceCharge])

  // Update URL whenever any state changes
  useEffect(() => {
    updateURL(people, items, shares, serviceCharge)
  }, [people, items, shares, serviceCharge])

  const addPerson = () => {
    const newId = Date.now().toString()
    setPeople([...people, { id: newId, name: `Person ${people.length + 1}` }])
  }

  const addItem = () => {
    const newId = Date.now().toString()
    setItems([...items, { id: newId, name: '', price: 0, quantity: 1 }])
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

  const updateItemQuantity = (id: string, quantity: number) => {
    setItems(items.map(i => i.id === id ? { ...i, quantity } : i))
  }

  const updateShare = (personId: string, itemId: string, portions: number) => {
    const existingShareIndex = shares.findIndex(
      s => s.personId === personId && s.itemId === itemId
    )
    
    if (existingShareIndex >= 0) {
      const newShares = [...shares]
      newShares[existingShareIndex] = { personId, itemId, portions }
      setShares(newShares)
    } else {
      setShares([...shares, { personId, itemId, portions }])
    }
  }

  const getShare = (personId: string, itemId: string): number => {
    const share = shares.find(s => s.personId === personId && s.itemId === itemId)
    return share?.portions || 0
  }

  const calculateAmountOwed = (personId: string): number => {
    let subtotal = 0
    
    items.forEach(item => {
      const personPortions = getShare(personId, item.id)
      
      // Calculate total portions for this item across all people
      const totalPortions = people.reduce((sum, person) => {
        return sum + getShare(person.id, item.id)
      }, 0)
      
      // Calculate this person's share based on their portions
      if (totalPortions > 0 && personPortions > 0) {
        const itemTotal = item.price * item.quantity
        subtotal += (itemTotal * personPortions) / totalPortions
      }
    })
    
    const serviceChargeAmount = (subtotal * serviceCharge) / 100
    return subtotal + serviceChargeAmount
  }

  const calculateAmountsOwedWithRounding = (): Map<string, number> => {
    const amounts = new Map<string, number>()
    
    // Calculate grand total
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const serviceChargeAmount = (subtotal * serviceCharge) / 100
    const grandTotal = subtotal + serviceChargeAmount
    
    // Calculate each person's amount and round
    let roundedSum = 0
    people.forEach((person, index) => {
      if (index < people.length - 1) {
        // Round normally for all but the last person
        const amount = Math.round(calculateAmountOwed(person.id) * 100) / 100
        amounts.set(person.id, amount)
        roundedSum += amount
      } else {
        // Last person gets the remainder to ensure total matches exactly
        const amount = Math.round(grandTotal * 100) / 100 - roundedSum
        amounts.set(person.id, amount)
      }
    })
    
    return amounts
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
        updateItemQuantity,
        updateShare,
        getShare,
        calculateAmountsOwedWithRounding
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
