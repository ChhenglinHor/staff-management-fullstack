const setup = require("./setup");

module.exports = async function () {
  try {
    await setup.mongod.stop();
    console.log("Test MongoDB server stopped");
  } catch (err) {
    console.error("Error stopping MongoDB server:", err);
  }
};