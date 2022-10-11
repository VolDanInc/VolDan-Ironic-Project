const { Schema, model } = require("mongoose");


const favoriteSchema = new Schema(
  {
    title: String,
    description: String,
    imageLinks: String,
    publishedDate: String,
    pageCount: Number,
    language: String,
    type: String,
    author: String,
    previewLink: String
    },
    
  
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Favorite = model("Favorite", favoriteSchema);

module.exports = Favorite;
