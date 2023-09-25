const express = require("express");
const userCallback = require("../handlers/user.js");

const router = express.Router();

//create profile
router.post("/:id", userCallback.createProfile);

//get profile
router.get("/:id", userCallback.getProfile);

//update profile
router.put("/:id", userCallback.updateProfile);

//upload image
router.post("/:id/image", userCallback.uploadImage);

//get images
router.get("/:id/image", userCallback.getImages);

module.exports = router;
