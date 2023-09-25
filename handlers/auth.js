const db = require("../db");
const bcrypt = require("bcryptjs");

//create user
const register = async (req, res) => {
  try {
    const { fullname, email, password, repeatPassword } = req.body;

    if (!email || !password || !fullname) {
      return res.status(422).json({ error: "Please fill all fields" });
    }

    const user = await db.query("SELECT * from users where email=$1", [email]);

    //console.log(user.rows.length);

    if (user.rows.length !== 0) {
      return res.status(422).json({ error: "User already exists" });
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
      "INSERT INTO users (full_name, email, password) values ($1, $2, $3)",
      [fullname, email, hashedPassword]
    );

    //console.log(result);

    res.status(201).json({
      status: "Proceed to login!",
    });
  } catch (error) {
    console.log(error);
    return res.status(422).json({ error: "Something went wrong!" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({ error: "Please fill all fields" });
    }

    const user = await db.query("SELECT * from users where email=$1", [email]);

    if (user.rows.length === 0) {
      return res.status(404).json({ error: "Invalid credentials" });
    }

    const doMatch = await bcrypt.compare(password, user.rows[0].password);

    if (doMatch) {
      if (!doMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      res.status(201).json({
        status: "Login Successful!",
        user: user.rows,
      });
    } else {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    return res.status(422).json({ error: "Something went wrong!" });
  }
};

const authCallback = {
  register,
  login,
};

module.exports = authCallback;
