const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/reviews.js");
const listingRoutes = require("./routes/listingRoutes.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

//Setting up the view engine and views directory for rendering EJS templates.
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate); 
// Use ejs-mate for layout support 
// / hum ejs-mate ka use kar rahe hai taki hum layouts ka use kar sakein. 
// aur hum layouts ka use kar rahe hai taki hum apne pages ke liye common layout bana sakein 
// aur har page ke liye alag se header, footer, etc. na likhna pade.
// / aur app.engine("ejs", ejsMate) ka use karne ke baad hum apne views ke andar layouts folder bana sakte hai 
// aur uske andar ek layout.ejs/boilerplate file bana sakte hai jisme hum apne common layout ko define kar sakte hai 
// aur phir har page ke liye us layout ko extend kar sakte hai.
// aur app.engine set isly kiya gaya hai taki hum ejs-mate ka use kar sakein aur layouts ka support mil sake.

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use("/listings", listingRoutes);

main().then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.log("Error connecting to MongoDB:", err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

//Home route to display a welcome message.
app.get("/", (req, res) => {
    res.send("Hii, I'm WanderLust App");
});


//Add middlewares function for server side validation for review
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

//Reviews
//Post Review route to handle the creation of a new review for a specific listing.
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
}));

//Delete Review Route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));
//Testing route to create a sample listing in the database. This route is commented out and can be used for testing purposes.
// app.get("/listings", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 12000,
//         location: "Calangute, Goa",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("Sample listing saved:", sampleListing);
//     res.send("Successful testing");
// });

//Catch-all route to handle requests to undefined routes and return a 404 error.
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

//Using middleware to handle async errors in route handlers
app.use((err, req, res, next) => {
    let {statusCode=500, message="Something went wrong"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", {message});
});

app.listen(8080, () => {
    console.log("Server is listening at port 8080");
});