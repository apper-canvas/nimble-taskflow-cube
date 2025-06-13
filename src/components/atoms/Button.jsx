import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  variant = 'primary', 
  size = 'medium', 
  icon, 
  children, 
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2"
  
  const variants = {
    primary: "bg-primary text-white hover:brightness-110 focus:ring-primary/50 disabled:bg-gray-300",
    secondary: "bg-secondary text-white hover:brightness-110 focus:ring-secondary/50 disabled:bg-gray-300",
    accent: "bg-accent text-white hover:brightness-110 focus:ring-accent/50 disabled:bg-gray-300",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/50 disabled:border-gray-300 disabled:text-gray-300",
    ghost: "text-gray-600 hover:bg-gray-100 focus:ring-gray/50 disabled:text-gray-300"
  }
  
  const sizes = {
    small: "px-3 py-1.5 text-sm gap-1.5",
    medium: "px-4 py-2 text-base gap-2",
    large: "px-6 py-3 text-lg gap-2.5"
  }

  const iconSizes = {
    small: 14,
    medium: 16,
    large: 18
  }

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      {...props}
    >
      {icon && (
        <ApperIcon 
          name={icon} 
          size={iconSizes[size]} 
          className={children ? "" : ""} 
        />
      )}
      {children}
    </motion.button>
  )
}

export default Button