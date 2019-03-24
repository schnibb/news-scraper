$.getJSON("/newsStories", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
        console.log(data[i]);
        // Display the apropos information on the page
        $("#stories").append("<br /><div class='card border-dark'><h3 data-id='" + data[i]._id + "' class = 'card-header'> " + data[i].title + "</h3> <div class = 'card-body'><h5 class = 'card-title' > " + data[i].blurb + " </h5> <p class = 'card-text' > With supporting text below as a natural lead - in to additional content. </p> <a href = 'https://apnews.com" + data[i].link + "' class = 'btn btn-primary' > Go to the story </a> <div id='" + data[i]._id + "'</div></div></div>");
    }
});

// Whenever someone clicks a p tag
$(document).on("click", "h3", function() {
    // Empty the notes from the note section
    var thisId = $(this).attr("data-id");
    console.log(thisId);
    $("#" + thisId).empty();
    // Save the id from the p tag

    // Now make an ajax call for the Article
    $.ajax({
            method: "GET",
            url: "/notes/" + thisId
        })
        // With that done, add the note information to the page
        .then(function(data) {
            console.log(data);
            // The title of the article
            for (var i = 0; i < data.length; i++) {
                $("#" + thisId).append("<h2>" + data[i].title + "</h2>");
            }
            // An input to enter a new title
            $("#" + thisId).append("<input type='text' class='form-control' placeholder='title' id='titleinput' name='title' >");
            // A textarea to add a new note body
            $("#" + thisId).append("<textarea class='form-control' placeholder='note' id='bodyinput' name='body'></textarea>");
            // A button to submit a new note, with the id of the article saved to it
            $("#" + thisId).append("<button type='button' class='btn btn-success' data-id='" + thisId + "' id='savenote'>Save Note</button>");

            // If there's a note in the article
            if (data.notes) {
                // Place the title of the note in the title input
                $("#titleinput").val(data.notes.title);
                // Place the body of the note in the body textarea
                $("#bodyinput").val(data.notes.body);
            }
        });
});

$(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    console.log(thisId);

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
            method: "POST",
            url: "/notes",
            data: {
                // Value taken from title input
                title: $("#titleinput").val(),
                // Value taken from note textarea
                body: $("#bodyinput").val(),
                newsStoryId: thisId,
            }
        })
        // With that done
        .then(function(data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#notes").empty();
        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});