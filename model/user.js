const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        FirstName: { type: String, required: true },
        LastName: { type: String, required: true },
        Age: { type: Number, required: true },
        Email: { type: String, required: true, unique: true },
        Password: { type: String, required: true },
        ContactNumber: { type: String, default: null },
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", UserSchema, "Users");

module.exports = { User };
