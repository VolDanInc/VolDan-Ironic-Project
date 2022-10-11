const router = require("express").Router();
const mongoose = require("mongoose");
const Favorite = require("../models/Favorite.model");

const isLoggedIn = require("../middleware/isLoggedIn");

//READ: List all favorites

router.get("/favorites", (req, res, next) => {
  
  Favorite.find({id: req.session.user._id})
    .then( favoritesFromDB => {
        res.render("favorites/favorites-list", {favorites: favoritesFromDB})
    })
    .catch( err => {
      console.log("error getting favorites from DB", err);
      next(err);
    })
});


//CREATE: display form
router.get("/favorites/create", isLoggedIn, (req, res, next) => {

      res.render("favorites/favorites-create");
    })
    



//CREATE: process form
router.post("/favorites/create", isLoggedIn, (req, res, next) => {
  
  const favoritesDetails = {
    id: req.session.user,
    title: req.body.title,
    description: req.body.description,
    link: req.body.url,
    format: req.body.format
  }

  Favorite.create(favoritesDetails)
    .then(favoritesDetails => {
      res.redirect("/favorites");
    })
    .catch(err => {
      console.log("error creating new favorite in DB", err);
      next(err);
    })

})

//UPDATE: display form
router.get("/books/:bookId/edit", isLoggedIn, (req, res, next) => {
  Book.findById(req.params.bookId)
    .then( (bookDetails) => {
      res.render("books/book-edit", bookDetails);
    })
    .catch( err => {
      console.log("Error getting book details from DB...", err);
      next();
    });
});


//UPDATE: process form
router.post("/favorites/:favoriteId/edit", isLoggedIn, (req, res, next) => {
  const favoriteId = req.params.favoritekId;

  const newFavDetails = {
    title: req.body.title,
    description: req.body.description,
    link: req.body.link,
    format: req.body.format
  }

  Favorite.findByIdAndUpdate(favoriteId, newFavDetails)
    .then(() => {
      res.redirect(`/favoritess/${favoriteId}`);
    })
    .catch(err => {
      console.log("Error updating favorite entry...", err);
      next();
    });
});


//DELETE
router.post("/favorites/:favoriteId/delete", isLoggedIn, (req, res, next) => {
  Favorite.findByIdAndDelete(req.params.favoriteId)
    .then(() => {
      res.redirect("/favorites");
    })
    .catch(err => {
      console.log("Error deleting favorite...", err);
      next();
    });

});

router.post("/favorites/createNewFavorite", isLoggedIn,(req, res, next) => {
  console.log("req.params.title")
  const favorite= {
    id: req.session.user,
    title: req.body.title,
    imageLinks: req.body.imageLinks,
    publishedDate: req.body.publishedDate,
    pageCount: req.body.pageCount,
    language: req.body.language
  }
 Favorite.create(favorite)
.then((favorite) =>{
  res.redirect("/favorites")
})
.catch(err => {
  console.log("Error listing favorite from API...", err);
  next();
});
})

router.post("/favorites/createNewFavorites", isLoggedIn,(req, res, next) => {
  console.log("req.params.title")
  const favorite= {
    id: req.session.user,
    title: req.body.title,
    imageLinks: req.body.imageLinks,
    publishedDate: req.body.publishedDate,
    type: req.body.type,
    author: req.body.author,
    previewLink: req.body.previewLink
  }
 Favorite.create(favorite)
.then((favorite) =>{
  res.redirect("/favorites")
})
.catch(err => {
  console.log("Error listing favorite from API...", err);
  next();
});
})



module.exports = router;