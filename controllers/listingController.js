const Listing = require("../models/listing.js");

//Index route to display all the listings in the database.
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

//Render Page for adding new listing - Route
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

//Show Route
module.exports.showtListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author",
        },
    })
    .populate("owner");
    if(!listing) {
        req.flash("error", "Listing does not exists!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

//Create Route
module.exports.createListing = async (req, res, next) => {
    // let { title, description, image, price, location, country } = req.body;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
    };

//Edit form Route
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing does not exists!");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
};

//Update Route
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Successfully updated the listing!");
    res.redirect(`/listings/${id}`);
};

//Delete Route
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("Deleted listing:", deletedListing);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
};