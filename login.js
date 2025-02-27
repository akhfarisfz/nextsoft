    /* 
    * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
    * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/JavaScript.js to edit this template
    */

    /**
     * 
     * @param {type} e
     * @returns {undefined}
     * Hindari innerHMTL, solusinya kita bisa pakai
     * document.createElement()
     */

    function main(e) {
        let components = {
            form: document.querySelector("#form"),
            name: document.querySelector("#username"),
            password: document.querySelector("#password"),
            button: document.querySelector("button[type='submit']")

        };
        
        components.form.addEventListener("submit", (e) => {
            e.preventDefault();
            addValidator(components);
            let {isValidAll, validationMessage} = validate(components);
            // Hapus pesan error lama sebelum validasi baru

            if (isValidAll) {
                components.name.style.background = 'white';
                components.password.style.background = 'white';
                errorMessage.style.display = 'none';
                sendData(components);
            } else {
                let div = document.createElement("div");
                div.style.paddingLeft = "10px";
                div.style.paddingRight = "10px";
                div.style.background = "red";
                div.style.color = "white";
                div.id = "errorMessage";
                div.textContent = validationMessage.name.message;
                components.form.appendChild(div);
                
                let divPassword = document.createElement("div");
                divPassword.style.paddingLeft = "10px";
                divPassword.style.paddingRight = "10px";
                divPassword.style.background = "red";
                divPassword.style.color = "white";
                divPassword.id = "errorMessage";
                divPassword.textContent = validationMessage.password.message;
                components.form.appendChild(divPassword);
            }
        });
    }


    function sanitizedInput(input) {
        return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function addValidator(components) {
        let validators = {
            name: [
                ['maxlength', 40],
                ['minlength', 10],
                ['required', true]
            ],
            password: [
                ['maxlength', 15],
                ['minlength', 6],
                ['required', true],
                ]   
        };  
        
        // Gunakan forEach agar tidak menghasilkan array baru
        validators.name.forEach((attrs) => components.name.setAttribute(attrs[0], attrs[1]));
        validators.password.forEach((attrs) => components.password.setAttribute(attrs[0], attrs[1]));
    }


    function sendData(components) {
        //Use Fetch

        fetch('api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: sanitizedInput(components.username.value),
                password: sanitizedInput(components.password.value)
            })
        }).then(response => response.json())
        .then(data => {
            if(data.status == "success"){
                alert("Login Success");
            }else{
                errorMessage.textContent = data.message;
            }
        })
    };

    function validate(components) {
        let isValidAll = true;
        let validationMessage = {
            name: {
                isValid: true,
                message: ""
            },
            password: {
                isValid: true,
                message: ""
            }
        };
        
        if (!components.name.checkValidity()) {
            components.name.style.background = 'red';
            isValidAll = false;
            validationMessage.name.isValid = false;
            validationMessage.name.message = components.name.validationMessage;
        }
    // Validasi password dengan regex
    let passwordValue = components.password.value;
    let passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,15}$/;

    if (!components.password.checkValidity()) {
        components.password.style.background = 'red';
        isValidAll = false;
        validationMessage.password.isValid = false;
        validationMessage.password.message = components.password.validationMessage;
    } else if (!passwordPattern.test(passwordValue)) {
        components.password.style.background = 'red';
        isValidAll = false;
        validationMessage.password.isValid = false;
        validationMessage.password.message = 
            "Password harus 5-15 karakter, mengandung huruf besar, huruf kecil, dan angka.";
    } else {
        components.password.style.background = 'white'; // Reset warna jika valid
    }
        
        return {validationMessage, isValidAll};
    }

    document.addEventListener("DOMContentLoaded", main);
