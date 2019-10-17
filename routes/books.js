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
    const limit = 5;
    const offset = 0;
    const books = await Book.findAll({
      order: [["year", "ASC"]],
      limit: limit,
      offset: offset
    });
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
    const books = await Book.findAll({
      order: [["year", "ASC"]],
      limit: 5,
      offset: 0
    });
    if (books) {
      res.render("books/index", { books, title: "Books" });
    } else {
      res.render("page-not-found", { book: {}, title: "Page Not Found" });
    }
  })
);

//Next button clicked
router.get(
  "/next",
  asyncHandler(async (req, res, next) => {
    let pageNumber = 1; /*I have this hard coded for now but how do i keep track of the page I'm currently on to make this work for multiple Next button clicks?*/
    const limit = 5;
    const offset = pageNumber * limit;
    const books = await Book.findAll({
      order: [["year", "ASC"]],
      limit: limit,
      offset: offset
    });
    if (books) {
      res.render("books/index", { books, title: "Books" });
    } else {
      res.render("page-not-found", { book: {}, title: "Page Not Found" });
    }
  })
);

//Prev button clicked
router.get(
  "/prev",
  asyncHandler(async (req, res, next) => {
    const books = await Book.findAll({
      order: [["year", "ASC"]],
      limit: 5,
      offset: 0
    });
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
              [Op.substring]: `${search}`
            }
          },
          {
            author: {
              [Op.substring]: `${search}`
            }
          },
          {
            genre: {
              [Op.substring]: `${search}`
            }
          },
          {
            year: {
              [Op.substring]: `${search}`
            }
          }
        ]
      },
      limit: 5,
      offset: 0
    });
    if (books) {
      res.render("books/index", { books, title: "Search Results" });
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
