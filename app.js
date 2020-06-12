require('dotenv').config();
const path = require('path');
const Koa = require('koa');
const Pug = require('koa-pug');
const session = require('koa-session');
const app = new Koa();
const koaBody = require('koa-body');
const static = require('koa-static');
const router = require('./routes');

const PORT = process.env.PORT || 8080;

const pug = new Pug({
    app,
    viewPath: path.join(process.cwd(), './source/template')
})

app.use(static(path.join(process.cwd(), 'public')));
app.use(koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(process.cwd(), './public/assets/img/')
    }
}));

app.keys = ['secret key'];

app.use(session({
    maxAge: 10 * 60 * 1000
}, app))

app.use(router.routes());

app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = 500;
        ctx.body = err.message;
        ctx.app.emit('error', err, ctx);
    }
})

app.on('error', (err, ctx) => {
    console.error(err);
})

app.listen(PORT);



// const express = require("express");
// const fs = require('fs');
// const path = require('path');
// const bodyParser = require("body-parser");
// const session = require("express-session");
// const uploadDir = require('./core/config').uploadDir;
// const app = express();

// app.use(express.static(__dirname + "/public"));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(
//     session({
//         secret: "loftschool",
//         key: "sessionkey",
//         cookie: {
//             path: "/",
//             httpOnly: true,
//             maxAge: 10 * 60 * 1000,
//         },
//         saveUninitialized: false,
//         resave: false,
//     })
// );

// app.set("views", "./source/template");
// app.set("view engine", "pug");

// app.use("/", require("./routes/index"));

// if(!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir)
// }

// app.listen(8080, () => {
//     console.log("Server started on localhost:8080");
// });
