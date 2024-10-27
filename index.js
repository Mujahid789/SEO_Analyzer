const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
require("./config/passport");
require("dotenv").config();
const cookieParser =require("cookie-parser");
// require("./utils/googleStretgy")

const seoRoutes = require("./routes/seoRoutes");
const authRoutes = require("./routes/auth");
const connectToMongoDb = require("./db/connectToMongoDB");
const { googleProvider } = require("./utils/googleStretgy");


const app = express();
const port = 6500;
// const port = 5000;

// MongoDB connection
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.log(err));

// Middleware to parse JSON bodies
app.use(express.json());

// Session setup
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
    },
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
passport.use((googleProvider))
/////////////////////////
// passport.use(new FacebookStrategy({
//   clientID: process.env.FACEBOOK_CLIENT_ID,
//   clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//   callbackURL: "/auth/facebook/callback",
//   profileFields: ['id', 'emails', 'name'] // Fields you want from Facebook
// },

// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: "/auth/google/callback"
// },

///////////////////////////

// Use CORS to allow cross-origin requests
app.use(
  cors({
    origin: "*", // Allow requests from any origin
  })
);

// Routes
app.use("/api/seo", seoRoutes);
app.use("/api", authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});
app.use(cookieParser());
// Start the server
app.listen(port, () => {
  connectToMongoDb();
  console.log(`Server is running on http://localhost:${port}`);
});
