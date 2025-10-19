import { useTheme } from '../../context/ThemeContext'
import { Button } from '../../components/Button'
import { useBill } from '../../context/BillContext'

export function SettingsTab() {
  const { mode, setMode } = useTheme()
  const { people, items, shares, serviceCharge, setPeople, setItems, setShares, setServiceCharge } = useBill()

  const handleExportData = () => {
    const data = {
      people,
      items,
      shares,
      serviceCharge,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bill-splitter-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        
        if (data.people) setPeople(data.people)
        if (data.items) setItems(data.items)
        if (data.shares) setShares(data.shares)
        if (data.serviceCharge !== undefined) setServiceCharge(data.serviceCharge)
        
        alert('Data imported successfully!')
      } catch (error) {
        alert('Error importing data. Please check the file format.')
        console.error('Import error:', error)
      }
    }
    reader.readAsText(file)
    
    // Reset the input so the same file can be imported again if needed
    event.target.value = ''
  }

  return (
    <div className="p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      
      {/* Theme - Level 3 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Theme</h3>
        <div className="inline-flex rounded-lg border overflow-hidden">
          <button
            onClick={() => setMode('light')}
            className={`px-4 py-2 font-semibold transition-colors ${
              mode === 'light'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                : 'hover:bg-black/5'
            }`}
          >
            Light
          </button>
          <button
            onClick={() => setMode('dark')}
            className={`px-4 py-2 font-semibold transition-colors border-l border-r ${
              mode === 'dark'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                : 'hover:bg-black/5'
            }`}
          >
            Dark
          </button>
          <button
            onClick={() => setMode('auto')}
            className={`px-4 py-2 font-semibold transition-colors ${
              mode === 'auto'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                : 'hover:bg-black/5'
            }`}
          >
            Auto
          </button>
        </div>
      </div>

      {/* Export/Import Data - Level 3 */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Backup & Restore</h3>
        <div className="flex gap-3">
          <Button onClick={handleExportData}>Export JSON</Button>
          <label className="px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md font-semibold hover:from-purple-700 hover:to-indigo-700 hover:shadow-lg transition-all cursor-pointer">
            Import JSON
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleImportData}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  )
}
