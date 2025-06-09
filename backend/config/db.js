const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,        // Use new URL parser (avoids deprecation warnings)
      useUnifiedTopology: true,     // Use new server discovery and monitoring engine
    });
    console.log('MongoDB connected successfully');

    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected! Attempting to reconnect...');
      // Optionally, handle reconnect logic here or rely on mongoose built-in
    });

    // Graceful shutdown on app termination
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;



// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log('MongoDB connected successfully');
//   } catch (err) {
//     console.error('MongoDB connection error:', err);
//     process.exit(1); // Exit the process with a failure code
//   }
// };

// module.exports = connectDB;
