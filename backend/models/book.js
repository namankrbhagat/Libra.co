import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    url:{
      type:String,
      required:true,
    },
    title:{
      type:String,
      required:true,
    },
    author :{
      type:String,
      required:true,
    },
    price: {
      type:Number,
      required:true,
    },
    desc:{
      type: String,
      required:true,
    }
  },
  {timestamps:true}
)

const Books =  mongoose.model("Books",bookSchema);
export default Books;