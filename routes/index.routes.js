const router = require("express").Router();
const axios = require("axios");
/* GET home page */
router.get("/", (req, res, next) => {

  axios
  .get("https://www.googleapis.com/books/v1/volumes?q=search+terms")
  .then((books) => {
      const booksPreview = books.data.items;
      //console.log(books.data.items[0].volumeInfo.imageLinks);
      res.render("index", { booksFromNet: booksPreview });
  })
  .catch((err) => console.log(err));


});

module.exports = router;
