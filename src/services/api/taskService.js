import tasksData from '../mockData/tasks.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class TaskService {
  constructor() {
    this.tasks = [...tasksData]
  }

  async getAll() {
    await delay(200)
    return [...this.tasks].sort((a, b) => a.order - b.order)
  }

  async getById(id) {
    await delay(200)
    const task = this.tasks.find(t => t.id === id)
    return task ? { ...task } : null
  }

  async create(taskData) {
    await delay(300)
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
      order: this.tasks.length
    }
    this.tasks.push(newTask)
    return { ...newTask }
  }

  async update(id, updates) {
    await delay(300)
    const index = this.tasks.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Task not found')
    
    this.tasks[index] = { ...this.tasks[index], ...updates }
    return { ...this.tasks[index] }
  }

  async delete(id) {
    await delay(250)
    const index = this.tasks.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Task not found')
    
    this.tasks.splice(index, 1)
    return true
  }

  async reorder(tasks) {
    await delay(200)
    this.tasks = tasks.map((task, index) => ({
      ...task,
      order: index
    }))
    return [...this.tasks]
  }

  async getByCategory(category) {
    await delay(200)
    return this.tasks
      .filter(t => t.category === category)
      .sort((a, b) => a.order - b.order)
      .map(t => ({ ...t }))
  }

  async searchTasks(query) {
    await delay(200)
    const lowerQuery = query.toLowerCase()
    return this.tasks
      .filter(t => 
        t.title.toLowerCase().includes(lowerQuery) ||
        t.description.toLowerCase().includes(lowerQuery)
      )
      .sort((a, b) => a.order - b.order)
      .map(t => ({ ...t }))
  }
}

export default new TaskService()