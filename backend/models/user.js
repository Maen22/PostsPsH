import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: { type: String, required: true },
});

// This plugin for checking email uniqueness, by default the unique validator
// deos not through error, mongodb uses it for optimizations
userSchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema);

export default User;
