const check = document.querySelector("#checkbox");
const ids = document.getElementById("id");
const id = ids.value;
console.log(id);
// location.reload();
check.addEventListener("change", function (e) {
  const formdata = new FormData();
  if (check.checked) {
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
  } else {
    console.log("unchecked");
  }
});
