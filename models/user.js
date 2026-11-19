const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
});

userSchema.plugin(passportLocalMongoose); //This will add username and password fields to the userSchema and also add some methods to the schema such as Hashing password and salting.

module.exports = mongoose.model("User", userSchema);