const { createClient } = require("redis");

const client = createClient({
  password: "5eUtjBCCv0dXDNE76uXhG7ajyZAvHjcA",
  socket: {
    host: "redis-16008.c90.us-east-1-3.ec2.cloud.redislabs.com",
    port: 16008,
  },

  //   url: "redis://default:5eUtjBCCv0dXDNE76uXhG7ajyZAvHjcA@redis-16008.c90.us-east-1-3.ec2.cloud.redislabs.com:16008",
});

const startClient = async () => {
  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();
};

startClient();

module.exports = client;
