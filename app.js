const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
  secret: 'loftschool',
    key: 'sessionkey',
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: 10 * 60 * 1000
    },
    saveUninitialized: false,
    resave: false
}))

app.set('views', './source/template');
app.set('view engine', 'pug');

app.use('/', require('./routes/index'));

app.listen(8080, () => {
  console.log('Server started on localhost:8080');
});