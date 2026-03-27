const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Admin = require('../src/models/Admin');

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

async function seedAdmins() {
  try {
    const mongodbUri = process.env.MONGODB_URI;
    
    if (!mongodbUri) {
      console.error('Error: MONGODB_URI is not defined in .env');
      console.log('Please create a .env file in the billing-backend directory with MONGODB_URI=your_mongodb_connection_string');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongodbUri);
    console.log('Connected successfully.');

    // Check if admins already exist
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      console.log('Admin accounts already exist in the database. Skipping seeding.');
      process.exit(0);
    }

    console.log('No admins found. Seeding initial accounts...');

    const admins = [
      {
        username: 'superadmin',
        password: 'password123',
        name: 'Super Admin',
        role: 'super_admin',
      },
      {
        username: 'readonly',
        password: 'password123',
        name: 'Read Only Admin',
        role: 'read_only',
      },
    ];

    // Using Admin.create will trigger the pre-save hook for password hashing
    await Admin.create(admins);

    console.log('-----------------------------------------------');
    console.log('Initial admins seeded successfully!');
    console.log('User 1: superadmin / password123 (Super Admin)');
    console.log('User 2: readonly / password123 (Read Only)');
    console.log('-----------------------------------------------');
    
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err.message);
    process.exit(1);
  }
}

seedAdmins();
