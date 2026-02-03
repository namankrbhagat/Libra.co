import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      default: "Available",
      enum: ["Available", "Booked", "Sold"]
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    frontImage: {
      type: String,
      required: true,

    },
    backImage: {
      type: String,
      required: true,
    },
    location: {
      type:{
        type : String,
        enum : ['Point'],
        default: 'Point'
      },
      coordinates: {
        type:[Number],
        required:true
      }
    }
  },
  { timestamps: true }
)
bookSchema.index({location : "2dsphere"})

const Books = mongoose.model("Books", bookSchema);
export default Books;