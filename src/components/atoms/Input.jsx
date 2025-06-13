import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '../ApperIcon'

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const [focused, setFocused] = useState(false)
  
  const hasValue = value && value.length > 0
  const showFloatingLabel = focused || hasValue

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <ApperIcon name={icon} size={16} />
          </div>
        )}
        
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          required={required}
          placeholder={focused ? placeholder : ''}
          className={`
            w-full px-3 py-3 border-2 rounded-lg transition-all duration-200
            ${icon ? 'pl-10' : ''}
            ${error 
              ? 'border-error focus:border-error focus:ring-error/20' 
              : focused 
                ? 'border-primary focus:border-primary focus:ring-primary/20'
                : 'border-gray-200 hover:border-gray-300'
            }
            focus:outline-none focus:ring-4
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${showFloatingLabel ? 'pt-6 pb-2' : ''}
          `}
          {...props}
        />

        {label && (
          <motion.label
            initial={false}
            animate={showFloatingLabel ? {
              y: -10,
              scale: 0.75,
              color: focused ? '#5B21B6' : '#6B7280'
            } : {
              y: 0,
              scale: 1,
              color: '#9CA3AF'
            }}
            className={`
              absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none
              origin-left transition-all duration-200 font-medium
              ${icon ? 'left-10' : 'left-3'}
            `}
          >
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </motion.label>
        )}
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-error flex items-center gap-1"
        >
          <ApperIcon name="AlertCircle" size={14} />
          {error}
        </motion.p>
      )}
    </div>
  )
}

export default Input