const { Schema, model } = require("mongoose");


const favoritesSchema = new Schema(
  {
    title: String,
    description: String,
    link: String,
    format: {
      type: String,
      enum: ["movie", "series", "book", "podcast"]
    }
    },
    
  
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Favorite = model("Favorite", favoriteSchema);

module.exports = Favorite;
