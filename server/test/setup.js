const { MongoMemoryServer } = require("mongodb-memory-server");

let mongod;

module.exports = async function () {
  try {
    mongod = await MongoMemoryServer.create();
    const mongoUri = await mongod.getUri();
    process.env.MONGODB_URI = mongoUri;
    console.log("Test MongoDB server started at", mongoUri);
  } catch (err) {
    console.error("Error starting MongoDB server:", err);
  }
};