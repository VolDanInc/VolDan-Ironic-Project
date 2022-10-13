const router = require("express").Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");

// Require necessary (isLoggedOut and isLoggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", isLoggedOut, (req, res) => {
  const { userName, email, password } = req.body;

  if (!email) {
    return res.status(400).render("auth/signup", {
      errorMessage: "Please provide your email.",
    });
  }

  if (password.length < 8) {
    return res.status(400).render("auth/signup", {
      errorMessage: "Your password needs to be at least 8 characters long.",
    });
  }

  //   ! This use case is using a regular expression to control for special characters and min length
  /*
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

  if (!regex.test(password)) {
    return res.status(400).render("signup", {
      errorMessage:
        "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
  }
  */

  // Search the database for a user with the username submitted in the form
  User.findOne({ email }).then((found) => {
    // If the user is found, send the message username is taken
    if (found) {
      return res
        .status(400)
        .render("auth/signup", { errorMessage: "This Email already exists." });
    }

    // if user is not found, create a new user - start with hashing the password
    return bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        // Create a user and save it in the database
        //console.log(hashedPassword);
        return User.create({
          userName,
          email,
          passwordHash: hashedPassword,
        });
      })
      .then((user) => {
        // Bind the user to the session object
        req.session.user = user;
        res.redirect("/");
      })
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          return res
            .status(400)
            .render("auth/signup", { errorMessage: error.message });
        }
        if (error.code === 11000) {
          return res
            .status(400)
            .render("auth/signup", { errorMessage: "Username need to be unique. The username you chose is already in use." });
        }
        return res
          .status(500)
          .render("auth/signup", { errorMessage: error.message });
      });
  });
});

router.get("/login", isLoggedOut, (req, res) => {
  //console.log(res);
  res.render("auth/login");
});

router.post("/login", isLoggedOut, (req, res, next) => {
  const { email, password } = req.body;

  if (!email) {
    return res
      .status(400)
      .render("auth/login", { errorMessage: "Please provide your username." });
  }

  // Here we use the same logic as above
  // - either length based parameters or we check the strength of a password
  if (password.length < 8) {
    return res
      .status(400)
      .render("auth/login", { errorMessage: "Your password needs to be at least 8 characters long." });
  }

  // Search the database for a user with the username submitted in the form
  User.findOne({ email })
    .then((user) => {
      // If the user isn't found, send the message that user provided wrong credentials
      if (!user) {
        return res
          .status(400)
          .render("auth/login", { errorMessage: "Wrong credentials." });
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt.compare(password, user.passwordHash).then((isSamePassword) => {
        if (!isSamePassword) {
          return res
            .status(400)
            .render("auth/login", { errorMessage: "Wrong credentials." });
        }

        req.session.user = user;
        //console.log(req.session.user);
        // req.session.user = user._id; // ! better and safer but in this case we saving the entire user object
        return res.redirect("/");
      });
    })

    .catch((err) => {
      // in this case we are sending the error handling to the error handling middleware that is defined in the error handling file
      // you can just as easily run the res.status that is commented out below
      next(err);
      // return res.status(500).render("auth/login", { errorMessage: err.message });
    });
});

router.post("/logout", isLoggedIn, (req, res) => {
  //console.log(res);
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .render("auth/logout", { errorMessage: err.message });
    }
    //console.log(req.session.user)
    res.redirect("/");
  });
});

router.get("/user-profile", isLoggedIn, (req, res) => {
  //console.log(res);
  res.render("auth/userprofile");
});

router.get("/changepw", isLoggedIn, (req, res) => {
  //console.log(req.body);
  res.render("auth/userprofile", { chgPw: true });
});

router.post("/user-profile", isLoggedIn, (req, res) => {
  //console.log(req.body);
  const { oldpw, newpw, newpwd } = req.body;

  const currentUser = req.session.user;
  //console.log(currentUser._id);
  //console.log("change page");
  bcrypt.compare(oldpw, currentUser.passwordHash).then((isSamePassword) => {
    if (!isSamePassword) {
      //console.log("old pass");
      return res
        .status(400)
        .render("auth/userprofile", { errorMessage: "Wrong old password." });
    } else if (newpw.length < 8) {
      //console.log("new pass");
      return res.status(400).render("auth/userprofile", {
        errorMessage: "Your password needs to be at least 8 characters long.",
      });
    } else if (newpwd !== newpw) {
      //console.log("new2 pass");
      return res.status(400).render("auth/userprofile", {
        errorMessage: "Your repeat new password doesn't match new password.",
      });
    } else {
      bcrypt
        .genSalt(saltRounds)
        .then((salt) => bcrypt.hash(newpwd, salt))
        .then((newHashedPassword) => {
          //console.log("hash pass");
          //console.log(newHashedPassword);
          //console.log(currentUser._id);
          return User.findOneAndUpdate({_id: currentUser._id}, { passwordHash: newHashedPassword })
        })
        .then((user) => {
          //console.log("good pass");
          //console.log(user);
          // Bind the user to the session object
          req.session.user = user;
          //res.redirect("/auth/user-profile");
          return res.status(200).render("auth/userprofile", {
            Message: "Your password changed!",
          });
        })
        .catch((error) => {
          console.log("Password is not changed", error);
        })
        }
  });
});

module.exports = router;
