

const form = document.getElementById("student-form");

const nameRegex = /^[A-Z][a-z0-9_-]{3,19}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]/;
const mobileRegex = /^(0|91)?[6-9][0-9]{9}$/;

let sortDirection = {};

let currentPage = 1;
const rowsPerPage = 5;

let selectedId = null;

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

    editId = -1;

    document.querySelector(".form-container").style.display = "none";
    document.querySelector(".search-flex").style.display = "flex";
    document.querySelector(".table-container").style.display = "block";
    
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


let editId = -1;

function readAll() {
    let object = localStorage.getItem("object");

    data = object ? JSON.parse(object) : [];

    displayTable(data);

}

function displayTable(studentList) {
    var dataTable = document.querySelector(".data-table"); 
    
    if(studentList.length === 0) {
        dataTable.innerHTML = `
        <tr>
            <td colspan="10" class="no-data">
                No data to Show
            </td>
        </tr>
        `
        return;
    };
    

    var elements = "";

    let start = (currentPage - 1) * rowsPerPage;
    let end = start + rowsPerPage;

    let paginatedData = studentList.slice(start, end);


    paginatedData.forEach(record => {

        
        elements += `<tr>
            <td>${record.id}</td>
            <td>${record.firstName}</td>
            <td>${record.middleName}</td>
            <td>${record.lastName}</td>
            <td>${record.gender}</td>
            <td>${record.email}</td>
            <td>${record.mobile}</td>
            <td>${record.birthDate}</td>
            <td>
            <div class="about-css">
              ${record.aboutMe}
            </div>
            </td>
            <td>
            <button class="edit" onClick={openEditModal(${record.id})}><svg fill="#ffffff" width="15px" height="15px" viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M 23.90625 3.96875 C 22.859375 3.96875 21.8125 4.375 21 5.1875 L 5.1875 21 L 5.125 21.3125 L 4.03125 26.8125 L 3.71875 28.28125 L 5.1875 27.96875 L 10.6875 26.875 L 11 26.8125 L 26.8125 11 C 28.4375 9.375 28.4375 6.8125 26.8125 5.1875 C 26 4.375 24.953125 3.96875 23.90625 3.96875 Z M 23.90625 5.875 C 24.410156 5.875 24.917969 6.105469 25.40625 6.59375 C 26.378906 7.566406 26.378906 8.621094 25.40625 9.59375 L 24.6875 10.28125 L 21.71875 7.3125 L 22.40625 6.59375 C 22.894531 6.105469 23.402344 5.875 23.90625 5.875 Z M 20.3125 8.71875 L 23.28125 11.6875 L 11.1875 23.78125 C 10.53125 22.5 9.5 21.46875 8.21875 20.8125 Z M 6.9375 22.4375 C 8.136719 22.921875 9.078125 23.863281 9.5625 25.0625 L 6.28125 25.71875 Z"
              /></svg>
              <span>Edit</span></button>
                        <button class="delete" onClick={openDeleteModal(${record.id})}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ffffff" width="15px" height="15px">
  <g>
    <path fill="none" d="M0 0h24v24H0z" />
    <path
      d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zm-9 3h2v6H9v-6zm4 0h2v6h-2v-6zM9 4v2h6V4H9z"
    />
  </g>
</svg>  <span>Delete</span></button>
                        </td>
                        </tr>`;
                
                })

    dataTable.innerHTML = elements;
    createPagination(studentList);
}

function create() {
    document.querySelector(".form-container").style.display = "block";
    document.querySelector(".search-flex").style.display = "none";
    document.querySelector(".table-container").style.display = "none";
}
readAll();

let nextId = Number(localStorage.getItem("nextId")) || 1;

function addStudent() {
    var firstName = document.getElementById("firstName").value;
    var middleName = document.getElementById("middleName").value;
    var lastName = document.getElementById("lastName").value;
    var gender = document.querySelector('input[name="gender"]:checked')?.value || "";
    var email = document.getElementById("email").value;
    var mobile = document.getElementById("mobile").value;
    var birthDate = document.getElementById("birthDate").value;
    var aboutMe = document.getElementById("aboutMe").value;

    var newStudent = {id: editId == -1 ? nextId : editId, firstName: firstName, middleName: middleName, lastName: lastName, gender: gender, email: email, mobile: mobile, birthDate: birthDate, aboutMe: aboutMe};
    
    if(editId == -1) {
        data.push(newStudent);
        nextId++;
        localStorage.setItem("nextId", nextId);
    } else {
        const index = data.findIndex(s => s.id == editId);
        if(index !== -1){
            data[index] = newStudent;
        }
        editId = -1;
    }

    localStorage.setItem("object", JSON.stringify(data));

    readAll();

    document.querySelector(".submit-btn").textContent = "Register";

    document.querySelector(".form-container").style.display = "none";
    document.querySelector(".search-flex").style.display = "flex";
    document.querySelector(".table-container").style.display = "block";
}

