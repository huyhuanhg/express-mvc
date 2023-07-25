// Import the express in typescript file
import express from "express";
import dotenv from "dotenv";

// parse ENV
dotenv.config()

// Initialize the express engine
const app: express.Application = express();

// Server setup
app.listen(process.env.APP_PORT, () => {
  console.log(`${process.env.APP_NAME} is listening http://${process.env.APP_DOMAIN}:${process.env.APP_PORT}/`);
});
