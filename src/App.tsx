import { useState } from 'react'
import { BillProvider } from './context/BillContext'
import { ThemeProvider } from './context/ThemeContext'
import { Tabs } from './components/Tabs'
import { ConfigTab } from './tabs/config/ConfigTab'
import { SplitTab } from './tabs/split/SplitTab'
import { DuesTab } from './tabs/dues/DuesTab'

function App() {
  const [activeTab, setActiveTab] = useState<string>('config')

  const tabs = [
    { id: 'config', label: 'Config' },
    { id: 'split', label: 'Split' },
    { id: 'dues', label: 'Dues' }
  ]

  return (
    <ThemeProvider>
      <BillProvider>
        <div className="max-w-7xl mx-auto p-8 min-h-screen transition-colors">
          <h1 className="text-4xl font-bold text-center mb-8">Bill Splitter</h1>
          
          <Tabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />

          {activeTab === 'config' && <ConfigTab />}
          {activeTab === 'split' && <SplitTab />}
          {activeTab === 'dues' && <DuesTab />}
        </div>
      </BillProvider>
    </ThemeProvider>
  )
}

export default App
