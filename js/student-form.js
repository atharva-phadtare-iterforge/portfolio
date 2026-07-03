

const form = document.getElementById("student-form");

//-------SUBMIT-------//
form.addEventListener("submit", function(e) {
    e.preventDefault();

    let valid = true;

    const nameRegex = /^[A-Z][a-z0-9_-]{3,19}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]/;
    const mobileRegex = /^(0|91)?[6-9][0-9]{9}$/;

    const firstName = document.getElementById("firstName").value.trim();

    if(!nameRegex.test(firstName)) {
        showError("firstNameError", "First letter must be uppercase and only alphabets are allowed.");
        valid = false;
    }

    const middleName = document.getElementById("middleName").value.trim();

    if(!nameRegex.test(middleName)) {
        showError("middleNameError", "First letter must be uppercase and only alphabets are allowed.");
        valid = false;
    }

    const lastName = document.getElementById("lastName").value.trim();

    if(!nameRegex.test(lastName)) {
        showError("lastNameError", "First letter must be uppercase and only alphabets are allowed.");
        valid = false;
    }

    const gender = document.querySelector('input[name="gender"]:checked');

    if(!gender) {
        showError("genderError", "Please select your gender");
        valid = false;
    }

    const email = document.getElementById("email").value.trim();

    if(!emailRegex.test(email)) {
        showError("emailError", "Email format is incorrect");
        valid = false;
    }

    const mobile = document.getElementById("mobile").value.trim();

    if(!mobileRegex.test(mobile)) {
        showError("mobileError", "Mobile number must contain 10 digits");
        valid = false;
    }


    if(valid) {
        alert("Success");
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
    document.querySelectorAll(".input-group input, input-group textarea").forEach(input => input.classList.remove(".active"));

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