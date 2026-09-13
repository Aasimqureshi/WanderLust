const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");

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
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

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

//Index route to display all the listings in the database.
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
});

//New route ko hume show route ke upar rakhna hoga warna error aayega ki /listings/new ko /listings/:id se match kar raha hai. 
// app.js new route ko id se match karega aur /listings/new id smajh ke dhundega. 

//New route to render a form for creating a new listing.
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

//Show route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
});

//Create route to handle form submission and create a new listing in the database.
app.post("/listings", async (req, res) => {
    // let { title, description, image, price, location, country } = req.body;
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

//Edit Route to render a form for editing an existing listing.
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
});

//Update route to handle form submission and update an existing listing in the database.
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
});

//Delete route to handle the deletion of a listing from the database.
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("Deleted listing:", deletedListing);
    res.redirect("/listings");
});

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

app.listen(8080, () => {
    console.log("Server is listening at port 8080");
});