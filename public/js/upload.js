let myForm = document.getElementById("myForm");
let fileInput = document.getElementById("file");
let files = [];
let btn = document.getElementById("btn");
// let params = URLSearchParams.getAll();
let id = document.getElementById("id");
id = id.value
console.log(id);

// let textInput = document.getElementById('text_input');
// let errorDiv = document.getElementById('error');
// let myUl = document.getElementById('list');
// let frmLabel = document.getElementById('formLabel');

if (myForm) {
  const formdata = new FormData();
  btn.addEventListener("click", (event) => {
    // console.log('Form submission fired');
    event.preventDefault();
    // formdata.append("id", id);
    if (fileInput.multiple) {
      for (const file of fileInput.files) {
        formdata.append("file", file);
        formdata.append("id", id);
      }

      fetch("/upload", {
        method: "POST",
        body: formdata,
      })
        .then((res) => console.log(res))
        .catch((err) => console.log({ err }));
    } else {
      formdata.append("file", fileInput);
    }

    // console.log(files.length);
  });
}
// if (textInput.value.trim()) {
//   console.log('has a value of....');
//   textInput.classList.remove('inputClass');
//   errorDiv.hidden = true;
//   frmLabel.classList.remove('error');
//   let li = document.createElement('li');

//   li.innerHTML = textInput.value;
//   myUl.appendChild(li);
//   myForm.reset();
//   textInput.focus();
// } else {
//   textInput.value = '';
//   errorDiv.hidden = false;
//   errorDiv.innerHTML = 'You must enter a value';
//   frmLabel.className = 'error';
//   textInput.focus();
//   textInput.className = 'inputClass';
// }
//   });
// }
