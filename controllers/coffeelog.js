const express = require("express");
const moment = require("moment");

moment.suppressDeprecationWarnings = true;

const coffeelogRouter = express.Router();

const upload = require("../middlewares/upload");
const Coffeelog = require("../models/coffeelog");
const User = require("../models/users");

//////////////////////////////////////////
//      Search Functions
//////////////////////////////////////////
const searchFields = ["roasters", "blends", "method", "flavors"];

const searchBasic = (searchKey, req) => {
  let searchObj = {
    [searchKey]: {
      $regex: req.query.search,
    },
  };
  return searchObj;
};

const searchInUser = (searchKey, req) => {
  let searchObj = {
    $and: [
      searchBasic(searchKey, req),
      { owner_id: req.session.currentUser._id },
    ],
  };
  return searchObj;
};

const searchInUserBetweenD = (searchKey, req) => {
  let parseStart = moment(req.query.qsdate);
  let parseEnd = moment(req.query.qedate);
  let searchObj = {
    $and: [
      { owner_id: req.session.currentUser._id },
      {
        createdAt: {
          $gte: parseStart.startOf("day").toISOString(),
          $lte: parseEnd.endOf("day").toISOString(),
        },
      },
    ],
  };
  return searchObj;
};

const searchInUserDGreater = (searchKey, req) => {
  let parseStart = moment(req.query.qsdate);
  let parseEnd = moment(req.query.qedate);
  let searchObj = {
    $and: [
      { owner_id: req.session.currentUser._id },
      {
        createdAt: {
          $gte: parseStart.startOf("day").toISOString(),
        },
      },
    ],
  };
  return searchObj;
};

const searchInUserDLesser = (searchKey, req) => {
  let parseStart = moment(req.query.qsdate);
  let parseEnd = moment(req.query.qedate);
  let searchObj = {
    $and: [
      { owner_id: req.session.currentUser._id },
      {
        createdAt: {
          $lte: parseEnd.endOf("day").toISOString(),
        },
      },
    ],
  };
  return searchObj;
};

const searchWBasicInUserBetweenD = (searchKey, req) => {
  let parseStart = moment(req.query.qsdate);
  let parseEnd = moment(req.query.qedate);
  let searchObj = {
    $and: [
      searchBasic(searchKey, req),
      { owner_id: req.session.currentUser._id },
      {
        createdAt: {
          $gte: parseStart.startOf("day").toISOString(),
          $lte: parseEnd.endOf("day").toISOString(),
        },
      },
    ],
  };
  return searchObj;
};

const searchWBasicInUserDGreater = (searchKey, req) => {
  let parseStart = moment(req.query.qsdate);
  let searchObj = {
    $and: [
      searchBasic(searchKey, req),
      { owner_id: req.session.currentUser._id },
      {
        createdAt: {
          $gte: parseStart.startOf("day").toISOString(),
        },
      },
    ],
  };
  return searchObj;
};

const searchWBasicInUserDLesser = (searchKey, req) => {
  let parseStart = moment(req.query.qsdate);
  let parseEnd = moment(req.query.qedate);
  let searchObj = {
    $and: [
      searchBasic(searchKey, req),
      { owner_id: req.session.currentUser._id },
      {
        createdAt: {
          $lte: parseEnd.endOf("day").toISOString(),
        },
      },
    ],
  };
  return searchObj;
};

const searchBuilder = (searchFunc, req) => {
  let bigSObj = {
    $or: [],
  };
  const arrayOfFields = searchFields.map((param) => {
    return searchFunc(param, req);
  });
  bigSObj.$or = arrayOfFields;
  console.log(arrayOfFields);
  return bigSObj;
};

const queryDateValidator = (req) => {
  if (req.query.search && req.query.qsdate && req.query.qedate) {
    return {
      $or: [
        searchWBasicInUserBetweenD("roasters", req),
        searchWBasicInUserBetweenD("blend", req),
        searchWBasicInUserBetweenD("method", req),
        searchWBasicInUserBetweenD("flavors", req),
      ],
    };
  } else if (req.query.search && req.query.qsdate) {
    return {
      $or: [
        searchWBasicInUserDGreater("roasters", req),
        searchWBasicInUserDGreater("blend", req),
        searchWBasicInUserDGreater("method", req),
        searchWBasicInUserDGreater("flavors", req),
      ],
    };
  } else if (req.query.search && req.query.qedate) {
    return {
      $or: [
        searchWBasicInUserDLesser("roasters", req),
        searchWBasicInUserDLesser("blend", req),
        searchWBasicInUserDLesser("method", req),
        searchWBasicInUserDLesser("flavors", req),
      ],
    };
  } else if (req.query.qsdate && req.query.qedate) {
    return {
      $or: [
        searchInUserBetweenD("roasters", req),
        searchInUserBetweenD("blend", req),
        searchInUserBetweenD("method", req),
        searchInUserBetweenD("flavors", req),
      ],
    };
  } else if (req.query.qsdate) {
    return {
      $or: [
        searchInUserDGreater("roasters", req),
        searchInUserDGreater("blend", req),
        searchInUserDGreater("method", req),
        searchInUserDGreater("flavors", req),
      ],
    };
  } else if (req.query.qedate) {
    return {
      $or: [
        searchInUserDLesser("roasters", req),
        searchInUserDLesser("blend", req),
        searchInUserDLesser("method", req),
        searchInUserDLesser("flavors", req),
      ],
    };
  } else {
    return {
      $or: [
        searchInUser("roasters", req),
        searchInUser("blend", req),
        searchInUser("method", req),
        searchInUser("flavors", req),
      ],
    };
  }
};

//////////////////////////////////////////
//      Routes
//////////////////////////////////////////
//Index Route
coffeelogRouter.get("/", (req, res) => {
  Coffeelog.find()
    .sort("-createdAt")
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
    .sort("-createdAt")
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
  Coffeelog.find(queryDateValidator(req))
    .sort("-createdAt")
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
    if (datecheck.length === 2) {
      if (parseDate.year() === 2001) {
        const currentyear = moment().year();
        parseDate.set("year", currentyear);
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
    .sort("-createdAt")
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
