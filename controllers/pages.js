const express = require("express");

const pageRouter = express.Router();

pageRouter.get("/aboutme", (req, res) => {
  res.render("pages/aboutme.ejs", {
    tabTitle: "About me",
    baseUrl: req.baseUrl,
    currentUser: req.session.currentUser,
  });
});

module.exports = pageRouter;
