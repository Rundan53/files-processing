const express = require("express");
const MongoStore = require("connect-mongo");
const cors = require("cors");

const mongoSanitizer = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");
const config = require("./config/config");

const app = express();

// const MONGO_URI = config.mongoConnectionURI

//request parsing middlewares
app.use(
  cors({
    origin: config.frontendOrigin,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"], // Add the headers you want to accept
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
//db sanitizing middleware
app.use(mongoSanitizer());

//cookie parsing middleware
app.use(cookieParser());

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: config.mongoConnectionURI,
      stringify: false,
    }),
    resave: false, // required: force lightweight session keep alive (touch)
    saveUninitialized: false, // recommended: only save session when data exists
    secret: "keyboard cat",
    maxAge: 30 * 24 * 3600 * 1000,
    rolling: true,
    cookie: {
      domain: "localhost",
      secure: false,
      httpOnly: true,
      maxAge: 30 * 24 * 3600 * 1000,
      sameSite: false,
    },
  }),
);

module.exports = app;
