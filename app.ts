// Import the express in typescript file
import express from "express";
import dotenv from "dotenv";
import { engine } from "express-handlebars";
import path from "path";

// parse ENV
dotenv.config();

// Initialize the express engine
const app: express.Application = express();

// Load body parse
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Load static
app.use(express.static(path.join(__dirname, "./src/public")));

// Load engine
app.engine(".hbs", engine({extname: '.hbs'}));
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "./src/resources/views"));

if (process.env.NODE_ENV === "development") {
  app.use(require("morgan")("combined"));
}

// routes
app.use(require('./src/routes'));

// Server setup
app.listen(process.env.APP_PORT, () => {
  console.log(
    `${process.env.APP_NAME} is listening http://${process.env.APP_DOMAIN}:${process.env.APP_PORT}/`
  );
});
