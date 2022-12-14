const router = require("express").Router();
const mongoose = require("mongoose");
const Favorite = require("../models/Favorite.model");

const isLoggedIn = require("../middleware/isLoggedIn");

//READ: List all favorites

router.get("/favorites", isLoggedIn, (req, res, next) => {

  Favorite.find({ userId: req.session.user._id })
    .then(favoritesFromDB => {
      res.render("favorites/favorites-list", { favorites: favoritesFromDB })
    })
    .catch(err => {
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
    userId: req.session.user,
    origId: req.body.origId,
    title: req.body.title,
    description: req.body.description,
    imageLinks: req.body.imageLinks,
    publishedDate: req.body.publishedDate,
    pageCount: req.body.pageCount,
    language: req.body.language,
    type: req.body.type,
    author: req.body.author,
    previewLink: req.body.previewLink
  }

  Favorite.create(favoritesDetails)
    .then(favoritesDetails => {

      res.redirect("/favorites");
    })
    .catch(err => {
      console.log("error creating new favorite in DB", err);

      next();

    })

})

//UPDATE: display form
router.get("/favorites/:favoriteId/edit", isLoggedIn, (req, res, next) => {
  Favorite.findById(req.params.favoriteId)
    .then((favoriteDetails) => {
      res.render("favorites/favorites-edit", favoriteDetails);
    })
    .catch(err => {
      console.log("Error getting book details from DB...", err);
      next();
    });
});


//UPDATE: process form
router.post("/favorites/:favoriteId/edit", isLoggedIn, (req, res, next) => {
  const favoriteId = req.params.favoriteId;

  const newFavDetails = {
    userId: req.session.user,
    origId: req.body.origId,
    title: req.body.title,
    description: req.body.description,
    imageLinks: req.body.imageLinks,
    publishedDate: req.body.publishedDate,
    pageCount: req.body.pageCount,
    language: req.body.language,
    type: req.body.type,
    author: req.body.author,
    previewLink: req.body.previewLink
  }

  Favorite.findByIdAndUpdate(favoriteId, newFavDetails)
    .then(() => {
      res.redirect("/favorites");
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

router.get("/favorites/createNewFavorite", isLoggedIn, (req, res, next) => {

  res.render("favorites/favorites-list");
})


router.post("/favorites/createNewFavorite", isLoggedIn, (req, res, next) => {
  //console.log("req.params.title")
  const favorite = {
    userId: req.session.user._id,
    origId: req.body.origId,
    title: req.body.title,
    imageLinks: req.body.imageLinks,
    publishedDate: req.body.publishedDate,
    type: req.body.type,
    pageCount: req.body.pageCount,
    language: req.body.language,
    previewLink: req.body.previewLink
  }

  Favorite.find({ origId: favorite.origId })
    .then((found) => {
      //console.log(found.userId +" ---" + favorite.userId)
      // If the user is found, send the message username is taken

      if (!found) {

        Favorite.create(favorite)
          .then((favorite) => {
            res.redirect("/favorites")
          })
          .catch(err => {
            console.log("Error listing favorite from API...", err);
            next();
          });

      } else if (found.map(item => item.userId).includes(favorite.userId)) {
        //const ff = found.map(item => item.userId).includes(favorite.userId)
        //console.log(ff + '======='+favorite.userId);
        return res
          .status(400)
          .render("favorites/favorites-list", { Message: "You already have this favorite." });
      } else {
        //console.log(found);
        //console.log(found.userId + '-------'+favorite.userId);
        Favorite.create(favorite)
          .then((favorite) => {
            res.redirect("/favorites")
          })
          .catch(err => {
            console.log("Error listing favorite from API...", err);
            next();
          });
      }
    })
    .catch(err => {
      console.log("Error listing favorite from API...", err);
      next();
    })

})

router.post("/favorites/createNewFavorites", isLoggedIn, (req, res, next) => {
  //console.log("req.params.title")
  const favorite = {
    userId: req.session.user._id,
    origId: req.body.origId,
    title: req.body.title,
    imageLinks: req.body.imageLinks,
    publishedDate: req.body.publishedDate,
    type: req.body.type,
    author: req.body.author,
    previewLink: req.body.previewLink
  }
  Favorite.find({ origId: favorite.origId })
    .then((found) => {
      //console.log(found.userId +" ---" + favorite.userId)
      // If the user is found, send the message username is taken

      if (!found) {

        Favorite.create(favorite)
          .then((favorite) => {
            res.redirect("/favorites")
          })
          .catch(err => {
            console.log("Error listing favorite from API...", err);
            next();
          });

      } else if (found.map(item => item.userId).includes(favorite.userId)) {
        //const ff = found.map(item => item.userId).includes(favorite.userId)
        //console.log(ff + '======='+favorite.userId);
        return res
          .status(400)
          .render("favorites/favorites-list", { Message: "You already have this favorite." });
      } else {
        //console.log(found);
        //console.log(found.userId + '-------'+favorite.userId);
        Favorite.create(favorite)
          .then((favorite) => {
            res.redirect("/favorites")
          })
          .catch(err => {
            console.log("Error listing favorite from API...", err);
            next();
          });
      }
    })
    .catch(err => {
      console.log("Error listing favorite from API...", err);
      next();
    })
})



module.exports = router;