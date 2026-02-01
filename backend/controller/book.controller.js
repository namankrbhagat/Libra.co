import Books from "../models/book.js";
import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.js";

import Booking from "../models/booking.js";

// ... (Existing imports)

export const createBook = async (req, res) => {
  try {
    const { title, author, category, price, desc, address } = req.body;

    // Validation for text fields
    if (!title || !author || !category || !price || !desc) {
      return res.status(400).json({ message: "All text fields are required" });
    }

    // If address is provided, update the user's address
    if (address) {
      await User.findByIdAndUpdate(req.user._id, { address });
    }

    //Validation for files
    if (!req.files || !req.files.frontImage || !req.files.backImage) {
      return res.status(400).json({ message: "Both front and back images are required" })
    }

    const uploadToCloudinary = async (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "books" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(fileBuffer);
      });
    };

    let frontImageURL, backImageURL;
    if (req.files.frontImage[0].buffer && req.files.backImage[0].buffer) {
      const frontResult = await uploadToCloudinary(req.files.frontImage[0].buffer);
      const backResult = await uploadToCloudinary(req.files.backImage[0].buffer);

      frontImageURL = frontResult.secure_url;
      backImageURL = backResult.secure_url;

    } else {
      return res.status(400).json({ message: "Image upload failed" })
    }


    const newBook = new Books({
      title,
      author,
      category,
      price,
      desc,
      frontImage: frontImageURL,
      backImage: backImageURL,
      seller: req.user._id,

    })

    await newBook.save();
    res.status(201).json({ message: "Book listed successfully", book: newBook });

  } catch (error) {
    console.log("Error in createBook controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllBooks = async (req, res) => {
  try {
    const books = await Books.find().populate("seller", "fullName email avatar address").sort({ createdAt: -1 });
    res.status(200).json(books);
  } catch (error) {
    console.log("Error in getAllBooks controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const bookBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user._id;

    const book = await Books.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.status !== "Available") return res.status(400).json({ message: "Book is not available" });

    if (book.seller.toString() === userId.toString()) {
      return res.status(400).json({ message: "You cannot book your own book" });
    }

    // Update Book Model
    book.status = "Booked";
    book.buyer = userId;
    await book.save();

    // Create Booking Document
    const newBooking = new Booking({
      bookings: userId,
      book: bookId,
      status: "Booked"
    });
    await newBooking.save();

    res.status(200).json({ message: "Book booked successfully", book });

  } catch (error) {
    console.log("Error in bookBook controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export const cancelBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user._id;

    const book = await Books.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.buyer.toString() !== userId.toString()) return res.status(403).json({ message: "You are not the buyer of this book" });

    // Update Book Model
    book.status = "Available";
    book.buyer = null;
    await book.save();

    // Remove Booking Document
    await Booking.findOneAndDelete({ book: bookId, bookings: userId });

    res.status(200).json({ message: "Booking cancelled successfully", book });

  } catch (error) {
    console.log("Error in cancelBook controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}