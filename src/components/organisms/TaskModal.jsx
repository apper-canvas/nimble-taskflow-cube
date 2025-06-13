import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import { taskService, categoryService } from '@/services'

const TaskModal = ({ 
  isOpen, 
  onClose, 
  task = null, 
  onSave, 
  categories = []
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Work',
    priority: 'Medium',
    dueDate: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const isEditing = Boolean(task)

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        category: task.category || 'Work',
        priority: task.priority || 'Medium',
        dueDate: task.dueDate || ''
      })
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'Work',
        priority: 'Medium',
        dueDate: ''
      })
    }
    setErrors({})
  }, [task, isOpen])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    
    try {
      let savedTask
      
      if (isEditing) {
        savedTask = await taskService.update(task.id, formData)
        toast.success('Task updated successfully!')
      } else {
        savedTask = await taskService.create(formData)
        toast.success('Task created successfully!')
      }
      
      onSave(savedTask)
      onClose()
    } catch (error) {
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} task`)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!isEditing) return
    
    if (!window.confirm('Are you sure you want to delete this task?')) return

    setLoading(true)
    
    try {
      await taskService.delete(task.id)
      toast.success('Task deleted successfully!')
      onSave(null, 'delete')
      onClose()
    } catch (error) {
      toast.error('Failed to delete task')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="font-display font-semibold text-xl text-gray-900">
              {isEditing ? 'Edit Task' : 'Create New Task'}
            </h2>
            <Button
              variant="ghost"
              size="medium"
              icon="X"
              onClick={onClose}
              className="!p-1 hover:bg-gray-100"
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
            {/* Title */}
            <Input
              label="Task Title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              error={errors.title}
              placeholder="Enter task title..."
              required
            />

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Add task description..."
                rows={3}
                className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-4 focus:ring-primary/20 focus:outline-none transition-all duration-200 resize-none"
              />
            </div>

            {/* Category and Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-4 focus:ring-primary/20 focus:outline-none transition-all duration-200"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', e.target.value)}
                  className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-4 focus:ring-primary/20 focus:outline-none transition-all duration-200"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            {/* Due Date */}
            <Input
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              icon="Calendar"
            />
          </form>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-100 bg-gray-50">
            <div>
              {isEditing && (
                <Button
                  variant="ghost"
                  icon="Trash2"
                  onClick={handleDelete}
                  disabled={loading}
                  className="text-error hover:bg-error/10"
                >
                  Delete
                </Button>
              )}
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                icon={isEditing ? "Save" : "Plus"}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Saving...' : isEditing ? 'Update Task' : 'Create Task'}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default TaskModal