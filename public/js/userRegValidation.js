const regform = document.getElementById('userreg')
const docfname = document.getElementById('firstname')
const doclname = document.getElementById('lastName')
const docgendermale = document.getElementById('male')
const docgenderfemale = document.getElementById('female')
const docgenderother = document.getElementById('other')
const docemail = document.getElementById('email')
const doccity = document.getElementById('city')
const docstate = document.getElementById('state')
const docphone = document.getElementById('phoneNumber')
const doctypebuyer = document.getElementById('buyer')
const doctypeseller = document.getElementById('seller')
const docpassword = document.getElementById('password')

form.addEventListener('submit', event => {
	event.preventDefault();
	checkInputs();
    form.submit()
});


function checkInputs() {
    if(regform) {
        const fname = docfname.value.trim()


        //validae each input, 
        //check for radiio and dropdown validation
        


    }

}

function setErrorFor(input, message) {
	const formControl = input.parentElement;
	const small = formControl.querySelector("small");
	formControl.className = "form-control error";
	small.innerText = message;
}

function setSuccessFor(input) {
	const formControl = input.parentElement;
    console.log(formControl)
	formControl.className = "form-control success";
}


    
