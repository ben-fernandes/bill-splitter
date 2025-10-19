interface ButtonProps {
  onClick: () => void
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  className?: string
}

export function Button({ onClick, children, variant = 'primary', className = '' }: ButtonProps) {
  const baseClasses = 'font-semibold rounded-md transition-all cursor-pointer'
  
  const variantClasses = {
    primary: 'px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 hover:shadow-lg',
    secondary: 'px-4 py-2 bg-white/20 hover:bg-white/30 text-white hover:scale-105 hover:shadow-lg'
  }
  
  return (
    <button 
      onClick={onClick} 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
