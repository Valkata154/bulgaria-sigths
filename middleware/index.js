// All the middleware goes here
var Sigth = require("../models/sigth");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkSigthOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Sigth.findById(req.params.id, function(err, foundSigth){
			if(err){
				req.flash("error", "Sigth not found!");
				res.redirect("/sigths");
			} else {
				// Does the user own the sigth
				if(foundSigth.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error", "You don't have permission to do that!");
					res.redirect("back");
				}
			}
		});
	}else {
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("/sigths");
			} else {
				// Does the user own the comment
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error", "You don't have permission to do that!");
					res.redirect("back");
				}
			}
		});
	}else {
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that!");
	res.redirect("/login");
}


module.exports = middlewareObj;