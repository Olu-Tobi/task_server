const express = require("express");
const authCallback = require("../handlers/auth.js");

const router = express.Router();

//register user
router.post("/register", authCallback.register);
router.post("/login", authCallback.login);

module.exports = router;
