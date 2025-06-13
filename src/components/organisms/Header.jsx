import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'
import ProgressRing from '@/components/molecules/ProgressRing'

const Header = ({ 
  searchQuery, 
  onSearchChange, 
  onAddTask,
  completedTasks = 0,
  totalTasks = 0
}) => {
  const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex-shrink-0 bg-white border-b border-gray-100 px-6 py-4"
    >
      <div className="flex items-center justify-between gap-6">
        {/* Left section - Logo and title */}
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ rotate: 10 }}
            className="flex items-center justify-center w-10 h-10 bg-primary rounded-xl"
          >
            <ApperIcon name="CheckSquare" size={20} className="text-white" />
          </motion.div>
          
          <div>
            <h1 className="font-display font-bold text-2xl text-gray-900">
              TaskFlow
            </h1>
            <p className="text-sm text-gray-500">
              Organize and complete daily tasks efficiently
            </p>
          </div>
        </div>

        {/* Center section - Search */}
        <div className="flex-1 max-w-md">
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search your tasks..."
          />
        </div>

        {/* Right section - Progress and add button */}
        <div className="flex items-center gap-4">
          {/* Daily progress */}
          <div className="flex items-center gap-3">
            <ProgressRing
              progress={completionPercentage}
              completed={completedTasks}
              total={totalTasks}
              size={50}
              strokeWidth={3}
            />
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                Today's Progress
              </p>
              <p className="text-xs text-gray-500">
                {completedTasks} of {totalTasks} completed
              </p>
            </div>
          </div>

          {/* Add task button */}
          <Button
            variant="primary"
            icon="Plus"
            onClick={onAddTask}
            className="flex-shrink-0"
          >
            Add Task
          </Button>
        </div>
      </div>
    </motion.header>
  )
}

export default Header