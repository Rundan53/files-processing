const mongoose = require('mongoose');
const config = require('../config/config')

const connectDatabase = async () => {
  return mongoose
    .connect(config.mongoConnectionURI)
    .then(

      //need to add callback after successful connection


    )
    .catch((err) => {
      console.log("ERROR", err);
    });
}


mongoose.connection.on("connected", () => {
  console.info("Connected to MongoDB");
});

mongoose.connection.on("reconnected", () => {
  console.info("MongoDB reconnected");
});

mongoose.connection.on("error", (error) => {
  console.error(`Error in MongoDb connection: ${error}`);
  mongoose.disconnect();
});

mongoose.connection.on("disconnected", () => {
  console.error(`MongoDB disconnected!`);
});


module.exports = connectDatabase;