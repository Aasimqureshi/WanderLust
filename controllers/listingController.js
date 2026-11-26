const Listing = require("../models/listing.js");

//Index route to display all the listings in the database.
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};