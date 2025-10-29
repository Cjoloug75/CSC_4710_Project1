document.addEventListener('DOMContentLoaded', function(){
    fetch('http://localhost:5050/getALL')
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
});

document.querySelector('table tbody'). addEventListener('click', function(event){
    if( event.target.className === "delete-row-btn"){
        deleteRowById(event.target.dataset.id);
    }
    if(event.target.className === "edit-row-btn" ){
        handleEditRow(event.target.dataset.id);
    }
});

function deleteRowById(id){
    fetch('http://localhost:5050/delete/' + id, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data =>{
        if(data.success){
            location.reload();
        }
    });
}
let idToUpdate = 0;

function handleEditRow(id){
    const updateSection = document.querySelector('#update-row');
    updateSection.hidden =false;
    document.querySelector('#update-row-btn').dataset.id = id;
    idToUpdate = id;
}

const updateBtn= document.querySelector('#update-row-btn')
updateBtn.onclick = function(){
    const updateNameInput = document.querySelector('#update-name-input');
    fetch('http://localhost:5050/update',{
        headers: {
            'Content-type' : 'application/json'
        },
        method: 'PATCH',
        body: JSON.stringify({
            id: idToUpdate,
            name: updateNameInput.value
        })
    })
    .then(response => response.json())
    .then(data =>{
        location.reload();
    })
}

