const express = require("express");
const router = express.Router();
const Book = require("../models").Book;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

/* Handler function to wrap each route. */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      res.status(500).send(error);
    }
  };
}

/* GET books listing. */
router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    const books = await Book.findAll({ order: [["year", "ASC"]] });
    if (books) {
      res.render("books/index", { books, title: "Books" });
    } else {
      res.render("page-not-found", { book: {}, title: "Page Not Found" });
      //res.sendStatus(404);
    }
  })
);

/* GET books listing. */
router.get(
  "/books",
  asyncHandler(async (req, res, next) => {
    const books = await Book.findAll({ order: [["year", "ASC"]] });
    if (books) {
      res.render("books/index", { books, title: "Books" });
    } else {
      res.render("page-not-found", { book: {}, title: "Page Not Found" });
    }
  })
);

//SEARCH for Books (work in progress)
router.post(
  "/search",
  asyncHandler(async (req, res, next) => {
    let search = req.body.search;
    //search = "Emma";
    const books = await Book.findAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.startsWith]: `${search}`
            }
          },
          {
            author: {
              [Op.startsWith]: `${search}`
            }
          },
          {
            genre: {
              [Op.startsWith]: `${search}`
            }
          },
          {
            year: {
              [Op.startsWith]: `${search}`
            }
          }
        ]
      }
    });
    if (books) {
      res.render("books/search", { books, title: "Search Results" });
    } else {
      res.render("page-not-found", { book: {}, title: "Page Not Found" });
    }
  })
);

/*//SEARCH for Books byt title
router.post(
  "/search",
  asyncHandler(async (req, res, next) => {
    let search = req.body.search;
    //search = "Emma";
    const books = await Book.findAll({
      where: {
        title: `${search}`,
      }
    });
    if (books) {
      res.render("books/search", { books, title: "Search Results" });
    } else {
      res.render("page-not-found", { book: {}, title: "Page Not Found" });
    }
  })
);*/

/* Create a new book form. */
router.get("/new", (req, res) => {
  res.render("books/new-book", { book: {}, title: "New book" });
});

/* POST create book. */
router.post(
  "/new",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.create(req.body);
      res.redirect("/");
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        // checking the error
        book = await Book.build(req.body);
        res.render("books/new-book", {
          book,
          errors: error.errors,
          title: "New book"
        });
      } else {
        throw error; // error caught in the asyncHandler's catch block
      }
    }
  })
);

/* GET individual book. */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render("books/update-book", { book, title: book.title });
    } else {
      res.render("page-not-found", { book: {}, title: "Page Not Found" });
      //res.sendStatus(404);
    }
  })
);

/* Update a book. */
router.post(
  "/:id",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.findByPk(req.params.id);
      if (book) {
        await book.update(req.body);
        res.redirect("/");
      } else {
        res.render("page-not-found", { book: {}, title: "Page Not Found" });
        //res.sendStatus(404);
      }
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        book.id = req.params.id; // make sure correct book gets updated
        res.render("books/update-book", {
          book,
          errors: error.errors,
          title: "Edit book"
        });
      } else {
        throw error;
      }
    }
  })
);

/* Delete book form. */
router.get(
  "/:id/delete",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render("books/delete", { book, title: "Delete book" });
    } else {
      res.render("page-not-found", { book: {}, title: "Page Not Found" });
      //res.sendStatus(404);
    }
  })
);

/* Delete individual book. */
router.post(
  "/:id/delete",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      await book.destroy();
      res.redirect("/books");
    } else {
      res.render("page-not-found", { book: {}, title: "Page Not Found" });
      //res.sendStatus(404);
    }
  })
);

module.exports = router;
