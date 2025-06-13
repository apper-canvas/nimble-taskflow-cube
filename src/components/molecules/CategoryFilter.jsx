import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const CategoryFilter = ({ 
  categories = [], 
  selectedCategory, 
  onCategoryChange,
  className = ''
}) => {
  const allCategoriesOption = {
    id: 'all',
    name: 'All Tasks',
    color: '#6B7280',
    taskCount: categories.reduce((sum, cat) => sum + cat.taskCount, 0)
  }

  const categoryOptions = [allCategoriesOption, ...categories]

  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="font-display font-semibold text-gray-900 text-sm uppercase tracking-wide mb-4">
        Categories
      </h3>
      
      <div className="space-y-1">
        {categoryOptions.map((category) => {
          const isSelected = selectedCategory === category.name || 
                           (selectedCategory === null && category.id === 'all')
          
          return (
            <motion.button
              key={category.id}
              onClick={() => onCategoryChange(category.id === 'all' ? null : category.name)}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`
                w-full flex items-center justify-between px-3 py-2.5 rounded-lg
                text-left transition-all duration-150 group
                ${isSelected 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div 
                  className={`w-3 h-3 rounded-full flex-shrink-0 ${
                    isSelected ? 'bg-white/80' : ''
                  }`}
                  style={{ 
                    backgroundColor: isSelected ? 'rgba(255,255,255,0.8)' : category.color 
                  }}
                />
                <span className="font-medium truncate">
                  {category.name}
                </span>
              </div>
              
              {category.taskCount > 0 && (
                <motion.span
                  key={category.taskCount}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className={`
                    px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0
                    ${isSelected 
                      ? 'bg-white/20 text-white' 
                      : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
                    }
                  `}
                >
                  {category.taskCount}
                </motion.span>
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

export default CategoryFilter