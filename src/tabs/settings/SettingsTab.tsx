import { useTheme } from '../../context/ThemeContext'
import { Button } from '../../components/Button'
import { useBill } from '../../context/BillContext'
import { useState } from 'react'

export function SettingsTab() {
  const { mode, setMode } = useTheme()
  const { people, items, shares, serviceCharge } = useBill()
  const [copied, setCopied] = useState(false)

  const handleCopyShareableURL = () => {
    const data = {
      people,
      items,
      shares,
      serviceCharge
    }
    
    try {
      const json = JSON.stringify(data)
      const base64 = btoa(json)
      
      const url = new URL(window.location.href)
      url.searchParams.set('data', base64)
      
      navigator.clipboard.writeText(url.toString())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      alert('Error creating shareable URL')
      console.error('Share error:', error)
    }
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

      {/* Share Data - Level 3 */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Share</h3>
        <div className="flex gap-3">
          <Button onClick={handleCopyShareableURL}>
            {copied ? '✓ Copied!' : 'Copy Shareable URL'}
          </Button>
        </div>
        <p className="text-sm opacity-70 mt-2">
          Share your bill by copying the URL. Anyone with the link can view and edit the bill.
        </p>
      </div>
    </div>
  )
}
