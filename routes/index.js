const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", (req, res, next) => {
  res.redirect("/books/pages/0");
});

module.exports = router;
