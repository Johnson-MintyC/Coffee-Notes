/////////////////////////////////////////
//      Dependencies
/////////////////////////////////////////
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("express-flash");
const mongoDBSession = require("connect-mongodb-session");

const usersController = require("./controllers/users");
const coffeelogRouter = require("./controllers/coffeelog");
const sessionsController = require("./controllers/sessions");

/////////////////////////////////////////
//      Instantiations/Variables
/////////////////////////////////////////
const PORT = process.env.PORT;
const dbURL = process.env.MONGODB_URL;
const MongoDBStore = mongoDBSession(session);
const sessionStore = new MongoDBStore({
  uri: dbURL,
  collection: "sessions",
});

const app = express();

/////////////////////////////////////////
//      Middleware
/////////////////////////////////////////
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);
app.use(flash());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(express.static("public"));

/////////////////////////////////////////
//      Routes
/////////////////////////////////////////

app.use("/", sessionsController);
app.use("/", coffeelogRouter);
app.use("/users", usersController);

//////////////////////////////////////////
//      Connection Listeners
//////////////////////////////////////////

mongoose.connect(dbURL, () => {
  console.log("Connected to mongodb");
});

app.listen(PORT, () => {
  console.log("Server listening on port ", PORT);
});
