var express = require("express");
var router = express.Router({mergeParams: true});
var Sigth = require("../models/sigth");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
	// Find sigth by ID
	Sigth.findById(req.params.id, function(err, sigth){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {sigth: sigth});
		}
	});
});

// Comments  Create
router.post("/", middleware.isLoggedIn, function(req, res){
	// Lookup sigth using ID
	Sigth.findById(req.params.id, function(err, sigth){
		if(err){
			console.log(err);
			res.redirect("/sigths");
		} else {
			// Create new comment
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error", "Something went wrong!");
					console.log(err);
				} else {
					// Add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					// Save comment
					comment.save();
					// Connect new comment to sigth
					sigth.comments.push(comment);
					sigth.save();
					// Redirect to sigth show page
					req.flash("success", "Successfully added comment!");
					res.redirect("/sigths/" + sigth._id);
				}
			});
		}
	});
});

// Comments Edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		} else{
			res.render("comments/edit", {sigth_id: req.params.id, comment: foundComment});
		}
	});
});

// Comment Update
router.put("/:comment_id",middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		}else {
			res.redirect("/sigths/" + req.params.id);
		}
	});
});

// Comment Delete
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		}else {
			req.flash("success", "Comment deleted!");
			res.redirect("/sigths/" + req.params.id);
		}
	});
});

module.exports = router;
