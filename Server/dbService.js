const mysql = require('mysql')
const dotenv = require('dotenv')
const bcrypt = require('bcrypt')
dotenv.config();

let instance = null;

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT,
    timezone: 'Z'
});

connection.connect((err) =>{
if(err){
    console.log(err.message);
    }
    console.log('db ' + connection.state);
});

class DbService{
    static getDbServiceInstance(){
        return instance ? instance:  new DbService();
    }
    async getAllData(){
        try{
            const response = await new Promise((resolve, reject)=> 
                {
                const query = "SELECT * FROM Users;";
                connection.query(query,(err, results)=>{
                    if(err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            return response;
        }catch(error){
            console.log(error)
        }
    }
    //New code
    async registerNewUser({ username, password, firstname, lastname, salary, age }){
        try{
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            
            const insertId = await new Promise((resolve, reject)=> {
                const query = `
                    INSERT INTO Users
                    (username, password, firstname, lastname, salary, age, registerday) 
                    VALUES (?, ?, ?, ?, ?, ?, NOW());
                `;
            
                
                const values = [
                    username,
                    hashedPassword, // Note: Password should be hashed before insertion in production!
                    firstname,
                    lastname,
                    salary,
                    age,
                ];

                connection.query(query, values, (err, result)=>{
                    if(err){ console.error("MySQL Insert Error:", err.message, err.sql);
                        reject(new Error(err.message));}
                    resolve(result.insertId);
                })
            });
            
            return {
                insertId: insertId,
                username: username,
            };
        }catch(error){
        console.log(error)
        }
    }

async loginUser({ username, password }){
        try{
            const response = await new Promise((resolve, reject) =>
                {
                    // CRITICAL: Query looks for a row where BOTH username AND password match.
                    const query = "SELECT * FROM Users WHERE username = ?;";
                    connection.query(query, [username], async (err, results) => {
                        if(err) {
                            console.error("MySQL Login Query Error:", err.message, err.sql);
                            return reject(new Error(err.message));
                        }
                        
                        // FIX: If results array is NOT 1, the login failed.
                        if (results.length === 1) {
                            const user = results[0];
                    // 2. COMPARE the provided password to the stored hash
                            const isMatch = await bcrypt.compare(password, user.password);

                        if (isMatch) {
                            const { password, ...userData } = user;
                            resolve(userData); // Login success
                    } else {
                        reject(new Error("Invalid username or password.")); // Password mismatch
                    }
                        } else {
                            // Login failed: This explicitly rejects the promise, triggering the 401 response in app.js
                            reject(new Error("Invalid username or password."));
                        }
                    });
                }
            );
            return response;

        } catch(error){
            console.log("Error during login attempt:", error);
            // Re-throw the error to be handled by the controller/route handler
            throw error;
        }
    }
    async updateLastLogin(userId) {
    try {
        await new Promise((resolve, reject) => {
            const query = "UPDATE Users SET signintime = NOW() WHERE id = ?;";
            connection.query(query, [userId], (err, result) => {
                if (err) reject(new Error(err.message));
                resolve(result);
            });
        });
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}
   /**  async insertNewName(name){
        try{
            const dateAdded = new Date();
            const insertId = await new Promise((resolve, reject)=> {
                const query = "INSERT INTO Users(name,date_added) VALUES (?, ?);";
                connection.query(query,[name, dateAdded],(err, result)=>{
                    if(err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });
            return{
                id : insertId,
                name : name,
                dateAdded : dateAdded
            }
        }catch(error){
            console.log(error)
        }
    }**/
    async searchByUserName(username){
        try{
           // const dateAdded = new Date();
             // use await to call an asynchronous function
            const response = await new Promise((resolve, reject) => 
                {
                    const query = "SELECT * FROM Users where username = ?;";
                    connection.query(query, [username], (err, results) => {
                        if(err) reject(new Error(err.message));
                        else resolve(results);
                    });
                }
            );

             // console.log(response);  // for debugging to see the result of select
            return response;

        }  catch(error){
            console.log(error);
        }
}
async searchByFirstName(firstname, lastname) {
    try {
        const response = await new Promise((resolve, reject) => {
            const query = "SELECT * FROM Users WHERE firstname LIKE ?;";
            connection.query(query, [`%${firstname}%`], (err, results) => {
                if (err) reject(new Error(err.message));
                resolve(results);
            });
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}

async searchByLastName(lastname){
    try{
        const response = await new Promise((resolve, reject)=> {
            const query = "SELECT * FROM Users WHERE lastname LIKE ?;"
            connection.query(query, [`%${lastname}%`], (err, results)=>{
                if (err) reject(new Error(err.message));
                resolve(results);
            });
        });
        return response;
    }catch(err){
        console.log(err);
    }
}

// 2. Search by User ID
async searchById(id) {
    try {
        const response = await new Promise((resolve, reject) => {
            const query = "SELECT * FROM Users WHERE id = ?;";
            connection.query(query, [id], (err, results) => {
                if (err) reject(new Error(err.message));
                resolve(results);
            });
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}

// 3. Search by Salary Range
async searchBySalaryRange(minSalary, maxSalary) {
    try {
        const response = await new Promise((resolve, reject) => {
            const query = "SELECT * FROM Users WHERE salary BETWEEN ? AND ?;";
            connection.query(query, [minSalary, maxSalary], (err, results) => {
                if (err) reject(new Error(err.message));
                resolve(results);
            });
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}

// 4. Search by Age Range
async searchByAgeRange(minAge, maxAge) {
    try {
        const response = await new Promise((resolve, reject) => {
            const query = "SELECT * FROM Users WHERE age BETWEEN ? AND ?;";
            connection.query(query, [minAge, maxAge], (err, results) => {
                if (err) reject(new Error(err.message));
                resolve(results);
            });
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}

// 5. Search users who registered today
async searchRegisteredToday() {
    try {
        const response = await new Promise((resolve, reject) => {
            // CURDATE() returns the current date on the MySQL server
            const query = "SELECT * FROM Users WHERE DATE(registerday) = CURDATE();";
            connection.query(query, (err, results) => {
                if (err) reject(new Error(err.message));
                resolve(results);
            });
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}
async searchRegisteredAfterUser(johnId) {
    try {
        const response = await new Promise((resolve, reject) => {
            // Subquery finds 'john's' registerday, then finds users with a later date
            const query = "SELECT * FROM Users WHERE registerday > (SELECT registerday FROM Users WHERE id = ?);";
            connection.query(query, [johnId], (err, results) => {
                if (err) reject(new Error(err.message));
                resolve(results);
            });
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}

// 7. Search users registered on the same day as a specific user
async searchRegisteredSameDay(johnId) {
    try {
        const response = await new Promise((resolve, reject) => {
            // Subquery finds the DATE part of 'john's' registerday
            const query = "SELECT * FROM Users WHERE DATE(registerday) = (SELECT DATE(registerday) FROM Users WHERE id = ?);";
            connection.query(query, [johnId], (err, results) => {
                if (err) reject(new Error(err.message));
                resolve(results);
            });
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}

// 8. Search users who never signed in
async searchNeverSignedIn() {
    try {
        const response = await new Promise((resolve, reject) => {
            // Finds all users where the last_login column is NULL
            const query = "SELECT * FROM Users WHERE signintime IS NULL;";
            connection.query(query, (err, results) => {
                if (err) reject(new Error(err.message));
                resolve(results);
            });
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}
    async deleteRowById(id){
        try{
            id = parseInt(id, 10);
            const response = await new Promise((resolve, reject)=> {
            const query = "DELETE FROM Users WHERE id = ?";
            connection.query(query,[id],(err, result)=>{
                if(err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
        });
        return response === 1 ? true : false;
        }catch(error){
            console.log(error);
            return false;
        }
    }
    /**async updateNameById(id, name){
        try{
            id = parseInt(id, 10);
            const response = await new Promise((resolve, reject)=> {
            const query = "UPDATE Users SET name = ? WHERE id = ?";
            connection.query(query,[name, id],(err, result)=>{
                if(err) reject(new Error(err.message));
                resolve(result.affectedRows);
                })
        });
        return response === 1 ? true : false;
        }catch(error){
            console.log(error);
            return false;
        }
    }**/
}

module.exports = DbService;
