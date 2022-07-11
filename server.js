/////////////////////////////////////////
//      Dependencies
/////////////////////////////////////////
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const coffeelogRouter = require("./controllers/coffeelog");

/////////////////////////////////////////
//      Instantiations/Variables
/////////////////////////////////////////
const PORT = process.env.PORT;
const dbURL = process.env.MONGODB_URL;

const app = express();
app.use(methodOverride("_method"));
app.use(express.static("public"));

/////////////////////////////////////////
//      Middleware
/////////////////////////////////////////
app.use(express.urlencoded({ extended: false }));

/////////////////////////////////////////
//      Routes
/////////////////////////////////////////

app.use("/", coffeelogRouter);

//////////////////////////////////////////
//      Connection Listeners
//////////////////////////////////////////

mongoose.connect(dbURL, () => {
  console.log("Connected to mongodb");
});

app.listen(PORT, () => {
  console.log("Server listening on port ", PORT);
});
