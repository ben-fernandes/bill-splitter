import { useTheme } from '../../context/ThemeContext'
import { Button } from '../../components/Button'
import { useState } from 'react'

export function SettingsTab() {
  const { mode, setMode } = useTheme()
  const [copied, setCopied] = useState(false)

  const handleCopyShareableURL = () => {
    try {
      // Simply copy the current URL which already has the data query param
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      alert('Error copying URL')
      console.error('Copy error:', error)
    }
  }

  return (
    <div className="p-6 rounded-lg shadow-lg flex flex-col gap-6">
      <h2 className="text-2xl font-bold">Settings</h2>
      
      {/* Theme - Level 3 */}
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold">Theme</h3>
        <div className="flex rounded-lg border overflow-hidden w-fit">
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
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold">Share</h3>
        <div className="flex gap-3">
          <Button onClick={handleCopyShareableURL}>
            {copied ? '✓ Copied!' : 'Copy Shareable URL'}
          </Button>
        </div>
        <p className="text-sm opacity-70">
          Share your bill by copying the URL. Anyone with the link can view and edit the bill.
        </p>
      </div>
    </div>
  )
}
