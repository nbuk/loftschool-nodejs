require('dotenv').config();
const express = require("express");
const fs = require('fs');
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const UPLOAD_DIR = require('./core/config').UPLOAD_DIR;
const app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(
    session({
        secret: "loftschool",
        key: "sessionkey",
        cookie: {
            path: "/",
            httpOnly: true,
            maxAge: 10 * 60 * 1000,
        },
        saveUninitialized: true,
        resave: true,
    })
);
app.use(flash());

app.set("views", "./source/template");
app.set("view engine", "pug");

app.use("/", require("./routes/index"));



if(!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR)
}

app.listen(8080, () => {
    console.log("Server started on localhost:8080");
});
