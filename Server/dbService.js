const mysql = require('mysql')
const dotenv = require('dotenv')
dotenv.config();

let instance = null;

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
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
    async insertNewName(name){
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
    }
    async searchByName(name){
        try{
            const dateAdded = new Date();
             // use await to call an asynchronous function
            const response = await new Promise((resolve, reject) => 
                {
                    const query = "SELECT * FROM Users where name = ?;";
                    connection.query(query, [name], (err, results) => {
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
    async updateNameById(id, name){
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
    }
}

module.exports = DbService;