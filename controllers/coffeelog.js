const express = require("express");

const coffeelogRouter = express.Router();

const upload = require("../middlewares/upload");
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
coffeelogRouter.post("/", upload.single("img"), (req, res) => {
  req.body.flavors = req.body.flavornotes.split("#").filter(Boolean);
  for (let i = 0; i < req.body.flavors.length; i++) {
    req.body.flavors[i] = req.body.flavors[i].trim();
  }
  req.body.img = req.file.path;
  Coffeelog.create(req.body);
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

//Edit Form Route
coffeelogRouter.get("/:id/edit", (req, res) => {
  Coffeelog.findById(req.params.id)
    .exec()
    .then((coffeelog) => {
      res.render("coffeelogs/edit.ejs", {
        coffeelog: coffeelog,
      });
    });
});

//Edit PUT Route
coffeelogRouter.put("/:id", (req, res) => {
  req.body.flavors = req.body.flavornotes.split("#").filter(Boolean);
  for (let i = 0; i < req.body.flavors.length; i++) {
    req.body.flavors[i] = req.body.flavors[i].trim();
  }
  Coffeelog.findByIdAndUpdate(req.params.id, req.body)
    .exec()
    .then(() => {
      res.redirect("/");
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
