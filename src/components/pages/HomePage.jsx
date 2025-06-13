import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Header from '@/components/organisms/Header'
import Sidebar from '@/components/organisms/Sidebar'
import TaskList from '@/components/organisms/TaskList'
import TaskModal from '@/components/organisms/TaskModal'
import { taskService, categoryService } from '@/services'

const HomePage = () => {
  const [tasks, setTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // UI state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  // Load initial data
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    
    try {
const [tasksData, categoriesData] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ])
      
      setTasks(tasksData)
      setCategories(categoriesData)
      updateCategoryTaskCounts(tasksData, categoriesData)
    } catch (err) {
      setError(err.message || 'Failed to load data')
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const updateCategoryTaskCounts = (tasksData, categoriesData) => {
    const updatedCategories = categoriesData.map(category => ({
      ...category,
      taskCount: tasksData.filter(task => 
        task.category === category.name && !task.completed
      ).length
    }))
    setCategories(updatedCategories)
  }

  // Filter tasks based on search and category
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = !searchQuery || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = !selectedCategory || task.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  // Calculate completion stats
  const completedTasks = tasks.filter(task => task.completed).length
  const totalTasks = tasks.length

  // Event handlers
  const handleAddTask = () => {
    setEditingTask(null)
    setIsTaskModalOpen(true)
  }

  const handleEditTask = (task) => {
    setEditingTask(task)
    setIsTaskModalOpen(true)
savedTask = await taskService.update(task.id, formData)

  const handleTaskSave = (savedTask, action = 'save') => {
    if (action === 'delete') {
      setTasks(prevTasks => {
        const newTasks = prevTasks.filter(t => t.id !== editingTask.id)
        updateCategoryTaskCounts(newTasks, categories)
        return newTasks
      })
    } else if (editingTask) {
      // Update existing task
      setTasks(prevTasks => {
        const newTasks = prevTasks.map(t => 
          t.id === savedTask.id ? savedTask : t
        )
        updateCategoryTaskCounts(newTasks, categories)
        return newTasks
      })
    } else {
      // Add new task
      setTasks(prevTasks => {
        const newTasks = [...prevTasks, savedTask]
        updateCategoryTaskCounts(newTasks, categories)
        return newTasks
await taskService.delete(task.id)
    }
  }

  const handleTaskUpdate = (updatedTask) => {
    setTasks(prevTasks => {
      const newTasks = prevTasks.map(t => 
        t.id === updatedTask.id ? updatedTask : t
      )
      updateCategoryTaskCounts(newTasks, categories)
      return newTasks
    })
  }

  const handleTaskReorder = async (reorderedTasks) => {
    setTasks(reorderedTasks)
    
    try {
await taskService.reorder(reorderedTasks)
    } catch (error) {
      toast.error('Failed to save task order')
      // Reload to get correct order
      loadData()
    }
  }

  const handleCategoryChange = (categoryName) => {
    setSelectedCategory(categoryName)
  }

  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query)
  }, [])

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onAddTask={handleAddTask}
        completedTasks={completedTasks}
        totalTasks={totalTasks}
      />

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        {/* Task list */}
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <TaskList
              tasks={filteredTasks}
              onTaskUpdate={handleTaskUpdate}
              onTaskEdit={handleEditTask}
              onTaskReorder={handleTaskReorder}
              loading={loading}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
            />
          </motion.div>
        </main>
      </div>

      {/* Task modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={editingTask}
        onSave={handleTaskSave}
        categories={categories}
      />
    </div>
  )
}

export default HomePage