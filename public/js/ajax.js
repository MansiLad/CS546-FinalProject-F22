// (function($){
//     const staticForm = document.getElementById("review-form");
//     if(staticForm){
//         const rev_ele = document.getElementById("rev")
//         const ul = document.getElementById("rev-ul");
//         const errorContainer = document.getElementById('error-container');
//     const errorTextElement = errorContainer.getElementsByClassName(
//       'text-goes-here'
//     )[0];
//         const resultContainer = document.getElementById('result-container');
//     const resultTextElement = resultContainer.getElementsByClassName(
//       'text-goes-here'
//     )[0];
//     staticForm.addEventListener('submit',event=>{
//         event.preventDefault();
//         try{
//             resultContainer.hidden = true;
//             const rev_val = rev_ele.value;
//             if(rev_val){
//                 var requestConfig={
//                     method:'POST',
//                     url:'/prop/reviews/:id',
//                     contentType: 'application/json',
//                     data:JSON.stringify({review: rev_val})
//                 }
//             }
//             $.ajax(requestConfig).then(function(resposeMessage){
//                 const li = document.createElement("li");
//                 li.appendChild(document.createTextNode(resposeMessage));  
//                 ul.appendChild(li);
//                 resultContainer.hidden = false; 
//             })
                     
//         }catch(e){
//             const message = typeof e === 'string' ? e : e.message;
//                 //console.error(e)
//                 errorTextElement.textContent = message;
//                 errorContainer.hidden = false;
//         }
//     })
//     }

// })(window.jQuery);


(function($){
    var myNewTaskForm = $('#new-item-form'),
    newDecriptionArea = $('#new-task-review'),
    todoArea = $('#todo-area');
    myNewTaskForm.submit(function(event){
        event.preventDefault();
    var newDescription = newDecriptionArea.val();
    var newContent = $('#new-content');
    if(newDescription){
        var currentLink = $(this);
        console.log(currentLink)
      var currentId = currentLink.data('id');
      console.log(currentId)
      function getParameterValue(paramName) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
          if (xhr.readyState == XMLHttpRequest.DONE) {
            var params = new URLSearchParams(xhr.responseURL);
            console.log(params.get(paramName));
          }
        }
        xhr.open("GET", "/prop/reviews?propId=paramValue", true);
        xhr.send();
      }
console.log(getParameterValue(propId))
        var requestConfig = {
            method: 'POST',
            url: '/prop/reviews/' + currentId,
            contentType: 'application/json',
            data: JSON.stringify({
              description: newDescription
            })
          }
          $.ajax(requestConfig).then(function (responseMessage) {
            console.log(responseMessage);
            var newElement = $(responseMessage);
            todoArea.append(newElement)
            //                alert("Data Saved: " + msg);
          });
    }
    })
   
})(window.jQuery);



// function refreshDiv() {
//     var currentLink = $(this);
//           var currentId = currentLink.data('id');
//     $.ajax({
//       url: '/prop/reviews/' + currentId,
//       success: function(data) {
//         $('#new-content').html(data);
//       }
//     });
//   }
  
  //setInterval(refreshDiv, 1000); // Refresh the div every 1 second (1000 milliseconds)