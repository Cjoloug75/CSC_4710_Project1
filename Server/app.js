const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const dbService = require('./dbService');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended : false}));

app.post('/register', (request, response) => {
    const {
        username,
        password,
        firstname,
        lastname,
        salary,
        age,
    } = request.body;

    const db = dbService.getDbServiceInstance();
    
    const result = db.registerNewUser({
        username,
        password,
        firstname,
        lastname,
        salary,
        age
    });

    result
    .then(data => response.json({
        success: true,
        message: "User successfully registered.",
        data: data
    }))
    .catch(err => {
        console.log(err);
            if (err.message && err.message.includes('Duplicate entry')) {
                response.status(409).json({
                    success: false,
                    message: "A user with that username already exists."
                });
            }
    });
});
app.post('/login', (request, response) => {
    const { username, password } = request.body;
    const db = dbService.getDbServiceInstance();
    db.loginUser({ username, password })
        .then(user => {
            if (user && user.id) {
                db.updateLastLogin(user.id);
            }
            response.json({ success: true, username: user.username });
        })
        .catch(error => {
            console.log("Login Failure:", error.message);
            response.status(401).json({
                success: false,
                message: "Invalid username or password."
            });
        });
});
//create
app.post('/insert', (request, response) =>{
    const {name} =  request.body;
    const db = dbService.getDbServiceInstance();
    const result = db.insertNewName(name);

    result.then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

//read
app.get('/getAll', (request, response) =>{
    const db = dbService.getDbServiceInstance();

    const result = db.getAllData();
    result
    .then(data => response.json({data:data}))
    .catch(err => console.log(err));
});

//update
app.patch('/update', (request, response) =>{
    const {id, name} = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.updateNameById(id, name);

    result
    .then(data => response.json({success: data}))
    .catch(err => console.log(err));
})


//delete
app.delete('/delete/:id', (request, response)=>{
    const { id } = request.params;
    const db = dbService.getDbServiceInstance();

    const result = db.deleteRowById(id);
    result
    .then(data => response.json({success: data}))
    .catch(err => console.log(err));

})

app.get('/users/by-username/:username', (request, response) => { 
    
    const {username} = request.params;
    
    console.log(username);

    const db = dbService.getDbServiceInstance();

    db.searchByUserName(username)
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

app.get('/users/by-firstname/:firstname', (request, response) => { 
    
    const {firstname} = request.params;
    const db = dbService.getDbServiceInstance();

    db.searchByFirstName(firstname)
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

app.get('/users/by-lastname/:lastname', (request, response) => {
    
    const {lastname} = request.params;
    const db = dbService.getDbServiceInstance();

    db.searchByLastName(lastname)
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

app.get('/users/by-id/:id', (request, response) => {
    
    const {id} = request.params;
    const db = dbService.getDbServiceInstance();

    db.searchById(id)
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

app.get('/users/by-salary-range', (request, response) => {
    
    const {min,max} = request.query;
    if (!min || !max) {
        return response.status(400).json({ success: false, message: "Missing required 'min' and 'max' parameters." });
    }
    const db = dbService.getDbServiceInstance();

    db.searchBySalaryRange(min,max)
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

app.get('/users/by-age-range', (request, response) => {
    
    const {min, max} = request.query;
    if (!min || !max) {
        return response.status(400).json({ success: false, message: "Missing required 'min' and 'max' parameters." });
    }
    const db = dbService.getDbServiceInstance();

    db.searchByAgeRange(min, max)
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

app.get('/users/registered/after/:id', (request, response) => {
    
    const {id} = request.params;
    const db = dbService.getDbServiceInstance();

    db.searchRegisteredAfterUser(id)
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

app.get('/users/registered/same-day/:id', (request, response) => {
    
    const {id} = request.params;
    const db = dbService.getDbServiceInstance();

    db.searchRegisteredSameDay(id)
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

app.get('/users/registered/today', (request, response) => {
    const db = dbService.getDbServiceInstance();

    db.searchRegisteredToday()
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});
app.get('/users/never-signed-in', (request, response) => {
    const db = dbService.getDbServiceInstance();

    db.searchNeverSignedIn()
    .then(data => response.json({data: data}))
    .catch(err => console.log(err));
});

app.listen(process.env.PORT, () => console.log('app is running'));
