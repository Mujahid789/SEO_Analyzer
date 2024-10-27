const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
require("dotenv").config();

// Local Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false, { message: "User not found" });

        const isMatch = await user.comparePassword(password);
        if (!isMatch)
          return done(null, false, { message: "Incorrect password" });

        const token = generateToken(user);
        return done(null, { user, token });
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("Google OAuth callback hit");
      console.log("Profile:", profile);
      try {
        let user = await User.findOne({ googleId: profile.id });
        console.log("User found:", user);
        if (!user) {
          user = new User({
            googleId: profile.id,
            email: profile.emails[0].value,
            username: profile.displayName,
            // Password is not set for OAuth users
          });
          await user.save();
          console.log("New user created");
        }
        const token = generateToken(user);
         console.log("Token generated:", token);
        return done(null, { user, token });
      } catch (error) {
        console.error("Error in Google OAuth strategy:", error);
        return done(error);
      }
    }
  )
);

// Facebook OAuth Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/api/auth/facebook/callback",
      profileFields: ["id", "displayName", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("Facebook OAuth callback hit");
      console.log("Profile:", profile);
      try {
        let user = await User.findOne({ facebookId: profile.id });
        console.log("User found:", user);
        if (!user) {
          user = new User({
            facebookId: profile.id,
            email: profile.emails[0].value,
            username: profile.displayName,
            // Password is not set for OAuth users
          });
          await user.save();
          console.log("New user created");
        }
        const token = generateToken(user);
        console.log("Token generated:", token);
        return done(null, { user, token });
      } catch (error) {
        console.error("Error in Facebook OAuth strategy:", error);
        return done(error);
      }
    }
  )
);

// Session management
passport.serializeUser((user, done) => {
  done(null, user.id); // Send only the user ID for session handling
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
