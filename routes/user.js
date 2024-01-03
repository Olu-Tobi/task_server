const express = require("express");
const userCallback = require("../handlers/user.js");
const { verifyAccessToken } = require("../helpers/jwtHelper.js");

const router = express.Router();

//create profile
router.post("/:id", verifyAccessToken, userCallback.createProfile);

//get profile
router.get("/:id", verifyAccessToken, userCallback.getProfile);

//update profile
router.put("/:id", verifyAccessToken, userCallback.updateProfile);

//upload image
router.post("/:id/image", verifyAccessToken, userCallback.uploadImage);

//get images
router.get("/:id/image", verifyAccessToken, userCallback.getImages);

module.exports = router;
