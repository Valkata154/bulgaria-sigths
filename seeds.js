var mongoose = require("mongoose");
var Sigth = require("./models/sigth");
var Comment   = require("./models/comment");
 
var data = [
    {
        name: "Bansko", 
        image: "https://suitcasemag.com/wp-content/uploads/2017/03/bansko-bulgaria-1.jpg",
        description: "Bansko is a town in southwestern Bulgaria, located at the foot of the Pirin Mountains at an elevation of 1200m above sea level. It is a popular ski resort.",
		
    },
    {
        name: "Belogradchik Rocks", 
        image: "http://www.whispersofstyle.com/wordpress/wp-content/uploads/2015/08/belogradchik_rocks-1-1024x680.jpg",
        description: "The Belogradchik Rocks are a group of strangely shaped sandstone and conglomerate rock formations located on the western slopes of the Balkan Mountains (Stara Planina) near the town of Belogradchik in northwest Bulgaria. The rocks vary in color from primarily red to yellow; some of the rocks reach up to 200 m in height. Many rocks have fantastic shapes and are associated with interesting legends."
    },
    {
        name: "Varna", 
        image: "https://ttnstaticfile.blob.core.windows.net/media/communities/headers/varna.large.jpg",
        description: "Bulgaria’s second city and maritime capital, Varna is the most interesting and cosmopolitan town on the Black Sea coast"
    }
]
 
function seedDB(){
   //Remove all sigths
   Sigth.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed sigths!");
        Comment.remove({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few sigths
            data.forEach(function(seed){
                Sigth.create(seed, function(err, sigth){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a sigth");
                        //create a comment
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author: "Homer"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    sigth.comments.push(comment);
                                    sigth.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    }); 
    //add a few comments
}
 
module.exports = seedDB;