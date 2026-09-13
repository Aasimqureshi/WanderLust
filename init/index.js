const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(err => {
        console.log("Error connecting to MongoDB:", err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
    // Use the new connection to perform database 
};

const initDB = async () => {
    await Listing.deleteMany({}); //To clear the preexisting data in the database.
    await Listing.insertMany(initData.data); //To insert the data from data.js file into the database.
    console.log("data was initialized");
};

initDB();
