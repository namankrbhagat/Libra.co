import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/util.js';

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
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
      password: hashedPass
    })

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        avatar: newUser.avatar,
      })

      console.log("Signed up successfully...!!");
    } else {
      res.status(400).json({ message: "Invalid user data" })
    }
  } catch (error) {
    console.log(`Error in signup controller: ${error.message}`);
  }
}

export const login = async (req, res) => {

  const { email, password } = req.body;
  try {
    const user = await User.findOne({email});

    if (!user) res.status(400).json({ message: "Invalid Credentials" })

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
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