function editStudent(id) {

    
    editId = id;

    const student = data.find(s => s.id === id);

    document.querySelector(".form-container").style.display = "block";
    document.querySelector(".search-flex").style.display = "none";
    document.querySelector(".table-container").style.display = "none";

    document.getElementById("firstName").value = student.firstName;
    document.getElementById("middleName").value = student.middleName;
    document.getElementById("lastName").value = student.lastName;
    document.querySelector(`input[name="gender"][value="${student.gender}"]`).checked = true;
    document.getElementById("email").value = student.email;
    document.getElementById("mobile").value = student.mobile;
    document.getElementById("birthDate").value = student.birthDate;
    document.getElementById("aboutMe").value = student.aboutMe;    

    document.querySelector(".submit-btn").innerHTML = "Update";
    
    updateFloatingLabels();
}

function deleteStudent(id) {
    data = data.filter(student => student.id !== id);
    localStorage.setItem("object", JSON.stringify(data));

    readAll();
}


//-----------------------------------------------------------------//
//--------------------------- SORTING -----------------------------//
//-----------------------------------------------------------------//



function sortTable(column, header) {
    document.querySelectorAll("thead th").forEach(th => {
        th.innerHTML = th.innerHTML.replace(" ▲", "").replace(" ▼", "");
    });

    sortDirection[column] = !sortDirection[column];


    if(column == "birthDate") {
        if(sortDirection[column]) {
            data.sort((a, b) => new Date(a.birthDate) - new Date(b.birthDate));
            header.innerHTML += " ▲";
        } else {
            data.sort((a, b) => new Date(b.birthDate) - new Date(a.birthDate));
            header.innerHTML += " ▼";
        }
    } else {
        if (sortDirection[column]) {
            data.sort((a, b) => String(a[column]).localeCompare(String(b[column])));
            header.innerHTML += " ▲";
        } else {
            data.sort((a, b) => String(b[column]).localeCompare(String(a[column])));
            header.innerHTML += " ▼";
        }
    }
    localStorage.setItem("object", JSON.stringify(data));
    readAll();
}

//-----------------------------------------------------------------//
//--------------------- FILTER / SEARCH ---------------------------//
//-----------------------------------------------------------------//

function searchStudent() {
    let text = document.getElementById("search").value.toLowerCase();

    if (text === "") {
        displayTable(data);
    }

    let filteredData = data.filter(student => 
        student.firstName.toLowerCase().includes(text) || student.lastName.toLowerCase().includes(text) || student.email.toLowerCase().includes(text) || student.mobile.includes(text)
    );
    displayTable(filteredData);
}

//-----------------------------------------------------------------//
//----------------------- PAGINATION ------------------------------//
//-----------------------------------------------------------------//



function changePage(page) {
     let totalPages = Math.ceil(data.length / rowsPerPage);

     if(page < 1 || page > totalPages) {
        return;
     }

     currentPage = page;

     displayTable(data);
}

function createPagination(studentList) {


    let totalPages = Math.ceil(studentList.length / rowsPerPage);

    document.getElementById("pagination");

    let buttons = "";

    // Previous Btn
    buttons += `
    <button onClick="changePage(currentPage - 1)"
        ${currentPage === 1 ? "disabled" : ""}>
        Previous
    </button>
    `

    // Page Numbers
    for(i = 1; i < totalPages; i++) {

        
        buttons += `
        <button onClick="changePage(${i})"
        ${currentPage === i ? "disabled" : ""}>
        ${i}
        </button>
        `
        }

    // Next btn
    buttons += `
        <button onclick="changePage(currentPage + 1)"
            ${currentPage === totalPages || totalPages === 0 ? "disabled" : ""}>
            Next
        </button>
    `

    pagination.innerHTML = buttons;
}

//-----------------------------------------------------------------//
//-------------------------- MODAL --------------------------------//
//-----------------------------------------------------------------//

function openEditModal(id) {
    selectedId = id;

    document.getElementById("modalTitle").innerHTML = "Edit Student";

    document.getElementById("modalMessage").innerHTML = "Are you sure want to edit this student?";

    document.getElementById("confirmModal").style.display = "flex";

    document.getElementById("yesBtn").onclick=function(){
        editStudent(selectedId);

        document.getElementById("confirmModal").style.display = "none";
    }

    document.getElementById("noBtn").onclick=function() {
        document.getElementById("confirmModal").style.display = "none";
    }
}

function openDeleteModal(id) {
    selectedId = id;

    document.getElementById("modalTitle").innerHTML = "Delete Student";

    document.getElementById("modalMessage").innerHTML = "Are you sure want to delete this student?";

    document.getElementById("confirmModal").style.display = "flex";

    document.getElementById("yesBtn").onclick=function(){
        deleteStudent(selectedId);

        document.getElementById("confirmModal").style.display = "none";
    }

    document.getElementById("noBtn").onclick=function() {
        document.getElementById("confirmModal").style.display = "none";
    }
}


