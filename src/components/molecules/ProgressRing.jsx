import { motion } from 'framer-motion'

const ProgressRing = ({ 
  progress = 0, 
  size = 60, 
  strokeWidth = 4,
  completed = 0,
  total = 0,
  className = ''
}) => {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#5B21B6"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          key={completed}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-sm font-bold text-primary"
        >
          {Math.round(progress)}%
        </motion.span>
        <span className="text-xs text-gray-500">
          {completed}/{total}
        </span>
      </div>
    </div>
  )
}

export default ProgressRing