import { motion } from 'framer-motion'
import ApperIcon from '../ApperIcon'

const Checkbox = ({ 
  checked = false, 
  onChange, 
  disabled = false,
  size = 'medium',
  className = '',
  ...props 
}) => {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  }

  const iconSizes = {
    small: 12,
    medium: 14,
    large: 16
  }

  return (
    <motion.button
      type="button"
      onClick={() => !disabled && onChange && onChange(!checked)}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.1 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      className={`
        ${sizes[size]}
        relative inline-flex items-center justify-center
        border-2 rounded-md transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary/50
        ${checked 
          ? 'bg-primary border-primary text-white' 
          : 'bg-white border-gray-300 hover:border-gray-400'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      <motion.div
        initial={false}
        animate={checked ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        <ApperIcon name="Check" size={iconSizes[size]} />
      </motion.div>
    </motion.button>
  )
}

export default Checkbox