import mongoose from "mongoose";

async function connectDB() {
  if (!process.env.MONGODB_URL || !process.env.DB_NAME) {
    console.log(process.env.MONGODB_URL + process.env.DB_NAME);
    throw new Error(
      "Missing required environment variables for database connection"
    );
  }
  const mongoURL = `${process.env.MONGODB_URL}/${process.env.DB_NAME}`;
  console.log(mongoURL);
  
  try {
    await mongoose.connect(mongoURL);
    console.log("Connected to the database");
  } catch (error) {
    console.log("Error connecting to the database: ", error);
  }

  mongoose.connection.on("disconnected", () => {
    console.warn(" MongoDB disconnected");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("MongoDB reconnected");
  });

}

export { connectDB };
