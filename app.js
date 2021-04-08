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

var app = express();

const store = new SequelizeStore({ db: models.sequelize })
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
// FYI: middleware cont'd
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', indexRouter);
app.use('/api/v1/users', usersRouter);

module.exports = app;
