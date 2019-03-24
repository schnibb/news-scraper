var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NewsStorySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    blurb: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    }
});

var NewsStory = mongoose.model("NewsStory", NewsStorySchema);

module.exports = NewsStory;