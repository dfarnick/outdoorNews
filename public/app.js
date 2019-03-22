
$("#articles").hide();

// grab the articles as json on "scrape" click
$("#scrape").on("click", function() {
  // show articles div
  $("#articles").show();
  $.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {      
    $("#articles").append("<div class='addnote' data-id='" + data[i]._id + "'><a href='" + data[i].link + "'><h4>" + data[i].title + "</h4></a><p>" + data[i].summary + "</p></div>");
  }
  });  
});

// push saved articles to favorites page on button click
$("#articles").on("click", ".addNote", function() {
  console.log("clicked");
});

// Whenever someone clicks a p tag
$(document).on("click", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      
      title: $("#titleinput").val(),
      
      body: $("#bodyinput").val()
    }
  })
        .done(function(data) {
      console.log(data);
      $("#notes").empty();
    });

  // clear them
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

$(document).on("click", ".delete", function () {

  $.ajax({
      method: "DELETE",
      url: "/api/delete-favorite/" + $(this).attr("id")
  })

  $(this).closest("div").remove();
});


