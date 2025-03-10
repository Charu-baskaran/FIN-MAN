import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, validate: validator.isEmail },
    password: { type: String, required: true, minlength: 6 },
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
export default User;