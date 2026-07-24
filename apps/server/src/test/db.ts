import mongoose from "mongoose";

export const connectTestDb = async () => {
  await mongoose.connect(process.env.__MONGO_URI__ as string);
};

export const disconnectTestDb = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

export const clearTestDb = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};
