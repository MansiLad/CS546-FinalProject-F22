const form = document.getElementById('form')
const docdeposits = document.getElementById('deposits')
const docrent = document.getElementById('rent')
const docammenities = document.getElementById('ammenities')
const docdescription = document.getElementById('description')


form.addEventListener('submit', event => {
	event.preventDefault();
	checkInputs();
    form.submit()
});

function checkInputs() {
    if(form) {
        const deposits = docdeposits.value.trim()
        const rent = docrent.value.trim()
        const ammenities = docammenities.value.trim()
        const description = docdescription.value.trim()

        if(!rent) {
            setErrorFor(docrent, 'Rent cannot be blank');
        } else if(rent.length === 0) {
            setErrorFor(docrent, 'Rent just cannot be empty or spaces')
        } else if (!isNumeric(rent)) {
            setErrorFor(docrent, 'Rent should be numeric');
        } else {
            setSuccessFor(docrent);
        }

        if(!deposits) {
            setErrorFor(docdeposits, 'Deposits cannot be blank');
        } else if(deposits.length === 0) {
            setErrorFor(docdeposits, 'Deposits just cannot be empty or spaces')
        } else if (!isNumeric(deposits)) {
            setErrorFor(docdeposits, 'Deposits should be numeric');
        } else {
            setSuccessFor(docdeposits);
        }

        if(!ammenities) {
            setErrorFor(docammenities, 'ammenities cannot be blank');
        } else if(typeof ammenities !== 'string') {
            setErrorFor(docammenities, 'ammenities must be a string');
        } else if(ammenities.length === 0) {
            setErrorFor(docammenities, 'ammenities just cannot be empty or spaces')
        } else if(ammenities.length < 3) {
            setErrorFor(docammenities, 'ammenities should be atleast 3 characters long')
        } else if(!/^[A-Za-z\s.,-]+$/.test(ammenities)) {
            setErrorFor(docammenities, 'ammenities should only contain characters')
        } else {
            setSuccessFor(docammenities);
        }

        if(!description) {
            setErrorFor(docdescription, 'Description cannot be blank');
        } else if(typeof description !== 'string') {
            setErrorFor(docdescription, 'Description must be a string');
        } else if(description.length === 0) {
            setErrorFor(docdescription, 'Description just cannot be empty or spaces')
        } else if(description.length < 4) {
            setErrorFor(docdescription, 'Description should be atleast 4 characters long')
        } else {
            setSuccessFor(docdescription);
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


