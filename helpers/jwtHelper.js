const JWT = require("jsonwebtoken");
const createError = require("http-errors");

const client = require("../helpers/initRedis");

const accessTokenFunc = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: "1d",
      audience: userId,
    };
    JWT.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err.message);
        reject(createError.InternalServerError());
        return;
      }
      resolve(token);
    });
  });
};

const verifyTokenFunc = (req, res, next) => {
  if (!req.headers["authorization"]) return next(createError.Unauthorized());
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];
  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      const message =
        err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
      return next(createError.Unauthorized(message));
    } else {
      req.payload = payload;
      next();
    }
  });
};

const refreshTokenFunc = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const options = {
      expiresIn: "1y",
      audience: userId,
    };
    JWT.sign(payload, secret, options, async (err, token) => {
      if (err) {
        console.log(err.message);
        reject(createError.InternalServerError());
        return;
      }

      //use redis
      await client.set(
        userId,
        token,
        {
          EX: 365 * 24 * 60 * 60,
        },
        (err, reply) => {
          if (err) {
            console.log(err.message);
            reject(createError.InternalServerError());
            return;
          }
        }
      );

      // const value = await client.get(userId);
      // console.log(value);
      resolve(token);
    });
  });
};

const verifyRefreshTokenFunc = (refreshToken) => {
  return new Promise((resolve, reject) => {
    JWT.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, payload) => {
        if (err) return reject(createError.Unauthorized());
        const userId = payload.aud;

        const value = await client.get(userId, (err, result) => {
          if (err) {
            console.log(err.message);
            reject(createError.InternalServerError());
            return;
          }
          return result;
        });
        if (refreshToken === value) {
          return resolve(userId);
        } else {
          reject(createError.Unauthorized());
        }
      }
    );
  });
};

module.exports = {
  signAccessToken: accessTokenFunc,
  verifyAccessToken: verifyTokenFunc,
  signRefreshToken: refreshTokenFunc,
  verifyRefreshToken: verifyRefreshTokenFunc,
};
