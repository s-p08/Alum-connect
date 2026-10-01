// scripts/migrateBranchData.js
const mongoose = require('mongoose');
const User = require('../models/users');
const dotenv = require('dotenv');

dotenv.config();

// Define mappings from old branch values to new standardized values
const branchMappings = {
  'Computer Science': { code: 'CSE', name: 'Computer Science' },
  'Computer Science Engineering': { code: 'CSE', name: 'Computer Science' },
  'Computer Science and Engineering': { code: 'CSE', name: 'Computer Science' },
  'CSE': { code: 'CSE', name: 'Computer Science' },
  
  'Artificial Intelligence': { code: 'AIML', name: 'Computer Science - AI/ML' },
  'Machine Learning': { code: 'AIML', name: 'Computer Science - AI/ML' },
  'AI & ML': { code: 'AIML', name: 'Computer Science - AI/ML' },
  'Computer Science - AI/ML': { code: 'AIML', name: 'Computer Science - AI/ML' },
  'CSA': { code: 'AIML', name: 'Computer Science - AI/ML' },
  'AIML': { code: 'AIML', name: 'Computer Science - AI/ML' },
  
  'Electronics and Communication Engineering': { code: 'ECE', name: 'Electronics and Communication Engineering' },
  'Electronics and Communication': { code: 'ECE', name: 'Electronics and Communication Engineering' },
  'ECE': { code: 'ECE', name: 'Electronics and Communication Engineering' },

  'Electrical and Computer Engineering': { code: 'ECO', name: 'Electrical and Computer Engineering' },
  'ECO': { code: 'ECO', name: 'Electrical and Computer Engineering' },

  'Mechanical Engineering': { code: 'ME', name: 'Mechanical Engineering' },
  'Mechanical': { code: 'ME', name: 'Mechanical Engineering' },
  'ME': { code: 'ME', name: 'Mechanical Engineering' },

  'Biotechnology': { code: 'BT', name: 'Biotechnology' },
  'BT': { code: 'BT', name: 'Biotechnology' }
};

// Fallback mapping function for branches not found in the direct mapping
const determineBranchMapping = (branchText) => {
  let result = { code: 'CSE', name: 'Computer Science' };
  const lowerBranch = branchText.toLowerCase();
  
  if (lowerBranch.includes('arti') || lowerBranch.includes('machine') || lowerBranch.includes('ai') || lowerBranch.includes('aiml') || lowerBranch.includes('csa')) {
    result = { code: 'AIML', name: 'Computer Science - AI/ML' };
  }
  else if (lowerBranch.includes('electron') || lowerBranch.includes('ece')) {
    result = { code: 'ECE', name: 'Electronics and Communication Engineering' };
  }
  else if (lowerBranch.includes('electr') || lowerBranch.includes('eco')) {
    result = { code: 'ECO', name: 'Electrical and Computer Engineering' };
  }
  else if (lowerBranch.includes('mech') || lowerBranch.includes('me')) {
    result = { code: 'ME', name: 'Mechanical Engineering' };
  }
  else if (lowerBranch.includes('bio') || lowerBranch.includes('bt')) {
    result = { code: 'BT', name: 'Biotechnology' };
  }
  
  return result;
};

const migrateBranchData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');
    
    const users = await User.find({});
    console.log(`Found ${users.length} users to update`);
    
    let updatedCount = 0;
    let unmappedCount = 0;
    
    for (const user of users) {
      const oldBranch = user.branch || '';
      
      // Try direct mapping first
      let mapping = branchMappings[oldBranch];
      
      // If no direct mapping, use fallback function
      if (!mapping) {
        mapping = determineBranchMapping(oldBranch);
        unmappedCount++;
        console.log(`No direct mapping for "${oldBranch}", using fallback: ${mapping.code} - ${mapping.name}`);
      }
      
      // Update user with standardized values
      user.branchCode = mapping.code;
      user.branch = mapping.name;
      await user.save();
      
      console.log(`Updated user ${user.email}: "${oldBranch}" => Code: ${mapping.code}, Name: ${mapping.name}`);
      updatedCount++;
    }
    
    console.log('\nMigration Summary:');
    console.log(`✅ Users updated: ${updatedCount}`);
    console.log(`⚠️ Users without direct mapping: ${unmappedCount}`);
    console.log(`📊 Total users processed: ${users.length}`);
    
    await mongoose.connection.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error migrating branch data:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

migrateBranchData();