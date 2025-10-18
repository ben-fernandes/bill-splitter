import { useState } from 'react'
import { BillProvider } from './context/BillContext'
import { Tabs } from './components/Tabs'
import { ConfigTab } from './tabs/ConfigTab'
import { SplitTab } from './tabs/SplitTab'
import { DuesTab } from './tabs/DuesTab'

function App() {
  const [activeTab, setActiveTab] = useState<string>('config')

  const tabs = [
    { id: 'config', label: 'Config' },
    { id: 'split', label: 'Split' },
    { id: 'dues', label: 'Dues' }
  ]

  return (
    <BillProvider>
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Bill Splitter</h1>
        
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />

        {activeTab === 'config' && <ConfigTab />}
        {activeTab === 'split' && <SplitTab />}
        {activeTab === 'dues' && <DuesTab />}
      </div>
    </BillProvider>
  )
}

export default App
