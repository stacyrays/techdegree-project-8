"use strict";
const Sequelize = require("sequelize");
const moment = require("moment");

module.exports = sequelize => {
  class Book extends Sequelize.Model {
    publishedAt() {
      const date = "";
    }
  }
  Book.init(
    {
      title: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: {
            msg: '"Title" is required'
          }
        }
      },
      author: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: {
            msg: '"Author" is required'
          }
        }
      },
      genre: {
        type: Sequelize.STRING,
        validate: {
          isAlpha: {
            msg: "Must only be letters"
          }
        }
      },
      year: {
        type: Sequelize.INTEGER,
        validate: {
          isNumeric: {
            msg: "Must be a number"
          }
        }
      }
    },
    { sequelize }
  );

  return Book;
};
