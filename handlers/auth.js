const db = require("../db");
const bcrypt = require("bcryptjs");
const createError = require("http-errors");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../helpers/jwtHelper");

const client = require("../helpers/initRedis");

//create user
const register = async (req, res, next) => {
  try {
    const { fullname, email, password, repeatPassword } = req.body;

    if (!email || !password || !fullname) {
      throw createError.UnprocessableEntity("Please fill all fields");
      //return res.status(422).json({ error: "Please fill all fields" });
    }

    const user = await db.query("SELECT * from users where email=$1", [email]);

    //console.log(user.rows.length);

    if (user.rows.length !== 0) {
      //return res.status(422).json({ error: "User already exists" });
      throw createError.Conflict("User already exists!");
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password needs to be at least 8 characters" });
    }

    if (password !== repeatPassword) {
      res.status(422).json({ error: "Repeated password did not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    //console.log(HashedPassword);

    const result = await db.query(
      "INSERT INTO users (full_name, email, password) values ($1, $2, $3) returning *",
      [fullname, email, hashedPassword]
    );

    //console.log(result);
    const accessToken = await signAccessToken(result.rows[0].id);
    const refreshToken = await signRefreshToken(result.rows[0].id);

    res.status(201).json({
      status: "Proceed to login!",
      result: { accessToken, refreshToken },
    });
  } catch (error) {
    //console.log(error);
    next(error);
    return;
    //return res.status(422).json({ error: "Something went wrong!" });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      //return res.status(422).json({ error: "Please fill all fields" });
      throw createError.UnprocessableEntity("Please fill all fields");
    }

    const user = await db.query("SELECT * from users where email=$1", [email]);

    if (user.rows.length === 0) {
      //return res.status(404).json({ error: "Invalid credentials" });
      throw createError.NotFound("Invalid credentials");
    }

    const doMatch = await bcrypt.compare(password, user.rows[0].password);
    const accessToken = await signAccessToken(user.rows[0].id);
    const refreshToken = await signRefreshToken(user.rows[0].id);

    if (doMatch) {
      res.status(200).json({
        status: "Login Successful!",
        user: user.rows,
        result: { accessToken, refreshToken },
      });
    } else {
      throw createError.Unauthorized("Invalid credentials");
      //return res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    //console.log(error);
    //return res.status(422).json({ error: "Something went wrong!" });
    next(error);
    return;
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createError.BadRequest();
    const userId = await verifyRefreshToken(refreshToken);

    const accessToken = await signAccessToken(userId);
    const newRefreshToken = await signRefreshToken(userId);

    res.status(200).json({
      result: { accessToken: accessToken, refreshToken: newRefreshToken },
    });
  } catch (error) {
    next(error);
    return;
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createError.BadRequest();
    const userId = await verifyRefreshToken(refreshToken);

    await client.del(userId, (err, value) => {
      if (err) {
        console.log(err.message);
        throw createError.InternalServerError();
      }
      console.log(value);
    });

    res.status(200).json({
      status: "Deletion successfully",
    });
  } catch (error) {
    next(error);
    return;
  }
};

const authCallback = {
  register,
  login,
  refreshToken,
  logout,
};

module.exports = authCallback;
