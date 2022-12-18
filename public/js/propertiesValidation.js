const form = document.getElementById('form')
const docaddress = document.getElementById('address')
const doccity = document.getElementById('city')
const docstate = document.getElementById('state')
const doczipcode = document.getElementById('zipcode')
const docbeds = document.getElementById('beds')
const docbaths = document.getElementById('baths')
const docdeposits = document.getElementById('deposits')
const docrent = document.getElementById('rent')
const docammenities = document.getElementById('ammenities')

form.addEventListener('submit', event => {
	event.preventDefault();
	checkInputs();
    form.submit()
});

function checkInputs() {
    if(form) {
        const address = docaddress.value.trim()
        const city = doccity.value.trim()
        const state = docstate.value.trim()
        const zipcode = doczipcode.value.trim()
        const beds = docbeds.value.trim()
        const baths = docbaths.value.trim()
        const deposits = docdeposits.value.trim()
        const rent = docrent.value.trim()
        const ammenities = docammenities.value.trim()

        //address
        if(!address) {
            console.log(address);
            setErrorFor(docaddress, 'Address cannot be blank');
        } else if(typeof address !== 'string') {
            setErrorFor(docaddress, 'Address must be a string');
        } else if(address.length === 0) {
            setErrorFor(docaddress, 'Address just cannot be empty or spaces')
        } else if(address.length < 4) {
            setErrorFor(docaddress, 'Address should be atleast 4 characters long')
        } else {
            setSuccessFor(docaddress);
        }

        //City
        if(!city) {
            setErrorFor(city, 'City cannot be blank');
        } else if(typeof city !== 'string') {
            setErrorFor(doccity, 'City must be a string');
        } else if(city.length === 0) {
            setErrorFor(doccity, 'city just cannot be empty or spaces')
        } else if(city.length < 3) {
            setErrorFor(doccity, 'City should be atleast 3 characters long')
        } else if(!/^[A-Za-z\s.,-]+$/.test(city)) {
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
        } else if(!/^[A-Za-z\s.,-]+$/.test(state)) {
            setErrorFor(docstate, 'State should only contain characters')
        } else {
            setSuccessFor(docstate);
        }

        if(!zipcode) {
            setErrorFor(doczipcode, 'Zipcode cannot be blank');
        } else if(zipcode.length === 0) {
            setErrorFor(doczipcode, 'Zipcode just cannot be empty or spaces')
        } else if(zipcode.length < 3) {
            setErrorFor(doczipcode, 'Zipcode should be atleast 3 characters long')
        } else if (!isUSAZipCode(zipcode)) {
            setErrorFor(doczipcode, 'Not a valid zipcode');
        } else {
            setSuccessFor(doczipcode);
        }

        if(!beds) {
            setErrorFor(docbeds, 'Beds cannot be blank');
        } else if(beds.length === 0) {
            setErrorFor(docbeds, 'Beds just cannot be empty or spaces')
        } else if (!isNumeric(beds)) {
            setErrorFor(docbeds, 'Beds should be numeric');
        } else {
            setSuccessFor(docbeds);
        }

        if(!baths) {
            setErrorFor(docbaths, 'Baths cannot be blank');
        } else if(baths.length === 0) {
            setErrorFor(docbaths, 'Baths just cannot be empty or spaces')
        } else if (!isNumeric(baths)) {
            setErrorFor(docbaths, 'aths should be numeric');
        } else {
            setSuccessFor(docbaths);
        }

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
	
function isUSAZipCode(str) 
{
  return /^\d{5}(-\d{4})?$/.test(str);
}

function isNumeric(num)
{
    return /^[0-9]+$/.test(num)
}

