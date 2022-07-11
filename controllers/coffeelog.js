const express = require("express");

const coffeelogRouter = express.Router();

const Coffeelog = require("../models/coffeelog");

//////////////////////////////////////////
//      Test Routes
//////////////////////////////////////////
//Index Route
coffeelogRouter.get("/", (req, res) => {
  Coffeelog.find()
    .exec()
    .then((coffeelogs) => {
      res.render("coffeelogs/index.ejs", {
        coffeelogs: coffeelogs,
      });
    });
});

//new Form
coffeelogRouter.get("/new", (req, res) => {
  res.send("New Form");
});

//post the Form
coffeelogRouter.post("/", (req, res) => {
  Coffeelog.create(req.body);
});

//Show Route
coffeelogRouter.get("/:id", (req, res) => {
  Coffeelog.findById(req.params.id)
    .exec()
    .then((coffeelog) => {
      res.render("coffeelogs/show.ejs", {
        coffeelog: coffeelog,
      });
    });
});

///////////////////////////////////////////
//  Export Routes to Server
///////////////////////////////////////////

module.exports = coffeelogRouter;
