const router = require("express").Router();
const axios = require("axios");
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));
/* GET home page */
router.get("/", (req, res, next) => {

  axios
    .get("https://www.googleapis.com/books/v1/volumes?q=search+terms")
    .then((books) => {
      const booksPreview = books.data.items;
      //console.log(books.data.items);
      //res.render("index", { booksFromNet: booksPreview });
      return booksPreview;
    })
    .then((books) => {
      spotifyApi.getNewReleases({ limit: 10, offset: 0 })
        .then((data) => {
          const items = data.body.albums.items;
          //console.log(items[2].artists);
          res.render("index", { arrOfItems: items,  booksFromNet: books});
        })
        .catch((err) => console.log(err));
        
    })
    .catch((err) => console.log(err));
});

const Favorite = require('../models/Favorite.model')

router.get('/keep-alive', (req, res, next) => {
  Favorite.find()
    .then(() => {
      res.status(200).json({ message: 'It worked' });
    })
    .catch(() => {
      res.status(500).json({ message: "It didn't work" });
    });
});

module.exports = router;
