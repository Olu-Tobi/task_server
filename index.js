require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const createError = require("http-errors");

const authRoute = require("./routes/auth.js");
const userRoute = require("./routes/user.js");
const errorHandler = require("./helpers/errorHelper.js");

const app = express();

//middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
// app.use((req, res, next) => {
//   console.log("middleware works");
//   next();
// });

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);

// app.use(async (req, res, next) => {
//   next(createError.NotFound());
// });

app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

module.exports = app;
