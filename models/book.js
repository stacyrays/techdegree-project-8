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
      author: Sequelize.STRING,
      genre: Sequelize.STRING,
      year: Sequelize.INTEGER
    },
    { sequelize }
  );

  return Book;
};
