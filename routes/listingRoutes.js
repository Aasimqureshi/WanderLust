const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listingController.js");

//Index route to display all the listings in the database.
router.get("/", wrapAsync(listingController.index));

//New route ko hume show route ke upar rakhna hoga warna error aayega ki /listings/new ko /listings/:id se match kar raha hai. 
// app.js / listingRoutes new route ko id se match karega aur /listings/new id smajh ke dhundega. 

//New route to render a form for creating a new listing.
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Show route
router.get("/:id", wrapAsync(listingController.showtListing));

//Create route to handle form submission and create a new listing in the database.
router.post("/", 
    isLoggedIn, 
    validateListing, 
    wrapAsync(listingController.createListing));

//Edit Route to render a form for editing an existing listing.
router.get("/:id/edit", 
    isLoggedIn, 
    isOwner,
    wrapAsync(listingController.renderEditForm));

//Update route to handle form submission and update an existing listing in the database.
router.put("/:id", 
    isLoggedIn, 
    isOwner,
    validateListing, 
    wrapAsync(listingController.updateListing));

//Delete route to handle the deletion of a listing from the database.
router.delete("/:id", 
    isLoggedIn, 
    isOwner,
    wrapAsync(listingController.deleteListing));

module.exports = router;