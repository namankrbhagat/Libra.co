import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    bookings:{
      type:mongoose.Types.ObjectId,
      ref:"User",
    },

    book:{
      type:mongoose.Types.ObjectId,
      ref: "books"
    },
    status :{
      type:String,
      default: "Booked",
      enum : ["Booked","Not Booked", "Sold"]
    }
  },
  {timestamps:true}
)

const Booking = mongoose.model("Booking",bookingSchema);
export default Booking;