

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
        addStudent();
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

function updateFloatingLabels() {
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
}

updateFloatingLabels();

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

//-------------CRUD------------------//

let data = [
    {
        id: 1, firstName: "Atharva", middleName: "Manoj", lastName: "Phadtare", gender: "Male", email:"abc@gmail.com", mobile: 9321852718, birthDate: "01/01/2026", aboutMe: "ABC"
    },
    {
        id: 2, firstName: "Atharva", middleName: "Manoj", lastName: "Phadtare", gender: "Male", email:"abc@gmail.com", mobile: 9321852718, birthDate: "01/01/2026", aboutMe: "ABC"
    }
]
let editId = -1;

function readAll() {

    var dataTable = document.querySelector(".data-table");

    data = JSON.parse(localStorage.getItem("object")) || [];
    var objectData = data;

    var elements = "";

    objectData.map(record => (
        elements += `<tr>
            <td>${record.id}</td>
            <td>${record.firstName}</td>
            <td>${record.middleName}</td>
            <td>${record.lastName}</td>
            <td>${record.gender}</td>
            <td>${record.email}</td>
            <td>${record.mobile}</td>
            <td>${record.birthDate}</td>
            <td>${record.aboutMe}</td>
            <td>
            <button class="edit" onClick={editStudent(${record.id})}>Edit</button>
            <button class="delete" onClick={deleteStudent(${record.id})}>Delete</button>
            </td>
        </tr>`
    ))

    dataTable.innerHTML = elements;

}

function create() {
    document.querySelector(".form-container").style.display = "block";
    document.querySelector(".add-button").style.display = "none";
    document.querySelector(".table-container").style.display = "none";
}
readAll();

function addStudent() {
    var firstName = document.getElementById("firstName").value;
    var middleName = document.getElementById("middleName").value;
    var lastName = document.getElementById("lastName").value;
    var gender = document.querySelector('input[name="gender"]:checked')?.value || "";
    var email = document.getElementById("email").value;
    var mobile = document.getElementById("mobile").value;
    var birthDate = document.getElementById("birthDate").value;
    var aboutMe = document.getElementById("aboutMe").value;

    var newStudent = {id: data.length + 1, firstName: firstName, middleName: middleName, lastName: lastName, gender: gender, email: email, mobile: mobile, birthDate: birthDate, aboutMe: aboutMe};
    
    if(editId == -1) {
        data.push(newStudent);
    } else {
        const index = data.findIndex(s => s.id == editId);
        if(index !== -1){
            data[index] = newStudent;
        }
        editId = -1;
    }

    localStorage.setItem("object", JSON.stringify(data));

    readAll();

    document.querySelector(".form-container").style.display = "none";
    document.querySelector(".add-button").style.display = "block";
    document.querySelector(".table-container").style.display = "block";
}

function editStudent(id) {

    
    editId = id;

    const student = data.find(s => s.id === id);

    document.querySelector(".form-container").style.display = "block";
    document.querySelector(".add-button").style.display = "none";
    document.querySelector(".table-container").style.display = "none";

    document.getElementById("firstName").value = student.firstName;
    document.getElementById("middleName").value = student.middleName;
    document.getElementById("lastName").value = student.lastName;
    document.querySelector(`input[name="gender"][value="${student.gender}"]`).checked = true;
    document.getElementById("email").value = student.email;
    document.getElementById("mobile").value = student.mobile;
    document.getElementById("birthDate").value = student.birthDate;
    document.getElementById("aboutMe").value = student.aboutMe;    
    
    updateFloatingLabels();
}

function deleteStudent(id) {
    data = data.filter(student => student.id !== id);
    localStorage.setItem("object", JSON.stringify(data));

    readAll();
}