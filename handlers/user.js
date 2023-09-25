const db = require("../db");

//create profile
const createProfile = async (req, res) => {
  try {
    const { fullname, email, phone, address } = req.body;

    if (!email || !phone || !fullname || !address) {
      return res.status(422).json({ error: "Please fill all fields" });
    }

    const profile = await db.query("SELECT * from profiles where user_id=$1", [
      req.params.id,
    ]);

    //console.log(user.rows.length);

    if (profile.rows.length !== 0) {
      return res.status(422).json({ error: "Profile already exists" });
    }

    const result = await db.query(
      "INSERT INTO profiles (user_id, full_name, email, phone, address) values ($1, $2, $3, $4, $5)",
      [req.params.id, fullname, email, phone, address]
    );

    //console.log(result);

    res.status(201).json({
      status: "Your profile has been created",
    });
  } catch (error) {
    console.log(error);
    return res.status(422).json({ error: "Something went wrong!" });
  }
};

//get profile

const getProfile = async (req, res) => {
  //   console.log(req.params);
  try {
    const profile = await db.query("SELECT * from profiles where user_id=$1", [
      req.params.id,
    ]);

    res.status(200).json({
      status: "Success",
      profile: profile.rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(422).json({ error: "Something went wrong!" });
  }
};

//update profile

const updateProfile = async (req, res) => {
  const { fullname, email, phone, address } = req.body;

  //   console.log(req.params);
  try {
    const profile = await db.query("SELECT * from profiles where user_id=$1", [
      req.params.id,
    ]);

    //console.log(user.rows.length);

    if (profile.rows.length === 0) {
      return res.status(422).json({ error: "Profile has not been created" });
    }

    const result = await db.query(
      "UPDATE profiles set full_name=$1, email=$2, phone=$3, address=$4 where user_id=$5",
      [fullname, email, phone, address, req.params.id]
    );

    const updatedProfile = await db.query(
      "SELECT * from profiles where user_id=$1",
      [req.params.id]
    );

    res.status(200).json({
      status: "Your profile has been updated successfully",
      profile: updatedProfile.rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(422).json({ error: "Something went wrong!" });
  }
};

//upload image
const uploadImage = async (req, res) => {
  try {
    const { image } = req.body;

    const result = await db.query(
      "INSERT INTO images (user_id, image) values ($1, $2) returning *",
      [req.params.id, image]
    );

    //console.log(result);

    res.status(201).json({
      status: "Image has been uploaded successfully",
      result: result.rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(422).json({ error: "Something went wrong!" });
  }
};

//get images

const getImages = async (req, res) => {
  //   console.log(req.params);
  try {
    const images = await db.query("SELECT * from images where user_id=$1", [
      req.params.id,
    ]);

    res.status(200).json({
      status: "Success",
      images: images.rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(422).json({ error: "Something went wrong!" });
  }
};

const userCallback = {
  createProfile,
  getProfile,
  updateProfile,
  uploadImage,
  getImages,
};

module.exports = userCallback;
