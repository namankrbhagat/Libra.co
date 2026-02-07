import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/util.js';
import cloudinary from '../lib/cloudinary.js';

export const signup = async (req, res) => {
  const { fullName, email, password, phone } = req.body;
  try {
    if (!fullName || !email || !password || !phone) {
      return res.status(400).json({ message: "Please enter all the fields" })
    }

    //Hash Password
    if (password.length < 6) {
      return res.status(400).json({ message: "Password length must be at least 6 characters" })
    }
    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName, email,
      password: hashedPass,
      phone
    })

    if (newUser) {
      await newUser.save();
      await generateToken(newUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        avatar: newUser.avatar,
      })

      console.log("Signed up successfully...!!");
    } else {
      return res.status(400).json({ message: "Invalid user data" })
    }
  } catch (error) {
    console.log(`Error in signup controller: ${error.message}`);
  }
}

export const login = async (req, res) => {

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "Invalid Credentials" })

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    await generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
    });

  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" })
  }
}

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV !== "development"
    });
    res.status(200).json({ message: "Logged out successfully" })
  }
  catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { avatar } = req.body;
    const userId = req.user._id;

    if (!avatar) {
      return res.status(400).json({
        message: "Profile pic is required"
      })
    }

    const uploadResponse = await cloudinary.uploader.upload(avatar, {
      folder: "profile-pics"
    })

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: uploadResponse.secure_url },
      { new: true }
    )

    res.status(200).json({
      message: "Profile Updated", updatedUser
    })
  } catch (error) {
    console.log("Error in updateProfile : ", error);
    res.status(400).json({
      message: "Internal Server Error",
      error: error.message,
      cloudinaryError: error.error // Cloudinary Specific
    })
  }
}