var express = require("express");
var router = express.Router();
var Sigth = require("../models/sigth");
var middleware = require("../middleware");

// INDEX - Show all Sigths
router.get("/", function(req, res){
	// Get all sigths from DB
	Sigth.find({}, function(err, allSigths){
		if(err){
			console.log(err);
		} else{
			res.render("sigths/index", {sigths: allSigths});
		}
	});
});

//CREATE - add new sigth to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to sigths array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newSigth = {name: name, image: image, description: desc, author:author}
    // Create a new sigth and save to DB
    Sigth.create(newSigth, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to sigths page
            console.log(newlyCreated);
            res.redirect("/sigths");
        }
    });
});


// NEW - show form to create new Sigth
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("sigths/new");
});

// SHOW - shows more info about a Sigth
router.get("/:id", function(req, res){
	// Find the campgroound with provided ID
	Sigth.findById(req.params.id).populate("comments").exec(function(err, foundSigth){
		if(err){
			console.log(err);
		} else{
			// Render show template with that sigth
			res.render("sigths/show", {sigth: foundSigth});
		}
	});
});

// EDIT sigth route
router.get("/:id/edit", middleware.checkSigthOwnership, function(req, res){
	Sigth.findById(req.params.id, function(err, foundSigth){
		res.render("sigths/edit", {sigth: foundSigth});		
	});
});

// UPDATE SIGTH ROUTE
router.put("/:id", function(req, res){
    var newData = {name: req.body.name, image: req.body.image, description: req.body.desc};
    Sigth.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, sigth){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/sigths/" + sigth._id);
        }
    });
});

// DESTROY sigth route
router.delete("/:id", middleware.checkSigthOwnership, function(req, res){
	Sigth.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/sigths");
		} else {
			res.redirect("/sigths");
		}
	});
});

module.exports = router;