const express = require("express");
const authCallback = require("../handlers/auth.js");

const router = express.Router();

//register user
router.post("/register", authCallback.register);

//login
router.post("/login", authCallback.login);

//refresh token
router.post("/refresh-token", authCallback.refreshToken);

//logout
router.delete("/logout", authCallback.logout);

module.exports = router;
