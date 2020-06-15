require('dotenv').config();
const path = require('path');
const Koa = require('koa');
const Pug = require('koa-pug');
const session = require('koa-session');
const koaBody = require('koa-body');
const static = require('koa-static');
const router = require('./routes');
const app = new Koa();

const PORT = process.env.PORT || 8080;

const pug = new Pug({
    app,
    viewPath: path.join(process.cwd(), './source/template'),
});

app.use(static(path.join(process.cwd(), 'public')));
app.use(
    koaBody({
        multipart: true,
        formidable: {
            uploadDir: path.join(process.cwd(), './public/assets/img/'),
        },
    }),
);

app.keys = ['secret key'];

app.use(
    session(
        {
            maxAge: 10 * 60 * 1000,
        },
        app,
    ),
);

app.use(router.routes());

app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = 500;
        ctx.body = err.message;
        ctx.app.emit('error', err, ctx);
    }
});

app.on('error', (err, ctx) => {
    console.error(err);
});

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
