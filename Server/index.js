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
        table.innerHTML = "<tr><td class = 'no-data' colspan ='5'> No Data </td></tr>"
        return;
    }
    let tableHtml = "";
    data.forEach(function({id,name, date_added}){
        tableHtml += "<tr>";
        tableHtml += `<td>${id}</td>`;
        tableHtml += `<td>${name}</td>`;
        tableHtml += `<td>${new Date(date_added).toLocaleString()}</td>`;
        tableHtml += `<td><button class="delete-row-btn" data-id=${id}>Delete</button></td>`;
        tableHtml += `<td><button class="edit-row-btn" data-id=${id}>Edit</button></td>`;
        tableHtml += "</tr>";
    });
    table.innerHTML = tableHtml;
}