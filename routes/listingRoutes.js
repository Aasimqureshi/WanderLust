const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

//Index route to display all the listings in the database.
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
}));

//New route ko hume show route ke upar rakhna hoga warna error aayega ki /listings/new ko /listings/:id se match kar raha hai. 
// app.js / listingRoutes new route ko id se match karega aur /listings/new id smajh ke dhundega. 

//New route to render a form for creating a new listing.
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

//Show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate("reviews")
    .populate("owner");
    if(!listing) {
        req.flash("error", "Listing does not exists!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}));

//Create route to handle form submission and create a new listing in the database.
router.post("/", isLoggedIn,
    validateListing, wrapAsync(async (req, res, next) => {
    // let { title, description, image, price, location, country } = req.body;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
    }),
);

//Edit Route to render a form for editing an existing listing.
router.get("/:id/edit", isLoggedIn, isOwner,
    wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing does not exists!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));

//Update route to handle form submission and update an existing listing in the database.
router.put("/:id", isLoggedIn, isOwner,
    validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Successfully updated the listing!");
    res.redirect(`/listings/${id}`);
}));

//Delete route to handle the deletion of a listing from the database.
router.delete("/:id", isLoggedIn, isOwner,
    wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("Deleted listing:", deletedListing);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
}));

module.exports = router;