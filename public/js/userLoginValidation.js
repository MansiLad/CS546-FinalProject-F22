const loginform = document.getElementById('userlogin')
const docemail = document.getElementById('emailInput')
const docpassword = document.getElementById('passwordInput')

loginform.addEventListener('submit', event => {
	event.preventDefault();
	checkInputs();
    loginform.submit();
});

function checkInputs() {
    if(loginform) {
        const email = docemail.value.trim()
        const passoword = docpassword.value.trim()

        if(!email){
            setErrorFor(docemail, 'Email cannot be empty')
        } else if(typeof email !== 'string') {
            setErrorFor(docemail, 'Email should be of strings')
        } else if(!emailCheck(email)) {
            setErrorFor(docemail, 'Enter valid EmailId')
        } else {
            setSuccessFor(docemail)
        }

        if(!password) {
            setErrorFor(docpassword, 'Password cannot be blank');
        } else if (passoword.length === 0) {
            setErrorFor(docpassword, 'Password just cannot be empty or spaces')
        } else if (passoword.length < 6) {
            setErrorFor(docpassword, 'Password should be atleast of length 6')
        } else if(!passwordCheck(password)) {
            setErrorFor(docpassword, 'Enter valid password')
        } else {
            setSuccessFor(docpassword)
        }
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

function emailCheck(email) 
{
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
}


    
