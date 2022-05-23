const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion } = require("mongodb");

const connectDB = async () => {
  try {
    // monodb connection string
    const con = await mongoose.connect(
      process.env.MONGO_URI,
      {
        // These are for removing unwanted errors
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      6000000
    );
    console.log(`MongoDB connected:${con.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
