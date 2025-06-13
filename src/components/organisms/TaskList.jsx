import { motion, AnimatePresence } from 'framer-motion'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import TaskCard from '@/components/molecules/TaskCard'
import EmptyState from '@/components/organisms/EmptyState'

const TaskList = ({ 
  tasks = [], 
  onTaskUpdate, 
  onTaskEdit,
  onTaskReorder,
  loading = false,
  searchQuery = '',
  selectedCategory = null
}) => {
  const handleDragEnd = (result) => {
    if (!result.destination) return
    
    const items = Array.from(tasks)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    
    onTaskReorder(items)
  }

  if (loading) {
    return <LoadingSkeleton />
  }

  if (tasks.length === 0) {
    const isFiltered = searchQuery || selectedCategory
    return (
      <EmptyState
        title={isFiltered ? "No tasks found" : "No tasks yet"}
        description={
          isFiltered 
            ? "Try adjusting your search or filters"
            : "Create your first task to get started with TaskFlow"
        }
        actionLabel={isFiltered ? null : "Create First Task"}
        onAction={isFiltered ? null : () => onTaskEdit(null)}
        icon={isFiltered ? "Search" : "Plus"}
      />
    )
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="tasks">
        {(provided, snapshot) => (
          <motion.div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              space-y-4 transition-colors duration-200
              ${snapshot.isDraggingOver ? 'bg-primary/5 rounded-lg p-2' : ''}
            `}
          >
            <AnimatePresence mode="popLayout">
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => (
                    <motion.div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        scale: snapshot.isDragging ? 1.02 : 1,
                        rotate: snapshot.isDragging ? 2 : 0
                      }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ 
                        duration: 0.2,
                        delay: index * 0.05
                      }}
                      className={`
                        ${snapshot.isDragging ? 'z-50 shadow-2xl' : ''}
                      `}
                    >
                      <TaskCard
                        task={task}
                        onUpdate={onTaskUpdate}
                        onEdit={onTaskEdit}
                      />
                    </motion.div>
                  )}
                </Draggable>
              ))}
            </AnimatePresence>
            {provided.placeholder}
          </motion.div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="animate-pulse">
          <div className="flex items-start gap-4">
            <div className="w-5 h-5 bg-gray-200 rounded-md flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="flex gap-2">
                <div className="h-6 bg-gray-200 rounded-full w-16" />
                <div className="h-6 bg-gray-200 rounded-full w-12" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    ))}
  </div>
)

export default TaskList