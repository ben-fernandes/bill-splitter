interface InputProps {
  type?: 'text' | 'number'
  value: string | number
  onChange: (value: string) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  placeholder?: string
  min?: string
  max?: string
  step?: string
  variant?: 'default' | 'header'
  className?: string
}

export function Input({ 
  type = 'text', 
  value, 
  onChange,
  onKeyDown,
  placeholder, 
  min, 
  max, 
  step,
  variant = 'default',
  className = '' 
}: InputProps) {
  const baseClasses = 'px-3 py-2 border-2 rounded focus:outline-none'
  
  const variantClasses = {
    default: 'border-gray-300 focus:border-purple-500',
    header: 'w-full border-white/30 bg-white/20 text-white font-semibold text-center placeholder-white/70 focus:border-white/60 focus:bg-white/30'
  }
  
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    />
  )
}
