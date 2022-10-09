const router = require("express").Router();
const mongoose = require("mongoose");
const axios = require("axios");

const isLoggedIn = require("../middleware/isLoggedIn");

const articles = {
    method: 'GET',
    url: 'https://myallies-breaking-news-v1.p.rapidapi.com/GetTopNews',
    headers: {
      'X-RapidAPI-Key': '97d47758bdmsh09580f5807389ddp1a1c72jsn7a9c4b3ce6ac',
      'X-RapidAPI-Host': 'community-hacker-news-v1.p.rapidapi.com'
    }
  };

router.post("/books", (req, res) => {

    switch (req.body.media) {
        case "movies":

            break;
        case "articles":
            axios
                .request(articles)
                .then((articlesFromExt) => {
                    //const booksPreview = books.data.items;
                    console.log(articlesFromExt);
                    res.render("external/articles");
                })
                .catch((err) => console.log(err));
            break;
        case "books":
            axios
                .get("https://www.googleapis.com/books/v1/volumes?q=search+terms")
                .then((books) => {
                    const booksPreview = books.data.items;
                    console.log(books.data.items[0].volumeInfo.imageLinks);
                    res.render("external/books", { booksFromNet: booksPreview });
                })
                .catch((err) => console.log(err));
            break;
        case "podcasts":

            break;
    }
})

module.exports = router;