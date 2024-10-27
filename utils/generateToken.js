const jwt = require("jsonwebtoken");

// Helper function to generate a JWT
const generateToken = (user) => {
  // Define the payload for the token (usually the user's ID or email)
  const payload = {
    id: user._id,
    username: user.username,
  };

  // Generate the token using the secret from your environment variables
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }); // The token expires in 1 hour
  
};
// const generateToken =(user, res) => {
// 	const token = jwt.sign({ user }, process.env.JWT_SECRET, {
// 		expiresIn: "1h",
// 	});

// 	res.cookie("jwt", token, {
// 		maxAge: 15 * 24 * 60 * 60 * 1000, // MS
// 		httpOnly: true, // prevent XSS attacks cross-site scripting attacks
// 		sameSite: "strict", // CSRF attacks cross-site request forgery attacks
// 		secure: process.env.NODE_ENV !== "development",
// 	});
// };


module.exports = generateToken
