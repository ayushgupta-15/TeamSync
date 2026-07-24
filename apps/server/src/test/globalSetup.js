const { MongoMemoryServer } = require("mongodb-memory-server");

module.exports = async function globalSetup() {
  const instance = await MongoMemoryServer.create();
  global.__MONGOD__ = instance;
  process.env.__MONGO_URI__ = instance.getUri();
};
