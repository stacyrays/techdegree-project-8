const express = require("express");
const router = express.Router();
const Book = require("../models").Book;

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
  asyncHandler(async (req, res) => {
    const books = await Book.findAll({ order: [["title", "ASC"]] });
    res.render("books/index", { books, title: "Books" });
  })
);

/* Create a new book form. */
router.get("/new", (req, res) => {
  res.render("books/new", { book: {}, title: "New book" });
});

/* POST create book. */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    let book;
    try {
      book = await Book.create(req.body);
      res.redirect("/books/" + book.id);
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        // checking the error
        book = await Book.build(req.body);
        res.render("books/new", {
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

/* Edit book form. 
router.get(
  "/:id/edit",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render("books/edit", { book, title: "Edit book" });
    } else {
      res.sendStatus(404);
    }
  })
);*/

/* GET individual book. */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render("books/edit", { book, title: book.title });
    } else {
      res.sendStatus(404);
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
        res.redirect("/books");
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        book = await Book.build(req.body);
        book.id = req.params.id; // make sure correct book gets updated
        res.render("/books", {
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
      res.sendStatus(404);
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
      res.sendStatus(404);
    }
  })
);

module.exports = router;
