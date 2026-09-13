const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
    type: String,
    default: "https://images.unsplash.com/photo-..."

        //getting error in these line of code while inserting the data in the database (Error> Listing Validation Failed)
        // type: String,
        // default: "https://unsplash.com/photos/stone-fireplace-in-rustic-living-room-Q0OitqGyVWA",
        // set: (v) => 
        //     v=== "" 
        //     ? "https://unsplash.com/photos/stone-fireplace-in-rustic-living-room-Q0OitqGyVWA"  
        //     : v,
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;