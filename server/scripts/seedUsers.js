const mongoose = require('mongoose');
const User = require('../models/users');
const dotenv = require('dotenv');

dotenv.config();

const users = [
  {
    name: 'Shivam Prakash',
    email: 'shivamprakash@kuk.ac.in',
    password: 'shivam',
    role: 'student',
    branch: 'Computer Science',
    branchCode: 'CSE',
    location: 'Kurukshetra',
    batch: '2022'
  },
  {
    name: 'Admin',
    email: 'admin@kuk.ac.in',
    password: 'admin', 
    role: 'admin',
    branch: 'Administration',
    branchCode: 'ADMIN'
  },
  {
    name: 'Prakash',
    email: 'prakash@kuk.ac.in',
    password: 'prakash',
    role: 'alumni',
    branch: 'Electronics and Communication Engineering',
    branchCode: 'ECE',
    batch: '2020'
  },
  {
    name: 'visitor',
    email: 'visitor@kuk.ac.in',
    password: 'visitor', 
    role: 'visitor'
  }
];

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');
    
    // Clear existing users first
    await User.deleteMany({});
    console.log('Cleared existing users.');
    
    // Process each user individually to trigger password hashing
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(`Added new user: ${userData.email} (${userData.name})`);
    }
    
    console.log('\nSeeding Summary:');
    console.log(`✅ Users updated: ${users.length}`);
    
    // Close the database connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

seedUsers();
