const mongoose = require("mongoose");
const Coffeelog = require("../models/coffeelog");

const dummyCoffeelogs = require("./data-logs");

const dbURL = "mongodb://127.0.0.1:27017/coffeenotes";

mongoose.connect(dbURL, () => {
  console.log("Connected to coffeenotes db");
  Coffeelog.insertMany(dummyCoffeelogs).then(() => {
    console.log("Dummy Data inserted");
    mongoose.connection.close();
  });
});
