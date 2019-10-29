var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// Root Route
router.get("/", function(req, res){
	res.render("landing");
});

// Show register form
router.get("/register", function(req, res){
	res.render("register");
});

// Handle Sign-Up Logic
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
  			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to Bulgaria's Sigths " + user.username);
			res.redirect("/sigths");
		});
	});
});

// Show Login Form
router.get("/login", function(req, res){
	res.render("login");
});

// Handle Login Logic
router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/sigths",
		failureRedirect: "/login"
	}), function(req, res){
});

// Logout Route
router.get("/logout", function(req,res){
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/sigths");
});

module.exports = router;