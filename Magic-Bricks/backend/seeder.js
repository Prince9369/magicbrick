const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const Property = require('./models/Property');
const User = require('./models/User');
const propertyData = require('./data/propertyData.json');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

// Import data
const importData = async () => {
  try {
    // First, we need at least one user to assign as the owner of properties
    // Check if we have any users
    const userCount = await User.countDocuments();

    if (userCount === 0) {
      console.log('No users found in the database. Please create at least one user first.'.red);
      process.exit(1);
    }

    // Get the first user to assign as owner
    const user = await User.findOne();

    // Prepare property data with the user as owner
    const preparedProperties = propertyData.map(property => ({
      ...property,
      owner: user._id
    }));

    // Delete existing properties
    await Property.deleteMany();

    // Import new properties
    await Property.insertMany(preparedProperties);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(`${err}`.red.inverse);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Property.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(`${err}`.red.inverse);
    process.exit(1);
  }
};

// Determine which function to run based on command line args
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please use -i to import data or -d to delete data'.yellow);
  process.exit();
}
