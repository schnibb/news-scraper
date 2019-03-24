//requirements
var express = require("express");
var mongoose = require("mongoose");
var logger = require("morgan");

//scrapping tools
var axios = require("axios");
var cheerio = require("cheerio");

//require models
var db = require("./models");
var PORT = 3000;

//initialize express
var app = express();

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//MongoDB connection
mongoose.connect("mongodb://localhost/newsScrapper", { useNewUrlParser: true });

app.get("/scrapeNews", function(req, res) {
    axios.get("https://apnews.com/").then(function(response) {
        var $ = cheerio.load(response.data);
        $("div.WireStory").each(function(i, element) {
            var result = {};
            result.title = $(this)
                .find("h1")
                .text();
            result.link = $(this)
                .find("a.headline")
                .attr("href");
            result.blurb = $(this)
                .find("p")
                .text();
            result.image = $(this)
                .find("img")
                .attr("src");


            db.NewsStory.create(result)
                .then(function(dbNewsStory) {
                    console.log(dbNewsStory);
                })
                .catch(function(err) {
                    console.log(err);
                });
        });
        res.send("scrape complete");
    });
});

app.get("/newsStories", function(req, res) {
    db.NewsStory.find({})
        .then(function(dbNewsStory) {
            res.json(dbNewsStory);
        })
        .catch(function(err) {
            res.json(err);
        });
});

app.get("/newsStories/:id", function(req, res) {
    db.NewsStory.findOne({ _id: req.params.id })
        .populate("Notes")
        .then(function(dbNewsStory) {
            res.json(dbNewsStory);
        })
        .catch(function(err) {
            res.json(err);
        });
});

app.post("/newsStories/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Notes.create(req.body)
        .then(function(dbNotes) {
            return db.NewsStory.findOneAndUpdate({ _id: req.params.id }, { notes: dbNotes._id }, { new: true });
        })
        .then(function(dbNewsStory) {
            res.json(dbNewsStory);
        })
        .catch(function(err) {
            res.json(err);
        });
});

app.get("/notes/:id", function(req, res) {
    db.Notes.find({ newsStoryId: req.params.id })
        .then(function(dbNotes) {
            res.json(dbNotes);
        });
});

app.post("/notes", function(req, res) {
    db.Notes.create(req.body)
        .then(function(dbNotes) {
            res.json(dbNotes);
        });
});


//listen on port 3000
app.listen(3000, function() {
    console.log("App running on port 3000!");
});