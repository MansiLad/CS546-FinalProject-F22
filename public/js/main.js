//has the scripts fro client side validation
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;


(function () {
    async function userLogin(validUsername, validPassword) {

        const usersindb = await users();

        const checkusername = await usersindb.findOne({ email: validUsername });
        if (!checkusername) throw "Either the username or password is invalid";
      
        const password_check = await bcrypt.compare(validPassword, checkusername.password);
        if (!password_check) throw "Either the username or password is invalid";
    }

    const userlogindata = document.getElementById("userlogin")

    if(userlogindata) {
        const username = document.getElementById("emailInput")
        const password = document.getElementById("passwordInput")

        const errorContainer = document.getElementById('error')
        const errorTextElement = errorContainer.getElementsByClassName('text-goes-here')[0]

        data.addEventListener('submit', event => {
            event.preventDefault()
            try {
                errorContainer.hidden = true;
                
                if(!username)   throw 'Provide a username'
                if(!password)   throw 'Provide a password'

                const successLogin = userLogin(username, password)
                
                resultContainer.hidden = false
            }
            catch(e) {
                const message = typeof e === 'string' ? e : e.message
                const errormessage = "Error: Check your inputs again"
                errorTextElement.textContent = e;
                errorContainer.hidden = false
            }
        });

    }
    
})