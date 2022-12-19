

(function($){
  var myNewTaskForm = $('#new-item-form'),
  newDecriptionArea = $('#review'),
  todoArea = $('#todo-area');
  ulArea= $('#rev_ul');
  myNewTaskForm.submit(function(event){
      event.preventDefault();
  var newDescription = newDecriptionArea.val();
  if(newDescription){
    var pageURL = $(location).attr("pathname");
    console.log(pageURL)
      var requestConfig = {
          method: 'POST',
          url: pageURL,
          contentType: 'application/json',
          data: JSON.stringify({
            description: newDescription
          })
        }
        $.ajax(requestConfig).then(function (responseMessage) {
         // console.log(responseMessage);
          var newElement = $(responseMessage);

          ulArea.append(newElement)
          //                alert("Data Saved: " + msg);
        });
  }
  })
 
})(window.jQuery);

