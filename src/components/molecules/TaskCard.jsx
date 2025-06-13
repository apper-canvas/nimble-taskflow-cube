import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, parseISO, isToday, isPast } from 'date-fns'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Checkbox from '@/components/atoms/Checkbox'
import Badge from '@/components/atoms/Badge'
import { taskService } from '@/services'

const TaskCard = ({ task, onUpdate, onEdit }) => {
  const [isCompleting, setIsCompleting] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const priorityColors = {
    High: '#EF4444',
    Medium: '#F59E0B', 
    Low: '#10B981'
  }

  const priorityIcons = {
    High: 'AlertCircle',
    Medium: 'Clock',
    Low: 'CheckCircle2'
  }

  const handleToggleComplete = async () => {
    if (isCompleting) return
    
    setIsCompleting(true)
    
    try {
      const updatedTask = await taskService.update(task.id, {
        completed: !task.completed
      })
      
      if (!task.completed) {
        // Task is being completed
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 600)
        toast.success("Task completed! Great job! 🎉")
      } else {
        toast.info("Task marked as incomplete")
      }
      
      onUpdate(updatedTask)
    } catch (error) {
      toast.error("Failed to update task")
    } finally {
      setIsCompleting(false)
    }
  }

  const formatDueDate = (dateString) => {
    if (!dateString) return null
    
    try {
      const date = parseISO(dateString)
      if (isToday(date)) return 'Today'
      if (isPast(date)) return `Overdue - ${format(date, 'MMM d')}`
      return format(date, 'MMM d')
    } catch {
      return dateString
    }
  }

  const getDueDateColor = (dateString) => {
    if (!dateString) return 'text-gray-500'
    
    try {
      const date = parseISO(dateString)
      if (isPast(date) && !isToday(date)) return 'text-error'
      if (isToday(date)) return 'text-accent'
      return 'text-gray-600'
    } catch {
      return 'text-gray-500'
    }
  }

  const createConfettiParticles = () => {
    return Array.from({ length: 12 }, (_, i) => (
      <motion.div
        key={i}
        className="confetti-particle"
        initial={{
          opacity: 0,
          scale: 0,
          x: 0,
          y: 0,
          rotate: 0
        }}
        animate={{
          opacity: [0, 1, 0],
          scale: [0, 1, 0],
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          rotate: Math.random() * 360
        }}
        transition={{
          duration: 0.6,
          delay: i * 0.05,
          ease: "easeOut"
        }}
        style={{
          left: '50%',
          top: '50%'
        }}
      />
    ))
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: task.completed ? 0.7 : 1, 
        y: 0,
        x: task.completed && isCompleting ? 20 : 0 
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 8px 25px rgba(0,0,0,0.1)"
      }}
      className={`
        bg-white rounded-xl p-6 shadow-sm border border-gray-100
        cursor-pointer transition-all duration-200 relative overflow-hidden
        ${task.completed ? 'bg-gray-50' : ''}
      `}
      onClick={() => onEdit(task)}
    >
      {/* Confetti particles */}
      <AnimatePresence>
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {createConfettiParticles()}
          </div>
        )}
      </AnimatePresence>

      <div className="flex items-start gap-4">
        {/* Completion checkbox */}
        <div 
          className="flex-shrink-0 mt-0.5"
          onClick={(e) => {
            e.stopPropagation()
            handleToggleComplete()
          }}
        >
          <Checkbox
            checked={task.completed}
            onChange={() => {}} // Handled by onClick above
            disabled={isCompleting}
          />
        </div>

        {/* Task content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className={`
              font-display font-semibold text-lg leading-tight
              ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}
            `}>
              {task.title}
            </h3>
            
            {/* Priority indicator */}
            <motion.div
              animate={task.priority === 'High' ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex-shrink-0"
            >
              <div 
                className="w-3 h-3 rounded-full animate-pulse-dot"
                style={{ backgroundColor: priorityColors[task.priority] }}
              />
            </motion.div>
          </div>

          {task.description && (
            <p className={`
              text-sm mb-3 break-words
              ${task.completed ? 'text-gray-400' : 'text-gray-600'}
            `}>
              {task.description}
            </p>
          )}

          {/* Task metadata */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Category badge */}
              <Badge 
                variant="default"
                size="small"
                className="bg-surface text-gray-700"
              >
                {task.category}
              </Badge>
              
              {/* Priority badge */}
              <Badge 
                size="small"
                color={priorityColors[task.priority]}
                className="flex items-center gap-1"
              >
                <ApperIcon name={priorityIcons[task.priority]} size={12} />
                {task.priority}
              </Badge>
            </div>

            {/* Due date */}
            {task.dueDate && (
              <div className={`
                flex items-center gap-1 text-xs font-medium
                ${getDueDateColor(task.dueDate)}
              `}>
                <ApperIcon name="Calendar" size={12} />
                {formatDueDate(task.dueDate)}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TaskCard