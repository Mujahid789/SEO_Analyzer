const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verifyJWT = require("../middleware/jwtMiddleware");

// Local Authentication
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", verifyJWT, authController.logOut);

// Google Authentication
router.get("/auth/google", authController.googleAuth);
router.get("/auth/google/callback", authController.googleAuthCallback);
router.get("/failed", (req, res) => {
    res.status(400).send({ "message": "authentication failed" })
});
router.get("/success", (req, res) => { });

// Facebook Authentication
router.get("/auth/facebook", authController.facebookAuth);
router.get("/auth/facebook/callback", authController.facebookAuthCallback);

module.exports = router;
