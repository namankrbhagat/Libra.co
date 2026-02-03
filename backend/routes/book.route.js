import express from "express";
import multer from "multer";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createBook, getAllBooks, bookBook, cancelBook, sendSaleOTP, verifySaleOTP } from "../controller/book.controller.js";

const router = express.Router();

// Configure Multer to use Memory Storage (Best for Cloudinary uploads)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to get all books
router.get("/", protectRoute, getAllBooks);

// Route to book a book
router.post("/:id/book", protectRoute, bookBook);

// Route to cancel booking
router.post("/:id/cancel", protectRoute, cancelBook);

// OTP Routes
router.post("/:id/otp/send", protectRoute, sendSaleOTP);
router.post("/:id/otp/verify", protectRoute, verifySaleOTP);

// Route to add a new book
// protectRoute verifies user. 
// upload.fields parses 'frontImage' and 'backImage'.
router.post("/add", protectRoute, upload.fields([
  { name: 'frontImage', maxCount: 1 },
  { name: 'backImage', maxCount: 1 }
]), createBook);

export default router;
