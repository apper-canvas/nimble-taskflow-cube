import { motion } from 'framer-motion'

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'medium',
  color,
  className = '',
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-full"
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    accent: "bg-accent/10 text-accent",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    error: "bg-error/10 text-error"
  }
  
  const sizes = {
    small: "px-2 py-0.5 text-xs",
    medium: "px-2.5 py-1 text-sm",
    large: "px-3 py-1.5 text-base"
  }

  const customStyle = color ? {
    backgroundColor: `${color}15`,
    color: color
  } : {}

  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={`
        ${baseClasses}
        ${color ? '' : variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      style={customStyle}
      {...props}
    >
      {children}
    </motion.span>
  )
}

export default Badge