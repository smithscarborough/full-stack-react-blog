// this is our main server file (app.js)

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// add the session npm downloads so that we can encrypt user password
const session = require('express-session')
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const models = require('./models');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');

var app = express();

const store = new SequelizeStore({ db: models.sequelize });
// FYI: below is actually middleware, and is responsible for setting up the session and saving the session
app.use(
    session({
        secret: 'pancakes',
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);
store.sync();
// FYI: middleware continued
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/', indexRouter);
// version the API so that if/when you come out with a version 2, the old one will still work for people who've integrated it into their own apps (this is just a convention to follow):
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/posts', postsRouter);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'cli/build', 'index.html'));
})

module.exports = app;
