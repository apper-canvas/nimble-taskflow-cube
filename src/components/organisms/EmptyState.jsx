import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const EmptyState = ({
  title = "Nothing here yet",
  description = "Get started by adding your first item",
  actionLabel = "Get Started",
  onAction,
  icon = "Plus",
  className = ''
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`text-center py-16 px-6 ${className}`}
    >
      {/* Animated icon */}
      <motion.div
        animate={{ 
          y: [0, -8, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6"
      >
        <ApperIcon 
          name={icon} 
          size={32} 
          className="text-gray-400" 
        />
      </motion.div>

      {/* Content */}
      <div className="max-w-sm mx-auto">
        <h3 className="font-display font-semibold text-xl text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-gray-500 mb-8 leading-relaxed">
          {description}
        </p>

        {/* Action button */}
        {onAction && actionLabel && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="primary"
              icon={icon}
              onClick={onAction}
              size="large"
            >
              {actionLabel}
            </Button>
          </motion.div>
        )}
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gray-200 rounded-full"
            animate={{
              x: [0, Math.random() * 40 - 20],
              y: [0, Math.random() * 40 - 20],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5
            }}
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default EmptyState