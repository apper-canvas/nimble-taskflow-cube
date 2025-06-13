const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class CategoryService {
  constructor() {
    // Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'category';
  }

  async getAll() {
    try {
      const params = {
        Fields: ['Id', 'Name', 'color', 'task_count']
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Map database fields to UI format
      return response.data?.map(category => ({
        id: category.Id?.toString(),
        name: category.Name || '',
        color: category.color || '#6B7280',
        taskCount: category.task_count || 0
      })) || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: ['Id', 'Name', 'color', 'task_count']
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      const category = response.data;
      if (!category) return null;
      
      // Map database fields to UI format
      return {
        id: category.Id?.toString(),
        name: category.Name || '',
        color: category.color || '#6B7280',
        taskCount: category.task_count || 0
      };
    } catch (error) {
      console.error(`Error fetching category with ID ${id}:`, error);
      return null;
    }
  }

  async create(categoryData) {
    try {
      // Map UI data to database fields - only include Updateable fields
      const dbCategoryData = {
        Name: categoryData.name,
        color: categoryData.color || '#6B7280',
        task_count: 0
      };
      
      const params = {
        records: [dbCategoryData]
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
          throw new Error(failedRecords[0].message || 'Failed to create category');
        }
        
        if (successfulRecords.length > 0) {
          const createdCategory = successfulRecords[0].data;
          // Map database response back to UI format
          return {
            id: createdCategory.Id?.toString(),
            name: createdCategory.Name || categoryData.name,
            color: createdCategory.color || categoryData.color,
            taskCount: createdCategory.task_count || 0
          };
        }
      }
      
      throw new Error('No data returned from create operation');
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      // Map UI updates to database fields - only include Updateable fields
      const dbUpdates = {
        Id: parseInt(id)
      };
      
      if (updates.name !== undefined) dbUpdates.Name = updates.name;
      if (updates.color !== undefined) dbUpdates.color = updates.color;
      if (updates.taskCount !== undefined) dbUpdates.task_count = updates.taskCount;
      
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
          throw new Error(failedUpdates[0].message || 'Failed to update category');
        }
        
        if (successfulUpdates.length > 0) {
          const updatedCategory = successfulUpdates[0].data;
          // Map database response back to UI format
          return {
            id: updatedCategory.Id?.toString(),
            name: updatedCategory.Name || '',
            color: updatedCategory.color || '#6B7280',
            taskCount: updatedCategory.task_count || 0
          };
        }
      }
      
      throw new Error('No data returned from update operation');
    } catch (error) {
      console.error("Error updating category:", error);
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
          throw new Error(failedDeletions[0].message || 'Failed to delete category');
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  }

  async updateTaskCount(categoryName, count) {
    try {
      // Find category by name first
      const allCategoriesResponse = await this.getAll();
      const category = allCategoriesResponse.find(c => c.name === categoryName);
      
      if (!category) {
        throw new Error('Category not found');
      }
      
      return await this.update(category.id, { taskCount: count });
    } catch (error) {
      console.error("Error updating task count:", error);
      throw error;
    }
  }
}

export default new CategoryService()