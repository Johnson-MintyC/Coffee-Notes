const express = require("express");
const moment = require("moment");

moment.suppressDeprecationWarnings = true;

const coffeelogRouter = express.Router();

const upload = require("../middlewares/upload");
const Coffeelog = require("../models/coffeelog");
const User = require("../models/users");

//////////////////////////////////////////
//      Routes
//////////////////////////////////////////
//Index Route
coffeelogRouter.get("/", (req, res) => {
  Coffeelog.find()
    .exec()
    .then((coffeelogs) => {
      res.render("coffeelogs/index.ejs", {
        currentUser: req.session.currentUser,
        coffeelogs: coffeelogs,
        baseUrl: req.baseUrl,
        moment: moment,
        tabTitle: "Coffee Notes Home",
      });
    });
});

//new Form
coffeelogRouter.get("/new", (req, res) => {
  res.render("coffeelogs/new.ejs", {
    currentUser: req.session.currentUser,
    baseUrl: req.baseUrl,
    tabTitle: "Add a new Entry",
  });
});

//post the Form
coffeelogRouter.post("/", upload.single("img"), (req, res) => {
  req.body.flavors = req.body.flavornotes.split("#").filter(Boolean);
  for (let i = 0; i < req.body.flavors.length; i++) {
    req.body.flavors[i] = req.body.flavors[i].trim();
  }
  if (req.file) {
    req.body.img = req.file.path;
  } else {
    req.body.img = "https://loremflickr.com/320/240/coffeebeans";
  }
  req.body.owner_id = req.session.currentUser._id;
  Coffeelog.create(req.body);
  res.redirect("/");
});

//Personal Journals Route
coffeelogRouter.get("/myjournal", (req, res) => {
  Coffeelog.find({ owner_id: req.session.currentUser._id })
    .exec()
    .then((personalcoffeelogs) => {
      res.render("coffeelogs/journal.ejs", {
        currentUser: req.session.currentUser,
        coffeelogs: personalcoffeelogs,
        baseUrl: req.baseUrl,
        moment: moment,
        tabTitle: `${req.session.currentUser.username}'s Journal`,
      });
    });
});

//Journal Search Route
coffeelogRouter.get("/myjournalsearch", (req, res) => {
  let sttimeframe = "day";
  const parseDate = moment(req.query.search);
  if (parseDate.isValid()) {
    const splitter = "[-/ .]";
    let datecheck = req.query.search.split(splitter);
    if (datecheck.length === 2) {
      sttimeframe = "month";
    } else if (datecheck.length === 1) {
      sttimeframe = "year";
    }
  }
  Coffeelog.find({
    $or: [
      {
        $and: [
          {
            roasters: {
              $regex: req.query.search,
            },
          },
          { owner_id: req.session.currentUser._id },
        ],
      },
      {
        $and: [
          {
            blend: {
              $regex: req.query.search,
            },
          },
          { owner_id: req.session.currentUser._id },
        ],
      },
      {
        $and: [
          {
            method: {
              $regex: req.query.search,
            },
          },
          { owner_id: req.session.currentUser._id },
        ],
      },
      {
        $and: [
          {
            flavors: {
              $regex: req.query.search,
            },
          },
          { owner_id: req.session.currentUser._id },
        ],
      },
      {
        $and: [
          {
            createdAt: {
              $gte: parseDate.startOf(sttimeframe).toISOString(),
              $lte: parseDate.endOf(sttimeframe).toISOString(),
            },
          },
          { owner_id: req.session.currentUser._id },
        ],
      },
    ],
  })
    .exec()
    .then((searchresults) => {
      res.render("coffeelogs/search.ejs", {
        currentUser: req.session.currentUser,
        coffeelogs: searchresults,
        baseUrl: req.baseUrl,
        currentUrl: req.url,
        moment: moment,
        tabTitle: "Search Results",
      });
    });
});

//Search Results Route
coffeelogRouter.get("/search", (req, res) => {
  let sttimeframe = "day";
  let parseDate = moment(req.query.search);
  if (parseDate.isValid()) {
    const splitter = /[-/ .]/;
    let datecheck = req.query.search.split(splitter);
    console.log(parseDate.year());
    if (datecheck.length === 2) {
      if (parseDate.year() === 2001) {
        const currentyear = moment().year();
        parseDate.set("year", currentyear);
        console.log(parseDate);
        sttimeframe = "month";
      } else {
        sttimeframe = "month";
      }
    } else if (datecheck.length === 1) {
      sttimeframe = "year";
    }
  }
  Coffeelog.find({
    $or: [
      {
        roasters: {
          $regex: req.query.search,
        },
      },
      {
        blend: {
          $regex: req.query.search,
        },
      },
      {
        method: {
          $regex: req.query.search,
        },
      },
      {
        flavors: {
          $regex: req.query.search,
        },
      },
      {
        createdAt: {
          $gte: parseDate.startOf(sttimeframe).toISOString(),
          $lte: parseDate.endOf(sttimeframe).toISOString(),
        },
      },
    ],
  })
    .exec()
    .then((searchresults) => {
      res.render("coffeelogs/search.ejs", {
        currentUser: req.session.currentUser,
        coffeelogs: searchresults,
        baseUrl: req.baseUrl,
        currentUrl: req.url,
        moment: moment,
        tabTitle: "Search Results",
      });
    });
});

//Show Route
coffeelogRouter.get("/:id", (req, res) => {
  Coffeelog.findById(req.params.id)
    .exec()
    .then((coffeelog) => {
      User.findById(coffeelog.owner_id)
        .exec()
        .then((user) => {
          res.render("coffeelogs/show.ejs", {
            currentUser: req.session.currentUser,
            baseUrl: req.baseUrl,
            coffeelog: coffeelog,
            user: user,
            moment: moment,
            tabTitle: `${coffeelog.roasters} ${coffeelog.blend}`,
          });
        });
    });
});

//Edit Form Route
coffeelogRouter.get("/:id/edit", (req, res) => {
  Coffeelog.findById(req.params.id)
    .exec()
    .then((coffeelog) => {
      if (coffeelog.owner_id == req.session.currentUser._id) {
        res.render("coffeelogs/edit.ejs", {
          currentUser: req.session.currentUser,
          baseUrl: req.baseUrl,
          coffeelog: coffeelog,
          tabTitle: `Editing ${coffeelog.roasters} ${coffeelog.blend}`,
        });
      } else {
        res.redirect(req.baseUrl + "/" + req.params.id);
      }
    });
});

//Edit PUT Route
coffeelogRouter.put("/:id", upload.single("img"), (req, res) => {
  req.body.flavors = req.body.flavornotes.split("#").filter(Boolean);
  for (let i = 0; i < req.body.flavors.length; i++) {
    req.body.flavors[i] = req.body.flavors[i].trim();
  }
  if (req.file) {
    req.body.img = req.file.path;
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
