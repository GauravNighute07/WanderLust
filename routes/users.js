const express = require ("express")
const wrapAsync = require("../utils/wrapAsync")
const router = express.Router()
const User = require("../models/users.js")
const passport = require("passport")
const { saveredirectUrl } = require("../middleware.js")
const controllerUser = require("../controller/user.js")


// -------- SignUp --------
router.get("/signup",controllerUser.singUpForm)

router.post("/signup",wrapAsync(controllerUser.signUp))

// -------- Login --------
router.get("/login",controllerUser.logInForm)

router.post("/login",
    saveredirectUrl,
    passport.authenticate("local",{failureRedirect: "/login" , failureFlash:true}),
    controllerUser.logIn
);

// -------- LogOut --------
router.get("/logout",controllerUser.logOut);


module.exports=router;