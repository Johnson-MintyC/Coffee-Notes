require("dotenv").config();

const mongoose = require("mongoose");
const Coffeelog = require("../models/coffeelog");

const dummyCoffeelogs = require("./data-logs");

const dbURL = process.env.MONGODB_URL;

//////////////////////////////////////////////
//          Starter Seed
//////////////////////////////////////////////
mongoose.connect(dbURL, () => {
  console.log("Connected to coffeenotes db");
  Coffeelog.insertMany(dummyCoffeelogs).then(() => {
    console.log("Dummy Data inserted");
    mongoose.connection.close();
  });
});
