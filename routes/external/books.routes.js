const router = require("express").Router();
const mongoose = require("mongoose");
const axios = require("axios");

router.get("/books", (req, res, next) => {
    axios
        .get("https://www.googleapis.com/books/v1/volumes?q=search+terms")
        .then((books) => console.log(books.items))
        .catch((err) => console.log(err));
})