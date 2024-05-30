const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  
  if (!username || !password) {
    return res.status(400).json({ message: "Please provide both username and password" });
  }

  
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(409).json({ message: "Username already exists. Please choose a different username" });
  }

  const newUser = { username, password };
  users.push(newUser); 

  res.status(200).json({ message: "User registered successfully", user: newUser });
});

// Get the book list available in the shop
public_users.get('/books', function (req, res) {
  res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});


// Add a review for a book
public_users.post('/isbn/:isbn/reviews', function (req, res) {
  const isbn = req.params.isbn;
  const review = req.body.review; 
  const book = books[isbn];
  if (book) {
    if (!book.reviews) {
      book.reviews = [];
    }
   
    book.reviews.push(review);
    res.status(200).json({ message: "Review added successfully" });
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});


// Delete a review for a book
public_users.delete('/isbn/:isbn/reviews/:review', function (req, res) {
  const isbn = req.params.isbn;
  const review = req.params.review;
  
  const book = books[isbn];
  if (book) {
    if (book.reviews) {
      book.reviews = book.reviews.filter(r => r !== review);
      res.status(200).json({ message: "Review deleted successfully" });
    } else {
      res.status(404).json({ message: "Reviews not found for this book" });
    }
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const booksArray = Object.values(books);
  const authorBooks = booksArray.filter(book => book.author === author);
  if (authorBooks.length > 0) {
    res.status(200).json(authorBooks);
  } else {
    res.status(404).json({ message: "Books by the author not found" });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const booksArray = Object.values(books);
  const titleBooks = booksArray.filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
  if (titleBooks.length > 0) {
    res.status(200).json(titleBooks);
  } else {
    res.status(404).json({ message: "Books by the title not found" });
  }
});


// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book && book.reviews) {
    res.status(200).json(book.reviews);
  } else {
    res.status(404).json({ message: "Reviews for the book not found" });
  }
});


//promises below


// Task 10
public_users.get('/', function (req, res) {
  // Wrap the operation in a Promise
  new Promise((resolve, reject) => {
      if (Object.keys(books).length > 0) {
          resolve(books); 
      } else {
          reject("No books available"); 
      }
  })
  .then((books) => {
      res.status(200).json(books);
  })
  .catch((error) => {
      res.status(404).json({ message: error });
  });
});

// Task 11
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  new Promise((resolve, reject) => {
      const bookArray = Object.values(books);
      const book = bookArray.find(book => book.ISBN === isbn);
      if (book) {
          resolve(book); 
      } else {
          reject("Book not found"); 
      }
  })
  .then((book) => {
      res.status(200).json(book);
  })
  .catch((error) => {
      res.status(404).json({ message: error });
  });
});



// Task 12
public_users.get('/author/:author', function (req, res) {
  new Promise((resolve, reject) => {
    const bookArray = Object.values(books);
    const booksByAuthor = bookArray.filter(book => book.author === req.params.author);
    if (booksByAuthor.length > 0) {
      resolve(booksByAuthor); 
    } else {
      reject("Books by author not found"); 
    }
  })
  .then((books) => {
    res.status(200).json(books);
  })
  .catch((error) => {
    res.status(404).json({ message: error });
  });
});

// Task 13
public_users.get('/title/:title', function (req, res) {
  new Promise((resolve, reject) => {
    const bookArray = Object.values(books);
    const book = bookArray.find(book => book.title === req.params.title);
    if (book) {
      resolve(book); 
    } else {
      reject("Book by title not found");
    }
  })
  .then((book) => {
    res.status(200).json(book);
  })
  .catch((error) => {
    res.status(404).json({ message: error });
  });
});



module.exports.general = public_users;
