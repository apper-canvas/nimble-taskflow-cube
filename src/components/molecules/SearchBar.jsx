import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const SearchBar = ({ 
  value = '', 
  onChange, 
  placeholder = "Search tasks...",
  debounceMs = 300,
  className = ''
}) => {
  const [localValue, setLocalValue] = useState(value)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onChange && localValue !== value) {
        onChange(localValue)
      }
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [localValue, onChange, value, debounceMs])

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleClear = () => {
    setLocalValue('')
    if (onChange) {
      onChange('')
    }
  }

  return (
    <motion.div 
      className={`relative ${className}`}
      whileFocusWithin={{ scale: 1.02 }}
    >
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
        <ApperIcon name="Search" size={16} />
      </div>
      
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={`
          w-full pl-10 pr-10 py-2.5 
          border-2 rounded-lg transition-all duration-200
          ${isFocused 
            ? 'border-primary focus:ring-primary/20' 
            : 'border-gray-200 hover:border-gray-300'
          }
          focus:outline-none focus:ring-4
          bg-white text-gray-900 placeholder-gray-500
        `}
      />

      {localValue && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <ApperIcon name="X" size={16} />
        </motion.button>
      )}
    </motion.div>
  )
}

export default SearchBar