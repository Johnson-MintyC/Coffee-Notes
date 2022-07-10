const express = require("express");

const coffeelogRouter = express.Router();

const Coffeelog = require("../models/coffeelog");

//////////////////////////////////////////
//      Test Routes
//////////////////////////////////////////
//Index Route
coffeelogRouter.get("/", (req, res) => {
  res.send("Test Connection");
});

//new Form
coffeelogRouter.get("/new", (req, res) => {
  res.send("New Form");
});

//post the Form
coffeelogRouter.post("/", (req, res) => {
  console.log(req.body);
});

//Show Route

///////////////////////////////////////////
//  Export Routes to Server
///////////////////////////////////////////

module.exports = coffeelogRouter;
