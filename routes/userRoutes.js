const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");

// GET route for rendering the signup form
router.get("/signup", (req, res) => {
    res.render("users/signup");
});

// POST route for handling user signup
router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({username, email});
        const registeredUser = await User.register(newUser, password);
        console.log("Registered User:", registeredUser);
        req.flash("success", "Successfully signed up! Welcome to WanderLust!");
        res.redirect("/listings");
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
    
}));

module.exports = router;