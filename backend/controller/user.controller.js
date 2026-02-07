import User from "../models/user.js";
import Books from "../models/book.js";
import Booking from "../models/booking.js";

export const getProfile = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in getProfile: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    // Selling History: Books listed by this user
    const sellingHistory = await Books.find({ seller: userId });

    // Determining status for each sold book
    const enrichedSellingHistory = await Promise.all(sellingHistory.map(async (book) => {
      const booking = await Booking.findOne({ book: book._id });
      return {
        ...book.toObject(),
        status: booking ? booking.status : "Available",
        price: `₹${book.price}`, // Formatting price
        date: book.createdAt.toISOString().split('T')[0] // Formatting date
      };
    }));

    const sellingStats = {
      listed: enrichedSellingHistory.length,
      reserved: enrichedSellingHistory.filter(b => b.status === "Booked" || b.status === "Reserved").length,
      collected: enrichedSellingHistory.filter(b => b.status === "Sold" || b.status === "Collected").length
    };

    // Buying History: Bookings made by this user (buyer)
    // Field 'bookings' in Booking model refers to the User (buyer)
    const buyingHistory = await Booking.find({ bookings: userId }).populate({
      path: 'book',
      populate: { path: 'seller', select: 'fullName address' }
    });

    const enrichedBuyingHistory = buyingHistory.map(booking => {
      const book = booking.book;
      if (!book) return null; // Skip if book is deleted

      return {
        _id: book._id,
        title: book.title,
        status: booking.status,
        price: `₹${book.price}`,
        date: booking.createdAt.toISOString().split('T')[0],
        seller: book.seller?.fullName || "Unknown Seller",
        location: book.seller?.address || "Location Not Available"
      };
    }).filter(item => item !== null); // Filter out nulls

    // To improve Buying History, we should populate seller from the book
    // Wait, deep populate? 'book' is populated. 'book.seller' is an ID.
    // We can fetch seller details if needed. 
    // For now, let's just return what we have.

    const buyingStats = {
      booked: buyingHistory.filter(b => b.status === "Booked").length,
      active: buyingHistory.filter(b => b.status === "Active" || b.status === "Booked").length,
      collected: buyingHistory.filter(b => b.status === "Sold").length
    };

    res.status(200).json({
      sellingStats,
      sellingHistory: enrichedSellingHistory,
      buyingStats,
      buyingHistory: enrichedBuyingHistory
    });

  } catch (error) {
    console.log("Error in getUserHistory: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
