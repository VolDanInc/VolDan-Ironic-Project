const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, 'Username or nikname is required.'],
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      //match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
      lowercase: true,
      trim: true
      // unique: true -> Ideally, should be unique, but its up to you
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required.']
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