const addBtn = document.querySelector('#add-name-btn');
addBtn.onclick = function(){
    const nameInput = document.querySelector('#name-input');
    const name = nameInput.value;
    nameInput.value = "";

    fetch('http://localhost:5050/insert',{
        headers:{
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({name: name})
    })
    .then(response => response.json())
    .then(data => insertRowIntoTable(data['data']));
}

const searchBtn =  document.querySelector('#search-btn');
searchBtn.onclick = function (){
    const searchInput = document.querySelector('#search-input');
    const searchValue = searchInput.value;
    searchInput.value = "";

    fetch('http://localhost:5050/search/' + searchValue)
    .then(response => response.json())
    .then(data => loadHTMLTable(data['data']));
}


function insertRowIntoTable(data){
    const table = document.querySelector('table tbody')
    const isTableData = table.querySelector('.no-data');

    let tableHtml = "<tr>";
    console.log("message")
    for(var key in data){
        if(data.hasOwnProperty(key)){
            if(key === 'dateAdded'){
                data[key] = new Date(data[key]).toLocaleString();
            }
            tableHtml += `<td>${data[key]}</td>`;
        }
    }
    tableHtml += `<td><button class="delete-row-btn" data-id=${data.id}>Delete</button></td>`;
    tableHtml += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</button></td>`;
    tableHtml += "</tr>";

    if(isTableData){
        table.innerHTML = tableHtml;
    }else{
        const newRow = table.insertRow();
        newRow.innerHTML = tableHtml;
    }
}

function loadHTMLTable(data){
    console.log("loadHTMLTable called with data:", data);

    const table = document.querySelector('table tbody')
    if (data.length === 0){
        table.innerHTML = "<tr><td class = 'no-data' colspan ='10'> No Data </td></tr>"
        return;
    }
    let tableHtml = "";
    data.forEach(function({id,username,firstname, lastname, salary,age,registerday,signintime}){
        tableHtml += "<tr>";
        tableHtml += `<td>${id}</td>`;
        tableHtml += `<td>${username}</td>`;
        tableHtml += `<td>${firstname}</td>`;
        tableHtml += `<td>${lastname}</td>`;
        tableHtml += `<td>${salary}</td>`;
        tableHtml += `<td>${age}</td>`;
        tableHtml += `<td>${new Date(registerday).toLocaleString()}</td>`;
        tableHtml += `<td>${new Date(signintime).toLocaleString()}</td>`;
        tableHtml += `<td><button class="delete-row-btn" data-id=${id}>Delete</button></td>`;
        tableHtml += `<td><button class="edit-row-btn" data-id=${id}>Edit</button></td>`;
        tableHtml += "</tr>";
    });
    table.innerHTML = tableHtml;
}
const showRegisterLink = document.getElementById('show-register');
        const showLoginLink = document.getElementById('show-login');

        const loginCard = document.getElementById('login-card');
        const registerCard = document.getElementById('register-card');
        const welcomeCard = document.getElementById('welcome-card');
        const registerSuccessCard = document.getElementById('registered-card'); 
        const userDataCard = document.getElementById('userData-card'); 
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form'); 
        const loginUsernameInput = document.getElementById('login-username');
        const loginPasswordInput = document.getElementById('login-password')
        const registerUsernameInput = document.getElementById('register-username');
        const registerPasswordInput = document.getElementById('register-password');
        const registerFirstnameInput = document.getElementById('register-firstname');
        const registerLastnameInput = document.getElementById('register-lastname');
        const registerSalaryInput = document.getElementById('register-salary');
        const registerAgeInput = document.getElementById('register-age');

        const welcomeContinueBtn = document.getElementById('login-data-btn');
        const registerContinueBtn = document.getElementById('register-data-btn');
        const logoutBtn = document.getElementById('logout-btn');
        const usernameDisplay = document.getElementById('username-display');

        const searchSelect = document.getElementById('userSearch');
        const searchButton = document.getElementById('search-btn');
        const dynamicInputsDiv = document.getElementById('dynamic-search-inputs');
        const tableBody = document.querySelector('table tbody');
        
        
    function navigateTo(targetCard, username = 'User') {
        document.querySelectorAll('.username-display').forEach(span => {
            span.textContent = username;
        });

        loginCard.hidden = true;
        registerCard.hidden = true;
        welcomeCard.hidden = true;
        registerSuccessCard.hidden = true;
        userDataCard.hidden = true;
        
        targetCard.hidden = false;
    }
    
    showRegisterLink.addEventListener('click', function(event) {
        event.preventDefault();
        navigateTo(registerCard);
    });

    showLoginLink.addEventListener('click', function(event) {
        event.preventDefault();
        navigateTo(loginCard);
    });
    loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const username = loginUsernameInput.value;
            const password = loginPasswordInput.value;

            fetch('http://localhost:5050/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => {
                        throw new Error(err.message || "Login failed due to server error.");
                    });
                }
                return response.json();
            })
            .then(data => {
                navigateTo(welcomeCard, data.username || username);
                loginForm.reset();
            })
            .catch(error => {
                console.error("Login attempt failed:", error.message);
                alert(error.message);
            });
        });
    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = registerUsernameInput.value;
        const password = registerPasswordInput.value;
        const firstname = registerFirstnameInput.value;
        const lastname = registerLastnameInput.value;
        const salary = parseFloat(registerSalaryInput.value);
        const age = parseInt(registerAgeInput.value, 10);

        const dataToSend = {
            username: username,
            password: password,
            firstname: firstname,
            lastname: lastname, 
            salary: salary,
            age: age,
        };

        fetch('http://localhost:5050/register', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                navigateTo(registerSuccessCard, username);
                registerForm.reset(); 
            }
        })
        .catch(error => {
            console.error("Registration failed:", error.message);
            alert(error.message);
    });
    });

    function updateSearchInputs(){
        const value = searchSelect.value;
        dynamicInputsDiv.innerHTML = '';

        if(value === 'salary' || value === 'age'){
            dynamicInputsDiv.innerHTML = `
            <input placeholder="Min Value" id="search-input-min" type="number" style="width: 100px;">
            <input placeholder="Max Value" id="search-input-max" type="number" style="width: 100px;">
        `;
        }
        else if(value === 'id'|| value === 'registered_after_id' || value ==='registered_same_day_id'){
            dynamicInputsDiv.innerHTML = `
            <input placeholder="Enter User ID" id="search-input-id" type="number">
        `;
        }
        else if(value === 'firstname' || value === 'lastname') {
            dynamicInputsDiv.innerHTML = `
                <input placeholder="Enter Name" id="search-input-name" type="text">
            `;
        }
    }
    searchSelect.addEventListener('change', updateSearchInputs);
    updateSearchInputs();

searchButton.addEventListener('click', function() {
    const searchType = searchSelect.value;
    let url = 'http://localhost:5050';
    let params = [];

    // --- Build the URL based on the search type ---
    if (searchType === 'firstname') {
        const first = document.getElementById('search-input-name').value;
        if (!first) {
            alert("Please enter a first or last name to search.");
            return;
        }
        url += `/users/by-name?firstname=${encodeURIComponent(first)}`;
    }else if(searchType === 'lastname') {
        const last = document.getElementById('search-input-name').value;
        if (!last) {
            alert("Please enter a last name.");
            return;
        }
        url += `/users/by-name?lastname=${encodeURIComponent(last)}`;


    } else if (searchType === 'salary' || searchType === 'age') {
        const min = document.getElementById('search-input-min').value;
        const max = document.getElementById('search-input-max').value;
        if (!min || !max) {
            alert("Please enter both minimum and maximum values.");
            return;
        }
        const endpoint = searchType === 'salary' ? 'by-salary-range' : 'by-age-range';
        url += `/users/${endpoint}?min=${min}&max=${max}`;

    } else if (searchType === 'id') {
        const id = document.getElementById('search-input-id').value;
        if (!id) {
            alert("Please enter a User ID.");
            return;
        }
        url += `/users/by-id/${id}`;

    } else if (searchType === 'registered_after_id') {
        const id = document.getElementById('search-input-id').value;
        if (!id) {
            alert("Please enter a User ID.");
            return;
        }
        url += `/users/registered/after/${id}`;

    } else if (searchType === 'registered_same_day_id') {
        const id = document.getElementById('search-input-id').value;
        if (!id) {
            alert("Please enter a User ID.");
            return;
        }
        url += `/users/registered/same-day/${id}`;

    } else if (searchType === 'registered_today') {
        url += `/users/registered/today`;
        
    } else if (searchType === 'never_signed_in') {
        url += `/users/never-signed-in`;
    }

    // --- Execute the Fetch Request ---
    fetch(url)
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.message || "Failed to retrieve data.");
                });
            }
            return response.json();
        })
        .then(data => {
            loadHTMLTable(data.data);
        })
        .catch(error => {
            console.error("Search Error:", error.message);
            tableBody.innerHTML = `<tr><td colspan="10" style="color:red;">Error: ${error.message}</td></tr>`;
        });
});

    welcomeContinueBtn.addEventListener('click', function() {
        const currentUsername = welcomeCard.querySelector('.username-display').textContent;
        navigateTo(userDataCard, currentUsername);
    });

    registerContinueBtn.addEventListener('click', function() {
        const currentUsername = registerSuccessCard.querySelector('.username-display').textContent;
        navigateTo(userDataCard, currentUsername);
    });

    logoutBtn.addEventListener('click', function() {
        navigateTo(loginCard);
    });