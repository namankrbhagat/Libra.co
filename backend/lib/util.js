import jwt from 'jsonwebtoken';

export const generateToken = async (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  })

  const isDev = process.env.NODE_ENV === "development";
  console.log("Generating Token. NODE_ENV:", process.env.NODE_ENV);
  console.log("Cookie Options - SameSite:", isDev ? "lax" : "none", "Secure:", !isDev);

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, //MS
    httpOnly: true, // prevent XSS attacks cross-site scripting attacks
    sameSite: isDev ? "lax" : "none",
    secure: !isDev,
    partitioned: true // Support for CHIPS (modern browsers)
  })

  return token;
}