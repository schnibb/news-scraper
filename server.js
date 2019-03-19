//requirements
var express = require("express");
var mongojs = require("mongojs");
var axios = require("axios");
var cheerio = require("cheerio");

var app = express();

//databse connection variables
var databaseUrl = "news_scrapper_db";
var collections = ["news_stories"];

//database connection
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
    console.log("Database Error: ", error);
});

app.get("/", function(req, res) {
    var $ = cheerio.load(response.data);
    $(".WireStory").each(function(i, element) {
        var title = $(element).children("a").text();
        var link = $(element).children("a").attr("href");
        var image = $(element).children("img").attr("srcset");
        var blurb = $(element).children("p").text();

        if (title && link && image && blurb) {
            db.news_stories.insert({
                    title: title,
                    link: link,
                    image: image,
                    blurb: blurb
                },
                function(err, inserted) {
                    if (err) {
                        console.log(err);
                    } else(
                        console.log(inserted);
                    )
                });
        }
    });
    res.send();
});

//listen on port 3000
app.listen(3000, function() {
    console.log("App running on port 3000!");
});