// Import the express in typescript file
import express from "express";
import dotenv from "dotenv";
import { create, ExpressHandlebars } from "express-handlebars";
import path from "path";
import session from "express-session";
import livereload from "connect-livereload";
import _ from "lodash";

// parse ENV
dotenv.config();

// Initialize the express engine
const app: express.Application = express();

app.use(session({
  secret: "secret",
  resave: true,
  saveUninitialized: true,
  cookie: {
      secure: false,
      maxAge: 6000000
  }
}));

app.use(livereload())

// Load body parse
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Load static
app.use(express.static(path.join(__dirname, "./src/public")));

// Load engine
const hbs = create({
  extname: '.hbs',
  // Specify helpers which are only registered on this instance.
  helpers: {
      err(field: string) {
        if (_.isObject(this.errors) && this.errors.hasOwnProperty(field)) {
          const errors: Record<string, string[]> = this.errors as Record<string, string[]>;
          const result = errors[field].reduce((errHtml, error) => `${errHtml}\n<div class="error">${error}</div>`, '');
          delete errors[field]

          return result
        }

        return '';
      },
      old(field: string) {
        if (_.isObject(this.olds) && this.olds.hasOwnProperty(field)) {
          const olds: Record<string, any> = this.olds as Record<string, any>;
          const result =  olds[field];
          delete olds[field]

          return result
        }

        return null;
      }
  }
});

app.engine(".hbs", hbs.engine);
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
