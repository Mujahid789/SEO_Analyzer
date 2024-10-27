const User = require("../models/User");
const passport = require("passport");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs/dist/bcrypt");
// require("../utils/googleStretgy")

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findOne(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating tokens:", error);
    return { success: false, message: "Error generating tokens" };
  }
};


exports.signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existedUser) {
      return res.status(200).json({ message: "user Already exist please login" });
    }
    const user = new User({ username, email, password, role });
    await user.save();
    const token = generateToken(user);

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    console.log("created user", createdUser)

    if (!createdUser) {
      return res.status(400).json({ message: "something went wrong" });;
    }

    res.status(201).json({ message: "User created successfully", createdUser, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = await User.findOne({ $or: [{ username }, { email }], });
    if (!user) {
      return res.status(404).json({ message: "user not exists" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const logedInUser = await User.findById(user._id).select("-password -refreshToken")

    console.log('logedInUser', logedInUser)
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        {
          message: "loged in successfully",
          user: logedInUser,
          // profilePic: user.profilePic,
        }

      );

    // generateToken(user._id, res);

    // res.status(200).json({
    //   _id: user._id,
    //   fullName: user.fullName,
    //   username: user.username,
    //   // profilePic: user.profilePic,
    // });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

///////////////////////  set tokens in headers
// exports.login = async (req, res) => {
//   try {
//     const { email, username, password } = req.body;
//     const user = await User.findOne({ $or: [{ username }, { email }] });

//     if (!user) {
//       return res.status(404).json({ message: "User not exists" });
//     }

//     const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

//     if (!isPasswordCorrect) {
//       return res.status(400).json({ error: "Invalid username or password" });
//     }

//     const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
//     const logedInUser = await User.findById(user._id).select("-password -refreshToken");

//     console.log('logedInUser', logedInUser);

//     // Setting tokens in headers
//     res.setHeader('accessToken', accessToken);
//     res.setHeader('refreshToken', refreshToken);

//     return res.status(200).json({
//       message: "Logged in successfully",
//       user: logedInUser
//     });

//   } catch (error) {
//     console.log("Error in login controller", error.message);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };





///////////////////////////

exports.logOut = async (req, res) => {
  try {
    console.log("user===", req.user._id,);

    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      {
        new: true,
      }
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({message: "user logged out"});

  } catch (error) {
    console.log("Error in login controller", error.message);
    return res.status(500).json({ error: "Server error during logout" });
  }
};

const refreshAccessToken = async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    return res.status(404).json({ message: "unAuthorized request refresh token not available" });
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      return res.status(401).json({ message: "invalid refresh Token" });
    }

    if (incomingRefreshToken !== user.refreshToken) {
      return res.status(401).json({ message: "Refresh token is expired or used" });
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { newAccessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("newAccessToken", newAccessToken, options)
      .cookie("newRefreshToken", newRefreshToken, options)
      .json({message: "Access Token Refreshed successfully"});
  } catch (error) {
    console.log("Invalid Refresh token", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

////////////////////////////////
// Google OAuth
exports.googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});
exports.googleAuthCallback = async (req, res, next) => {
  console.log("Google callback route hit");

  passport.authenticate("google", async (err, googleUser, info) => {
    if (err) {
      console.error("Error during authentication:", err);
      return res.redirect("http://localhost:3000?auth=failed");
    }

    if (!googleUser) {
      console.warn("Authentication failed:", info.message);
      return res.redirect("http://localhost:3000?auth=failed");
    }

    try {
      // Check if user already exists in your database
      let user = await User.findOne({ googleId: googleUser.id }); // Use googleId to find user
      if (!user) {
        // User not found, create a new one
        user = new User({
          username: googleUser.displayName,
          email: googleUser.emails[0].value,
          googleId: googleUser.id, // Store Google ID for future reference
          // Add other fields if necessary
        });
        await user.save();
        console.log("New user created:", user);
      } else {
        console.log("User found:", user);
      }

      // Login the user
      req.login(user, async (err) => {
        if (err) {
          console.error("Error logging in user:", err);
          return res.redirect("http://localhost:3000?auth=failed");
        }

        // Generate token for the user
        const token = generateToken(user);
        console.log("Token generated:", token);
        user.token = token;

        // Redirect to dashboard with token
        res.redirect(`http://localhost:3000/?token=${token}&auth=success`);;
      });
    } catch (error) {
      console.error("Error handling user:", error);
      return res.redirect("http://localhost:3000?auth=failed");
    }
  })(req, res, next);
};




// Facebook OAuth
exports.facebookAuth = passport.authenticate("facebook", { scope: ["email"] });

exports.facebookAuthCallback = async (req, res, next) => {
  console.log("Facebook callback route hit");

  passport.authenticate("facebook", async (err, facebookUser, info) => {
    if (err) {
      console.error("Error during authentication:", err);
      return res.redirect("http://localhost:3000?auth=failed");
    }

    if (!facebookUser) {
      console.warn("Authentication failed:", info.message);
      return res.redirect("http://localhost:3000?auth=failed");
    }

    // Check if user already exists in your database
    try {
      let user = await User.findOne({ facebookId: facebookUser.id }); // Assuming you save Facebook ID in your User schema
      if (!user) {
        // User not found, create a new one
        user = new User({
          username: facebookUser.displayName,
          email: facebookUser.emails[0].value,
          facebookId: facebookUser.id, // Store Facebook ID for future reference
          // You might want to add other fields here, like profile picture, etc.
        });
        await user.save();
        console.log("New user created:", user);
      } else {
        console.log("User found:", user);
      }

      // Login the user
      req.login(user, async (err) => {
        if (err) {
          console.error("Error logging in user:", err);
          return res.redirect("http://localhost:3000?auth=failed");
        }

        // Generate token for the user
        const token = generateToken(user);
        console.log("Token generated:", token);
        user.token = token;

        // Redirect to dashboard with token
        res.redirect(`http://localhost:3000/?token=${token}&auth=success`);
      });
    } catch (error) {
      console.error("Error handling user:", error);
      return res.redirect("http://localhost:3000?auth=failed");
    }
  })(req, res, next);
};

