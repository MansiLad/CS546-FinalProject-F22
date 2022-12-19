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
      .then((res) => {console.log(res)
        window.location.href = "http://localhost:3000/manageRentals"})
        .catch((err) => console.log({ err }));
    } else {
      formdata.append("file", fileInput);
    }

    // console.log(files.length);
  });
};
