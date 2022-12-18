const regform = document.getElementById('userreg')
const docfname = document.getElementById('firstName')
const doclname = document.getElementById('lastName')
const docgender = document.getElementById('gender')
const docgendermale = document.getElementById('male')
const docgenderfemale = document.getElementById('female')
const docgenderother = document.getElementById('other')
const docemail = document.getElementById('email')
const doccity = document.getElementById('city')
const docstate = document.getElementById('state')
const docphone = document.getElementById('phoneNumber')
const doctype = document.getElementById('type')
const doctypebuyer = document.getElementById('buyer')
const doctypeseller = document.getElementById('seller')
const docpassword = document.getElementById('password')

regform.addEventListener('submit', event => {
	event.preventDefault();
	checkInputs();
    regform.submit();
});

function checkInputs() {
    if(regform) {
        const fname = docfname.value.trim()
        const lname = doclname.value.trim()
        const male = docgendermale.value.trim()
        const female = docgenderfemale.value.trim()
        const other = docgenderother.value.trim()
        const gender = docgender.value
        const email = docemail.value.trim()
        const city = doccity.value.trim()
        const state = docstate.value.trim()
        const phone = docphone.value.trim()
        const type = doctype.value
        const buyer = doctypebuyer.value.trim()
        const seller = doctypeseller.value.trim()
        const passoword = docpassword.value.trim()

        if(!fname) {
            setErrorFor(docfname, 'First name cannot be empty');
        } else if(typeof fname !== 'string') {
            setErrorFor(docfname, 'First name must be a string')
        } else if(fname.length === 0) {
            setErrorFor(docfname, 'First name just cannot be empty or spaces')
        } else if(fname.length < 3) {
            setErrorFor(docfname, 'First name should be atleast 3 characters long')
        } else {
            setSuccessFor(docfname)
        }

        if(!lname) {
            setErrorFor(doclname, 'Last name cannot be empty');
        } else if(typeof lname !== 'string') {
            setErrorFor(doclname, 'Last name must be a string')
        } else if(lname.length === 0) {
            setErrorFor(doclname, 'Last name just cannot be empty or spaces')
        } else if(lname.length < 3) {
            setErrorFor(doclname, 'Last name should be atleast 3 characters long')
        } else {
            setSuccessFor(doclname)
        }

        if(docgendermale.checked != true && docgenderfemale.checked != true && docgenderother.chekced != true){
            setErrorFor(docgender, 'Select Gender')            
        }

        if(!email){
            setErrorFor(docemail, 'Email cannot be empty')
        } else if(typeof email !== 'string') {
            setErrorFor(docemail, 'Email should be of strings')
        } else if(!emailCheck(email)) {
            setErrorFor(docemail, 'Enter valid EmailId')
        } else {
            setSuccessFor(docemail)
        }

        if(!city) {
            setErrorFor(doccity, 'City cannot be blank');
        } else if(typeof city !== 'string') {
            setErrorFor(doccity, 'City must be a string');
        } else if(city.length === 0) {
            setErrorFor(doccity, 'city just cannot be empty or spaces')
        } else if(city.length < 3) {
            setErrorFor(doccity, 'City should be atleast 3 characters long')
        } else if(!checkString(city)) {
            setErrorFor(doccity, 'City should only contain characters')
        } else {
            setSuccessFor(doccity);
        }

        //state
        if(!state) {
            setErrorFor(docstate, 'State cannot be blank');
        } else if(typeof state !== 'string') {
            setErrorFor(docstate, 'State must be a string');
        } else if(state.length === 0) {
            setErrorFor(docstate, 'State just cannot be empty or spaces')
        } else if(state.length < 3) {
            setErrorFor(docstate, 'State should be atleast 3 characters long')
        } else if(!checkString(state)) {
            setErrorFor(docstate, 'State should only contain characters')
        } else {
            setSuccessFor(docstate);
        }

        if(!phone) {
            setErrorFor(docphone, 'Phone Number cannot be blank');
        } else if(phone.length === 0) {
            setErrorFor(docphone, 'Phone Number just cannot be empty or spaces')
        } else if (!isNumeric(phone)) {
            setErrorFor(docphone, 'Phone Number should be numeric');
        } else if (phone.length > 10){
            setErrorFor(docphone, 'Phone number should be of 10 digits');
        } else {
            setSuccessFor(docphone);
        }

        if(doctypebuyer.checked != true && doctypeseller.checked != true){
            setErrorFor(doctype, 'Select type')            
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

function isNumeric(num)
{
    return /^[0-9]+$/.test(num)
}

function checkString(str) {
    return /^[A-Za-z\s.,-]+$/.test(str)
}

function emailCheck(email) 
{
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
}

function passwordCheck(password)
{
    return  /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,20}$/.test(password)
}

    
