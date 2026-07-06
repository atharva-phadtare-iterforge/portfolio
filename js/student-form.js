

const form = document.getElementById("student-form");

const nameRegex = /^[A-Z][a-z0-9_-]{3,19}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]/;
const mobileRegex = /^(0|91)?[6-9][0-9]{9}$/;

//--------LIVE VALIDATION-----------//

function validateFirstName() {
    const firstName = document.getElementById("firstName").value.trim();

    if(!nameRegex.test(firstName)) {
        showError("firstNameError", "First Name is required.");
        return false;
    }

    showError("firstNameError", "");
    return true;
}

function validateMiddleName() {
    const middleName = document.getElementById("middleName").value.trim();

    if(!nameRegex.test(middleName)) {
        showError("middleNameError", "Middle Name is required.");
        return false;
    }

    showError("middleNameError", "");
    return true;
}

function validateLastName() {
    const lastName = document.getElementById("lastName").value.trim();

    if(!nameRegex.test(lastName)) {
        showError("lastNameError", "Last Name is required.");
        return false;
    }

    showError("lastNameError", "");
    return true;
}

function validateGender() {
    const gender = document.querySelector('input[name="gender"]:checked');

    if(!gender) {
        showError("genderError", "Please select your gender");
        return false;
    }

    showError("genderError", "");
    return true;
}

function validateEmail() {
    const email = document.getElementById("email").value.trim();

    if (email === "") {
        showError("emailError", "Email is required.");
        return false;
    } else if(!emailRegex.test(email)) {
        showError("emailError", "Email format is incorrect");
        return false;
    }

    showError("emailError", "");
    return true;
}

function validateMobile() {
    const mobile = document.getElementById("mobile").value.trim();

    if (mobile === "") {
        showError("mobileError", "Mobile number is required.");
        return false;
    } else if(!mobileRegex.test(mobile)) {
        showError("mobileError", "Mobile number must contain 10 digits");
        return false;
    }

    showError("mobileError", "");
    return true;
}


function validateBirthDate() {
    const birthDate = document.getElementById("birthDate").value;

    if(birthDate === "") {
        showError("birthDateError", "Birth Date is required");
        return false;
    }

    showError("birthDateError", "");
    return true;
}

function validateAboutMe() {
    const aboutCheck = document.getElementById("enableAboutMe");
    const aboutMe = document.getElementById("aboutMe").value.trim();

    if (aboutCheck.checked && aboutMe == "") {
        showError("aboutError", "Please enter About Me.");
        return false;
    }
    showError("aboutError", "");
    return true;
}

//-------SUBMIT-------//
form.addEventListener("submit", function(e) {
    e.preventDefault();

    let valid = true;
    
    valid = validateFirstName() && valid;
    valid = validateMiddleName() && valid;
    valid = validateLastName() && valid;
    valid = validateGender() && valid;
    valid = validateEmail() && valid;
    valid = validateMobile() && valid;
    valid = validateBirthDate() && valid;
    valid = validateAboutMe() && valid;

    if(valid) {
        alert("Success");
        form.reset();
        
    }
})


document.querySelectorAll("#firstName, #middleName, #lastName").forEach(function(input){

    input.addEventListener("input", function(){

        let value = this.value;

        if(value.length > 0) {
            this.value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        }
    })
});

//-------RESET-------//
form.addEventListener("reset", function () {
    document.querySelectorAll(".input-group input, .input-group textarea").forEach(function(input){
        input.classList.remove("active");
    });

    document.querySelectorAll(".error").forEach(error => error.textContent = "");

    document.getElementById("enableAboutMe").checked = false;
    document.getElementById("aboutSection").style.display = "none";

    document.getElementById("aboutMe").value = "";
    document.getElementById("characterCount").textContent = "0 / 1024";
    
})

//-------CHECKBOX OPTIONAL-------//
const aboutCheck = document.getElementById("enableAboutMe");
const aboutSection = document.getElementById("aboutSection");
const aboutMe = document.getElementById("aboutMe");
const characterCount = document.getElementById("characterCount");


aboutSection.style.display = "none";

aboutCheck.addEventListener("change", function () {
    if (this.checked) {
        aboutSection.style.display = "block";
    } else {
        aboutSection.style.display = "none";
        document.getElementById("aboutMe").value = "";
    }
});

aboutMe.addEventListener("input", function () {
    characterCount.textContent = this.value.length + " / 1024";
});

//------- BIRTH DATE -------//
document.getElementById("birthDate").max = new Date().toISOString().split("T")[0];

document.querySelectorAll(".input-group input", ".input-group textarea").forEach(input => {
    if(input.value.trim() !== "") {
        input.classList.add("active");
    }

    input.addEventListener("input", function() {
        if(this.value.trim() !== ""){
            this.classList.add("active");
        } else {
            this.classList.remove("active");
        }
    })
})

//------- SHOW ERROR FUNCTION -------//
function showError(id, message) {
    document.getElementById(id).textContent = message;
}


document.getElementById("firstName").addEventListener("blur", validateFirstName);
document.getElementById("middleName").addEventListener("blur", validateMiddleName);
document.getElementById("lastName").addEventListener("blur", validateLastName);
document.getElementById("email").addEventListener("blur", validateEmail);
document.getElementById("mobile").addEventListener("blur", validateMobile);
document.getElementById("birthDate").addEventListener("change", validateBirthDate);
document.querySelectorAll('input[name="gender"]').forEach(radio =>
    radio.addEventListener("change", validateGender)
)
document.getElementById("aboutMe").addEventListener("blur", validateAboutMe);