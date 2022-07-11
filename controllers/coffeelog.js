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
  res.render("coffeelogs/new.ejs", {});
});

//post the Form
coffeelogRouter.post("/", (req, res) => {
  Coffeelog.create({
    roasters: req.body.roasters,
    blend: req.body.blend,
    method: req.body.method,
    rating: req.body.rating,
    grindsize: req.body.grindsize,
    beanorigin: req.body.beanorigin,
    roastlevel: req.body.roastlevel,
    coffeedose: req.body.coffeedose,
    watervolume: req.body.watervolume,
    watertemp: req.body.watertemp,
    flavors: req.body.flavornotes.split("#"),
    comments: [req.body.comments],
    img: [req.body.img],
  });
  res.redirect("/");
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

//Delete Route
coffeelogRouter.delete("/:id", (req, res) => {
  Coffeelog.findByIdAndDelete(req.params.id)
    .exec()
    .then(() => {
      res.redirect("/");
    });
});

///////////////////////////////////////////
//  Export Routes to Server
///////////////////////////////////////////

module.exports = coffeelogRouter;
