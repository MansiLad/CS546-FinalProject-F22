const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');

form.addEventListener('submit', e => {
	e.preventDefault();
	
	checkInputs();
});

function checkInputs() {
	// trim to remove the whitespaces
	const usernameValue = username.value.trim();
	const emailValue = email.value.trim();
	const passwordValue = password.value.trim();
	const password2Value = password2.value.trim();
	
	if(usernameValue === '') {
		setErrorFor(username, 'Username cannot be blank');
	} else {
		setSuccessFor(username);
	}
	
	if(emailValue === '') {
		setErrorFor(email, 'Email cannot be blank');
	} else if (!isEmail(emailValue)) {
		setErrorFor(email, 'Not a valid email');
	} else {
		setSuccessFor(email);
	}
	
	if(passwordValue === '') {
		setErrorFor(password, 'Password cannot be blank');
	} else {
		setSuccessFor(password);
	}
	
	if(password2Value === '') {
		setErrorFor(password2, 'Password2 cannot be blank');
	} else if(passwordValue !== password2Value) {
		setErrorFor(password2, 'Passwords does not match');
	} else{
		setSuccessFor(password2);
	}
}

function setErrorFor(input, message) {
	const formControl = input.parentElement;
	const small = formControl.querySelector('small');
	formControl.className = 'form-control error';
	small.innerText = message;
}

function setSuccessFor(input) {
	const formControl = input.parentElement;
	formControl.className = 'form-control success';
}
	
function isEmail(email) {
	return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
}


/* //has the scripts fro client side validation
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const validation = require('.../helpers');


(function () {

    //for user login
    async function userLogin(validUsername, validPassword) {

        const usersindb = await users();

        const checkusername = await usersindb.findOne({ email: validUsername });
        if (!checkusername) throw "Either the username or password is invalid";
        if (!password_check) throw "Either the username or password is invalid";
    }

    const userlogindata = document.getElementById("userlogin")

    if(userlogindata) {
        const username = document.getElementById("emailInput")
        const password = document.getElementById("passwordInput")
        console.log(username)
            if(!username)   throw 'Provide a username'
            if(!password)   throw 'Provide a password'
        const errorContainer = document.getElementById('error')
        const errorTextElement = errorContainer.getElementsByClassName('text-goes-here')[0]

        data.addEventListener('submit', event => {
            event.preventDefault()
            try {
                errorContainer.hidden = true;

                const successLogin = userLogin(username, password)
                
            }
            catch(e) {
                const message = typeof e === 'string' ? e : e.message
                const errormessage = "Error: Check your inputs again"
                errorTextElement.textContent = e;
                errorContainer.hidden = false
            }
        });
    }

    //for user reg
    //make req changes -mansi
    async function userreg(validUsername, validPassword) {

        const usersindb = await users();

        const checkusername = await usersindb.findOne({ email: validUsername });
        if (checkusername) throw "User with this email exist";
      
         const password_check = await bcrypt.compare(validPassword, checkusername.password);
        if (!password_check) throw "Either the username or password is invalid";
         
    }

    const userregdata = document.getElementById("userreg")

    if(userregdata) {
        const username = document.getElementById("emailInput")
        const password = document.getElementById("passwordInput")

        const errorContainer = document.getElementById('error')
        const errorTextElement = errorContainer.getElementsByClassName('text-goes-here')[0]

        data.addEventListener('submit', event => {
            event.preventDefault()
            try {
                errorContainer.hidden = true;
                
                let validUsername = validation.checkUsername(userN);
                let validPassword = validation.checkPassword(pass);

                const successLogin = userreg(validUsername, validPassword)
                
            }
            catch(e) {
                const message = typeof e === 'string' ? e : e.message
                const errormessage = "Error: Check your inputs again"
                errorTextElement.textContent = e;
                errorContainer.hidden = false
            }
        });
    }
    
}) */