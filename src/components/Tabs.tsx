interface TabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  tabs: { id: string; label: string }[]
}

export function Tabs({ activeTab, onTabChange, tabs }: TabsProps) {
  return (
    <div className="flex gap-2 mb-6 border-b border-gray-300">
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-3 font-semibold transition-all cursor-pointer ${
            activeTab === tab.id
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-gray-600 hover:text-gray-800'
          } ${index === tabs.length - 1 ? 'ml-auto' : ''}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
