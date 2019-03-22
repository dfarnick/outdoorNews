 
  $.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {      
      $("#articles").append("<div class='addnote' data-id='" + data[i]._id + "'><a href='" + data[i].link + "'><h4>" + data[i].title + "</h4></a><p>" + data[i].summary + "</p></div>");
    }
  });  

$("#scrape").on("click", function() {  
  $.ajax({
    method: "GET",
    url: "/scrape"
})
    .then(function (data) {
        console.log(data);
    });
});

// Whenever someone clicks a p tag
$(document).on("click", ".addnote", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    //add the note information to the page
    .done(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h4>" + data.title + "</h4>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      if (data.note) {
        
        $("#titleinput").val(data.note.title);     
        $("#bodyinput").val(data.note.body);
      }
    });
});

//savenote button
$(document).on("click", "#savenote", function() {  
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
       
        .then(function (data) {        
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


