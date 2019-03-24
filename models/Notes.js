var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NotesSchema = new Schema({
    title: String,
    body: String,
    newsStoryId: String
});

var Notes = mongoose.model("Notes", NotesSchema);

// Export the Note model
module.exports = Notes;