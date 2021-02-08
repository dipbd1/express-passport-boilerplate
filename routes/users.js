const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//User model
const User = require('../models/User');

//Login Page
router.get('/login', (req, res) => {
    res.render('login');
});

//Register Page
router.get('/register', (req, res) => {
    res.render('register');
});

// Register Handle
router.post('/register', async (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];
    // Check Required Fields
    if (!name || !email || !password || !password2) {
        errors.push({ mg: 'Please fill in all the fields' });
    }
    if (password !== password2) {
        errors.push({ mg: 'Password do not match' });
    }
    if (password.length < 6) {
        errors.push({ mg: 'Password should be at least 6 characters' });
    }
    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2,
        });
    } else {
        // res.send('pass')
        // validation pass
        User.findOne({ email }).then(async (user) => {
            if (user) {
                errors.push({ mg: 'Email already registerd' });
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2,
                });
            } else {
                // res.send("It's sign of a successfull Registration")
                const newUser = await User({
                    name,
                    email,
                    password,
                });
								
								bcrypt.genSalt(10,(err, salt)=>{
									bcrypt.hash(newUser.password, salt,(err, hash)=>{
										if(err) throw err;
										newUser.password = hash;
										newUser.save()
											.then(user =>{
												req.flash('success_msg', 'You are now registered and can login')
												res.redirect('/users/login')
											})
											.catch(err => console.log(err))
									})
								})
            }
        });
    }
});

//Login Handler
router.post('/login', (req, res, next) => {

	passport.authenticate('local', {
		successRedirect: '/dashboard',
		failureRedirect: '/users/login',
		failureFlash: true
	})(req, res, next)
})

router.get('/logout', async(req, res) => {
	req.logout();
	req.flash('success_msg', "You are now logged out");
	res.redirect('/users/login')
})

module.exports = router;
