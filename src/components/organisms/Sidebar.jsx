import { motion } from 'framer-motion'
import CategoryFilter from '@/components/molecules/CategoryFilter'

const Sidebar = ({
  categories = [],
  selectedCategory,
  onCategoryChange,
  className = ''
}) => {
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`
        w-64 bg-surface border-r border-gray-200 overflow-y-auto
        flex-shrink-0 ${className}
      `}
    >
      <div className="p-6">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
        />
        
        {/* Quick stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 p-4 bg-white rounded-lg border border-gray-100"
        >
          <h4 className="font-display font-medium text-gray-900 mb-3">
            Quick Stats
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Categories</span>
              <span className="font-medium">{categories.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active Tasks</span>
              <span className="font-medium">
                {categories.reduce((sum, cat) => sum + cat.taskCount, 0)}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.aside>
  )
}

export default Sidebar