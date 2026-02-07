import Books from "../models/book.js";
import cloudinary from "../lib/cloudinary.js";
import User from "../models/user.js";
import OTP from "../models/otp.js";
import { sendOtpSMS } from "../lib/otp.js";

import Booking from "../models/booking.js";

// ... (Existing imports)

export const createBook = async (req, res) => {
  try {
    const { title, author, category, price, desc, address, location } = req.body;

    // Validation for text fields
    if (!title || !author || !category || !price || !desc || !location) {
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

    let locationData;
    try {
      const parsedLoc = JSON.parse(location);

      locationData = {
        type: "Point",
        coordinates: [parsedLoc.longitude, parsedLoc.latitude]
      }
    } catch (error) {
      res.status(400).json({ message: "Invalid location format" })
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
      location: locationData
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
    const { lat, long, distance } = req.query;
    let query = { status: "Available" }; // Only show available books by default

    if (lat && long && distance) {
      const radiusInMeters = parseFloat(distance) * 1000;
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(long), parseFloat(lat)]
          },
          $maxDistance: radiusInMeters
        }
      }
    }

    const books = await Books.find(query).populate("seller", "fullName email avatar address").sort({ createdAt: -1 });
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

export const sendSaleOTP = async (req, res) => {
  try {
    const bookId = req.params.id;
    const userId = req.user._id;

    const book = await Books.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // Permissions: Allow Seller ONLY
    const isSeller = book.seller.toString() === userId.toString();

    if (!isSeller) {
      return res.status(403).json({ message: "Only the seller can generate OTP" });
    }

    if (book.status !== "Booked" || !book.buyer) {
      return res.status(400).json({ message: "Book is not currently booked" });
    }

    // Generate 6-digit OTP
    const otpValue = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[DEBUG] Generated OTP for Book ${bookId}: ${otpValue}`);

    // Save to DB (upsert)
    await OTP.findOneAndDelete({ bookId, userId: book.buyer });
    const newOTP = new OTP({
      userId: book.buyer,
      bookId: bookId,
      otp: otpValue
    });
    await newOTP.save();

    // Send SMS to Buyer
    const buyerUser = await User.findById(book.buyer);
    if (buyerUser && buyerUser.phone) {
      try {
        await sendOtpSMS(buyerUser.phone, otpValue);
        return res.status(200).json({ message: "OTP sent to buyer's phone" });
      } catch (smsError) {
        console.error(smsError);
        return res.status(500).json({ message: "Failed to send SMS" });
      }
    } else {
      return res.status(400).json({ message: "Buyer has no phone number" });
    }

  } catch (error) {
    console.error("Error in sendSaleOTP:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const verifySaleOTP = async (req, res) => {
  try {
    const bookId = req.params.id;
    const sellerId = req.user._id;
    const { otp } = req.body;

    if (!otp) return res.status(400).json({ message: "OTP is required" });

    const book = await Books.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.seller.toString() !== sellerId.toString()) {
      return res.status(403).json({ message: "You are not the seller" });
    }

    if (book.status !== "Booked" || !book.buyer) {
      return res.status(400).json({ message: "Book is not booked properly" });
    }

    // Find OTP
    const otpRecord = await OTP.findOne({
      bookId: bookId,
      userId: book.buyer,
      otp: otp
    });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // OTP Verified - Complete Sale
    book.status = "Sold";
    await book.save();

    // Update Booking status
    // Find the booking for this book and buyer
    // Note: Creating a 'Sold' status in Booking model might be needed if it restricts enums, 
    // but assuming standard string or matching enums.

    // Check if Booking model import is available nearby or import it
    // Actually, I need to make sure Booking is imported if I use it.
    // It is imported at the top of file: import Booking from "../models/booking.js";

    await Booking.findOneAndUpdate(
      { book: bookId, bookings: book.buyer },
      { status: "Sold" }
    );

    // Delete used OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    res.status(200).json({ message: "Sale completed successfully!", book });

  } catch (error) {
    console.error("Error in verifySaleOTP:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};