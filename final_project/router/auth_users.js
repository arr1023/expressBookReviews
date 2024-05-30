const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const axios = require("axios");

let users = [];

const isValid = (username) => {
  const regex = /^[a-zA-Z0-9]{3,20}$/;
  return regex.test(username);
}

const authenticatedUser = (username, password) => {
  const user = users.find(user => user.username === username && user.password === password);
  return user !== undefined;
}

//only registered users can login
regd_users.post("/login", (req, res) => {

  const username = req.body.username;

  const password = req.body.password;

  if (!username || !password) {

      return res.status(404).json({ message: "Error logging in" });

  }

  if (authenticatedUser(username, password)) {

      let accessToken = jwt.sign(

          {

              data: password,

          },

          "access",

          { expiresIn: 60 * 60 }

      );

      req.session.authorization = {

          accessToken,

          username,

      };

      return res.status(200).send("User successfully logged in");

  } else {

      return res

          .status(208)

          .json({ message: "Invalid Login. Check username and password" });

  }

});
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review; 
  if (isbn && review) {
      
      if (!books[isbn]) {
          books[isbn] = {}; 
      }
      books[isbn].reviews = review; 
      res.send("The review for the book with ISBN " + isbn + " has been added!");
  } else {
      res.status(400).send("ISBN and review are required.");
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  if (isbn) {
      
      if (!books[isbn]) {
          books[isbn] = {}; 
      }
      books[isbn].reviews = ""; 
      res.send("The review for the book with ISBN " + isbn + " has been deleted!");
  } else {
      res.status(400).send("ISBN is required.");
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
