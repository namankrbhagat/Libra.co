import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type:String,
      required:true,
      unique:true,
    },
    email: {
      type:String,
      required:true,
      unique:true,
    },
    password: {
      type:String,
      required:true,
      unique:true,
    },
    address: {
      type:String,
      // required:true,
      unique:true,
    },
    avatar: {
      type:String,
      default:"https://cdn-icons-png.flaticon.com/128/3177/3177440.png"
    },
    role:{
      type:String,
      enum: ["user","admin"]
    },
    favourites: [{
      type:mongoose.Types.ObjectId,
      ref : "Books",
    }],
    carts : [{
      type:mongoose.Types.ObjectId,
      ref : "Books",
    }],
    bookings : [{
      type:mongoose.Types.ObjectId,
      ref : "Booking",
    }]
  },
  {timestamps : true}
 
)

const User = mongoose.model("User",userSchema);
export default User;