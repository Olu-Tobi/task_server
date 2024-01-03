const app = require("./index");

const { signAccessToken } = require("./helpers/jwtHelper");

const supertest = require("supertest");

// describe("POST /api/v1/auth/login", () => {
//   it("should return login response object", async () => {
//     const res = await supertest(app)
//       .post("/api/v1/auth/login")
//       .send({
//         email: "tobidaramola77@gmail.com",
//         password: "12345678",
//       })
//       .set("Accept", "application/json")
//       .expect("Content-Type", /json/);
//     expect(res.statusCode).toBe(200);
//     expect(res.body.user[0].email).toEqual("tobidaramola77@gmail.com");
//   });
// });

describe("POST /api/v1/auth/register", () => {
  it("should return login response object", async () => {
    const res = await supertest(app)
      .post("/api/v1/auth/register")
      .send({
        fullname: "Tobi Daramola",
        email: "tobidaramola77@gmail.com",
        password: "12345678",
        repeatPassword: "12345678",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);
    if (res.statusCode === 200) {
      expect(res.statusCode).toBe(200);
    } else {
      expect(res.statusCode).toBe(409);
    }
  });
});

describe("testing creation of access token", () => {
  it("should return a token", async () => {
    const accTkn = await signAccessToken("4");
    expect(typeof accTkn).toBe("string");
  });
});

describe("GET /api/v1/user/1", () => {
  it("should return login response object", async () => {
    const res = await supertest(app)
      .get("/api/v1/user/1")
      .set(
        "Authorization",
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTcwMDQzNjEsImV4cCI6MTY5NzA5MDc2MSwiYXVkIjoiMSJ9._f9VGn8a126LntCt9cGSTk5uQNa4u8cLrAWMu7H2wFQ"
      );

    expect(res.statusCode).toBe(200);
  });
});

describe("POST /api/v1/auth/refresh-token", () => {
  it("should return new tokens", async () => {
    const res = await supertest(app)
      .post("/api/v1/auth/refresh-token")
      .send({
        refreshToken:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTcwMDQzNjEsImV4cCI6MTcyODU2MTk2MSwiYXVkIjoiMSJ9.3yVHKQikd419zmfl4iBDhZKs6Lkd55eXuoS-thegrdo",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);

    expect(res.statusCode).toBe(200);
  });
});

describe("DELETE /api/v1/auth/logout", () => {
  it("should return new tokens", async () => {
    const res = await supertest(app)
      .post("/api/v1/auth/logout")
      .send({
        refreshToken:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTcwMDQzNjEsImV4cCI6MTcyODU2MTk2MSwiYXVkIjoiMSJ9.3yVHKQikd419zmfl4iBDhZKs6Lkd55eXuoS-thegrdo",
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/);

    expect(res.statusCode).toBe(200);
  });
});
