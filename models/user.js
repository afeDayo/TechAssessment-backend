const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    match: [
      /^[\w-]+(\.[\w-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,})$/,
      "Please Provide a valid email",
    ],
  },

  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", userSchema);
