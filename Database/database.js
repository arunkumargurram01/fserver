const { query } = require('express');
const {createPool} = require('mysql')
const {Promisfy} = require('util')// used for creating async functions by using {async & await} without using promises && Debugging

//Mysql database connection module using "createpool" that is used to do parrallel database queries
const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: process.env.DB_CONNECTION_LIMIT || 10,
});

// Promisify the query function for async/await
pool.query = promisify(pool.query);

//For checking a new user's given mail is already exist or not
const checkMail = async (mail) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT user_name FROM all_users WHERE user_mail = '${mail}'`;
        pool.query(query, (err, res) => {
           
            if (err) {
                console.log('DATABASE ERR Mail check: ' + err);
                reject(err);
            } else {
                resolve(res); // Resolve with the result if needed
            }
        });
    });
};


//Inserting Data into DB for new User
const InsertData = async (username, password, mail) => {
//We must use the "new Promise()" method which compulsarly return a promise whether it is reject or reslove
    return new Promise((resolve, reject) => {
        q1 = `INSERT INTO all_users(user_name, user_pswd, user_mail) VALUES ('${username}', '${password}', '${mail}')`;
        pool.query(q1, (err, res) => {
            if (err) {
                console.log('DATABASE ERR Insert Data : ' + err);
                reject(err);
            } else {
                console.log("Data Inserted Successfully From Insert Data");
                resolve(res); // Resolve with the result if needed
            }
        });
    });
};



const createCartId = async(c_id) => {
    //query in separate variable
    q1 = `UPDATE all_users SET cart_id = ${c_id} WHERE user_id = ${c_id};`;
    pool.query(q1, (err, res) => {
        if(err){
            return console.log('DATABASE ERR FRom CreateCartId : '+err);            
        }
        else{
            return console.log("Data Inserted Successfully from CartID");
        }
    })
}

const userCartTable = async (id) => {
        return new Promise((resolve, reject) => {
            q1 = `CREATE TABLE userTable${id} (
                s_no INT AUTO_INCREMENT PRIMARY KEY,
                 item_id INT NOT NULL
            );`;
            pool.query(q1, (err, res) => {
                if (err) {
                    console.log('DATABASE ERR Insert Data : ' + err);
                    reject(err);
                } else {
                    console.log("Table Created Successfully");
                    resolve(res); // Resolve with the result if needed
                }
            });
        });
    };
    
const addProductId = async (uid, pid) => {
        return new Promise((resolve, reject) => {
            q1 = `INSERT INTO userTable${uid}(item_id) VALUES('${pid}')`;
            pool.query(q1, (err, res) => {
                if (err) {
                    console.log('DATABASE ERR Insert Data : ' + err);
                    reject(err);
                } else {
                    console.log("Item added into database cart");
                    resolve(res); // Resolve with the result if needed
                }
            });
        });
};

const cartdata = async(uid) => {
    return new Promise((resolve, reject) => {
        q = `SELECT s_no, item_id FROM userTable${uid};`
        try{
            pool.query(q, (err, res) => {
                if(err){
                    console.log('DATABASE ERR Insert Data : ' + err);
                    reject(err);
                } 
                else {
                    //console.log("Item retrived succssfully");
                    resolve(res); // Resolve with the result to send the details to the server  
                }
            })
        }
        catch(err){
            Console.log(`ERR From cartData DB query: ${err}`)
        }
    })
}


//Deleting the Cart Item Of a particular user by using userCartTableId and s_no from frontend
const DelItem = async(Uid,s_no) => {
    const query = `DELETE FROM userTable${Uid} WHERE s_no = ${s_no}`
    try{
        const result = await new Promise((resolve, reject) => {
            pool.query(query, (err, result, fields) =>{
                if (err) {
                    console.log('DATABASE ERR : ' + err);
                    reject(err);
                } else {
                    // Resolve the Promise with the retrieved data
                    console.log(`Item deleted `)
                    resolve(result); //reslove means telling something(data) is returned to the promise
                }
            });
        })
    }
    catch(err){
        console.log(`Error From Deleting Cart Item`)
    }
}



//Retriving data from the DBMS using async function by given Id
const RetriveData = async (id) => {
    const select_users = `SELECT * FROM all_users WHERE user_id = ${id};`;
    try {
        const result = await new Promise((resolve, reject) => {
            pool.query(select_users, (err, res, fields) => {
                if (err) {
                    console.log('DATABASE ERR : ' + err);
                    reject(err);
                } else {
                    // Resolve the Promise with the retrieved data
                    //console.log(res)
                    resolve(res); //reslove means telling something(data) is returned to the promise
                }
            });
        });
        return result;
    } 
    catch (err) {
        console.log(`ERROR Occurred : ${err}`);
        throw err;
    }
};

const profileData = async(id) => {
    const select_users = `SELECT user_name FROM all_users WHERE user_id = ${id};`;
    try {
        const result = await new Promise((resolve, reject) => {
            pool.query(select_users, (err, res, fields) => {
                if (err) {
                    console.log('DATABASE ERR : ' + err);
                    reject(err);
                } else {
                    // Resolve the Promise with the retrieved data
                    //console.log(`From profileData DB : ${res}`);
                    resolve(res); //reslove means telling something(data) is returned to the promise
                }
            });
        });
        return result;
    } 
    catch (err) {
        console.log(`ERROR Occurred : ${err}`);
        throw err;
    }
}

const allUsers = async() => {
    try{ 
        query1 = `SELECT user_id,user_name FROM all_users;`;
        const result = await new Promise((resolve, reject) => {
            pool.query(query1, (err, res, fields) => {
                if (err) {
                    console.log('DATABASE ERR : ' + err);
                    reject(err);
                } else {
                    // Resolve the Promise with the retrieved data
                    console.log(`From profileData DB : ${res}`);
                    resolve(res); //reslove means telling something(data) is returned to the promise
                }
            });
        });
        return result;
    }
    catch(err){
        console.log(`ERR from allusers DB : ${err}`);
    }
}




 //Same query for above query by using only (async & await) without using "promises"
/* const RetriveData = async (id) => {
    // Retrieving Data from DB
    console.log(`Id = ${id}`);
    //Query
    const select_users = `SELECT * FROM users WHERE user_id = ${id};`;

    try {
        const result = await pool.query(select_users);
        console.log(result)
        return result;
    } catch (err) {
        console.log(`ERROR Occurred : ${err}`);
        throw err;
    }
}; */ 



//Login User credentials check
async function credentialsCheck(usermail) {
    const check_query = `SELECT user_id,user_pswd FROM all_users WHERE user_mail='${usermail}';`;
//Here we used "new promise(res,rej){...}" to control the overall async pool.query and give output.
    return new Promise((resolve, reject) => {
        pool.query(check_query, (err, res) => {
            if (err) {
                reject('Error querying the database');
            } else {
                if (res.length === 0) {
                    reject('User not found'); //sending response as result of function call
                } else {
/*                     console.log('User Found = ', res);
                    console.log(`Pass = ${res[0].user_pswd}`); */
                    const result = res[0].user_pswd;
                    const result2 = res[0].user_id;
                    resolve({user_Id : result2, user_Pwd : result}); //sending response as result of function call
                }
            }
        });
    });
}

//Login User credentials check
async function admincredentialsCheck(usermail) {
    const check_query = `SELECT user_id,user_pwd FROM admin WHERE user_mail='${usermail}';`;
//Here we used "new promise(res,rej){...}" to control the overall async pool.query and give output.
    return new Promise((resolve, reject) => {
        pool.query(check_query, (err, res) => {
            if (err) {
                reject('Error querying the database');
            } else {
                if (res.length === 0) {
                    //console.log(`user not found`)
                    reject('User not found'); //sending response as result of function call
                } else {
/*                     console.log('User Found = ', res);
                    console.log(`Pass = ${res[0].user_pswd}`); */
                    const result = res[0].user_pwd;
                    const result2 = res[0].user_id;
                    resolve({user_Id : result2, user_Pwd : result}); //sending response as result of function call
                }
            }
        });
    });
}

//Method to check who access the allusers details must be a admin not a user
const adminCheck = async(id) => {
    try{ 
        query1 = `SELECT user_name FROM admin WHERE user_id=${id};`;
        const result = await new Promise((resolve, reject) => {
            pool.query(query1, (err, res, fields) => {
                if (err) {
                    console.log('DATABASE ERR : ' + err);
                    reject(err);
                } else {
                    // Resolve the Promise with the retrieved data
                    console.log(`From adminCheck DB : ${res}`);
                    resolve(res); //reslove means telling something(data) is returned to the promise
                }
            });
        });
        return result;
    }
    catch(err){
        console.log(`ERR from adminCheck DB : ${err}`);
    }
}

const InsertCart = async(item,id) => {
    try{
        const query = `INSERT INTO user_cart(Item_Name, Item_Id) VALUES (${item.name}, ${item.id}) WHERE user_id=${id};`
        const result = await pool.query()
    }
    catch(err){

    }
}






const cost = 1000

exports.Rcost = cost;
exports.Rfun= RetriveData;
exports.checkMail = checkMail;
exports.retriveData = RetriveData;
exports.insertData = InsertData;
exports.createCartId = createCartId;
exports.CartTable = userCartTable;
exports.addToCart = addProductId;
exports.cartData = cartdata;
exports.delItem = DelItem;
exports.profileData = profileData;
exports.allUsers = allUsers;
exports.adminCheck = adminCheck;
exports.admincredentialsCheck = admincredentialsCheck;
exports.credentialsCheck = credentialsCheck;
