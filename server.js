require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoute = require("./routes/auth.js");
const userRoute = require("./routes/user.js");

const app = express();

//middleware
app.use(express.json());
app.use(cors());
//app.use(morgan("common"));
// app.use((req, res, next) => {
//   console.log("middleware works");
//   next();
// });

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
