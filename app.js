const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
var path = require('path');

const flash = require('connect-flash');
const session = require('express-session');

const passport = require('passport')

const app = express();

//Passport configur
require('./config/passport')(passport);

// DB CONFIGUR
const db = require('./config/keys').MongoURI;

//Connect to db
mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB Connected..');
    })
    .catch((err) => {
        console.log(err);
    });

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//BodyParser
app.use(express.urlencoded({ extended: false }));

//Express Session Middlewire
app.use(
    session({
        secret: 'big secret',
        resave: true,
        saveUninitialized: true,
    }),
);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flashe
app.use(flash());

// Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
		next();

});

//ROUTES
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('App listening on port ' + PORT + '!');
});
