const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class TaskService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'task';
  }

  async getAll() {
    try {
      const params = {
        Fields: ['Id', 'Name', 'title', 'description', 'priority', 'due_date', 'completed', 'created_at', 'order', 'category'],
        orderBy: [
          {
            FieldName: "order",
            SortType: "ASC"
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Map database fields to UI format
      return response.data?.map(task => ({
        id: task.Id?.toString(),
        title: task.title || task.Name || '',
        description: task.description || '',
        category: task.category || 'Work',
        priority: task.priority || 'Medium',
        dueDate: task.due_date || '',
        completed: task.completed || false,
        createdAt: task.created_at || new Date().toISOString(),
        order: task.order || 0
      })) || [];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: ['Id', 'Name', 'title', 'description', 'priority', 'due_date', 'completed', 'created_at', 'order', 'category']
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      const task = response.data;
      if (!task) return null;
      
      // Map database fields to UI format
      return {
        id: task.Id?.toString(),
        title: task.title || task.Name || '',
        description: task.description || '',
        category: task.category || 'Work',
        priority: task.priority || 'Medium',
        dueDate: task.due_date || '',
        completed: task.completed || false,
        createdAt: task.created_at || new Date().toISOString(),
        order: task.order || 0
      };
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      return null;
    }
  }

  async create(taskData) {
    try {
      // Map UI data to database fields - only include Updateable fields
      const dbTaskData = {
        title: taskData.title,
        description: taskData.description || '',
        priority: taskData.priority || 'Medium',
        due_date: taskData.dueDate || null,
        completed: false,
        created_at: new Date().toISOString(),
        order: taskData.order || 0,
        category: parseInt(taskData.category) || null // Convert to integer for Lookup field
      };
      
      const params = {
        records: [dbTaskData]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create task');
        }
        
        if (successfulRecords.length > 0) {
          const createdTask = successfulRecords[0].data;
          // Map database response back to UI format
          return {
            id: createdTask.Id?.toString(),
            title: createdTask.title || taskData.title,
            description: createdTask.description || taskData.description,
            category: createdTask.category || taskData.category,
            priority: createdTask.priority || taskData.priority,
            dueDate: createdTask.due_date || taskData.dueDate,
            completed: createdTask.completed || false,
            createdAt: createdTask.created_at || new Date().toISOString(),
            order: createdTask.order || 0
          };
        }
      }
      
      throw new Error('No data returned from create operation');
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      // Map UI updates to database fields - only include Updateable fields
      const dbUpdates = {
        Id: parseInt(id)
      };
      
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
      if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate;
      if (updates.completed !== undefined) dbUpdates.completed = updates.completed;
      if (updates.order !== undefined) dbUpdates.order = updates.order;
      if (updates.category !== undefined) dbUpdates.category = parseInt(updates.category) || null;
      
      const params = {
        records: [dbUpdates]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error(failedUpdates[0].message || 'Failed to update task');
        }
        
        if (successfulUpdates.length > 0) {
          const updatedTask = successfulUpdates[0].data;
          // Map database response back to UI format
          return {
            id: updatedTask.Id?.toString(),
            title: updatedTask.title || '',
            description: updatedTask.description || '',
            category: updatedTask.category || 'Work',
            priority: updatedTask.priority || 'Medium',
            dueDate: updatedTask.due_date || '',
            completed: updatedTask.completed || false,
            createdAt: updatedTask.created_at || new Date().toISOString(),
            order: updatedTask.order || 0
          };
        }
      }
      
      throw new Error('No data returned from update operation');
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error(failedDeletions[0].message || 'Failed to delete task');
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }

  async reorder(tasks) {
    try {
      // Update order for all tasks
      const updates = tasks.map((task, index) => ({
        Id: parseInt(task.id),
        order: index
      }));
      
      const params = {
        records: updates
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Return updated tasks with new order
      return tasks.map((task, index) => ({
        ...task,
        order: index
      }));
    } catch (error) {
      console.error("Error reordering tasks:", error);
      throw error;
    }
  }

  async getByCategory(category) {
    try {
      const params = {
        Fields: ['Id', 'Name', 'title', 'description', 'priority', 'due_date', 'completed', 'created_at', 'order', 'category'],
        where: [
          {
            FieldName: "category",
            Operator: "ExactMatch",
            Values: [category]
          }
        ],
        orderBy: [
          {
            FieldName: "order",
            SortType: "ASC"
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data?.map(task => ({
        id: task.Id?.toString(),
        title: task.title || task.Name || '',
        description: task.description || '',
        category: task.category || 'Work',
        priority: task.priority || 'Medium',
        dueDate: task.due_date || '',
        completed: task.completed || false,
        createdAt: task.created_at || new Date().toISOString(),
        order: task.order || 0
      })) || [];
    } catch (error) {
      console.error("Error fetching tasks by category:", error);
      throw error;
    }
  }

  async searchTasks(query) {
    try {
      const params = {
        Fields: ['Id', 'Name', 'title', 'description', 'priority', 'due_date', 'completed', 'created_at', 'order', 'category'],
        whereGroups: [
          {
            operator: "OR",
            SubGroups: [
              {
                conditions: [
                  {
                    FieldName: "title",
                    Operator: "Contains",
                    Values: [query]
                  }
                ],
                operator: ""
              },
              {
                conditions: [
                  {
                    FieldName: "description",
                    Operator: "Contains",
                    Values: [query]
                  }
                ],
                operator: ""
              }
            ]
          }
        ],
        orderBy: [
          {
            FieldName: "order",
            SortType: "ASC"
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data?.map(task => ({
        id: task.Id?.toString(),
        title: task.title || task.Name || '',
        description: task.description || '',
        category: task.category || 'Work',
        priority: task.priority || 'Medium',
        dueDate: task.due_date || '',
        completed: task.completed || false,
        createdAt: task.created_at || new Date().toISOString(),
        order: task.order || 0
      })) || [];
    } catch (error) {
      console.error("Error searching tasks:", error);
      throw error;
    }
  }
}

export default new TaskService()