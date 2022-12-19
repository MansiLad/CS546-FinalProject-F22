const check = document.querySelector("#checkbox");
const ids = document.getElementById("id");
const id = ids.value;
const check2 = document.querySelector("#checkbox2");
console.log(id);
// location.reload();
check.addEventListener("change", function (e) {
  const formdata = new FormData();
  if (check.checked) {
    check2.checked = false;
    console.log("checked");
    formdata.append("id", id);
    fetch("/adminauth", {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id: id}),
    })
      .then((res) => {console.log(res)
      window.location.href = "http://localhost:3000/adminauth"})
      .catch((err) => console.log({ err }));
  } 
   
});

check2.addEventListener("change", function (e) {
  const formdata = new FormData();
  if (check2.checked) {
    check.checked = false;
    console.log("disapprove");
    formdata.append("id", id);
    fetch("/adminauthno", {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id: id}),
    })
      .then((res) => {console.log(res)
      window.location.href = "http://localhost:3000/adminauth"})
      .catch((err) => console.log({ err }));
  } 
   
});