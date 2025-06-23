import mockUsers from '../mockData/users.json';

// Helper function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Keep track of the next ID to use
let nextId = Math.max(...mockUsers.map(user => user.Id)) + 1;

// In-memory storage for users (simulating database)
let users = [...mockUsers];

const userService = {
  // Get all users
  async getAll() {
    await delay(300);
    return [...users];
  },

  // Get user by ID
  async getById(id) {
    await delay(200);
    const user = users.find(u => u.Id === parseInt(id));
    return user ? { ...user } : null;
  },

  // Create new user
  async create(userData) {
    await delay(400);
    
    // Generate new ID and create user object
    const newUser = {
      Id: nextId++,
      Name: userData.Name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      role: userData.role || '',
      department: userData.department || '',
      status: userData.status || 'Active',
      joinDate: userData.joinDate || new Date().toISOString().split('T')[0],
      lastLogin: userData.lastLogin || new Date().toISOString()
    };

    users.push(newUser);
    return { ...newUser };
  },

  // Update user
  async update(id, userData) {
    await delay(350);
    
    const userIndex = users.findIndex(u => u.Id === parseInt(id));
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Update user with provided data
    const updatedUser = {
      ...users[userIndex],
      ...userData,
      Id: parseInt(id) // Ensure ID doesn't change
    };

    users[userIndex] = updatedUser;
    return { ...updatedUser };
  },

  // Delete user
  async delete(id) {
    await delay(250);
    
    const userIndex = users.findIndex(u => u.Id === parseInt(id));
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const deletedUser = users[userIndex];
    users.splice(userIndex, 1);
    return { ...deletedUser };
  },

  // Additional utility methods
  async getByEmail(email) {
    await delay(200);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return user ? { ...user } : null;
  },

  async getByDepartment(department) {
    await delay(300);
    return users.filter(u => u.department === department).map(u => ({ ...u }));
  },

  async getByStatus(status) {
    await delay(300);
    return users.filter(u => u.status === status).map(u => ({ ...u }));
  }
};

export default userService;