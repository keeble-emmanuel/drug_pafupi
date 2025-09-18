require('dotenv').config();
const mysql = require('mysql');
const fs = require('fs')
const xlsx = require('xlsx');
//const dotenv = require('dotenv');
//import mysql from 'mysql';
const multer = require('multer')
const { z } = require('zod');
const { newUserSchema, newDrugSchema } = require('./schema'); // Adjust the path as needed


// Step 2: Create a single connection pool
const pool = mysql.createPool({
  host: 'sql8.freesqldatabase.com', // From the FreeDB panel
    user: 'sql8798505', // The username you provided
    password: process.env.DB_PASSWORD, // The password you provided
    database: 'sql8798505', // From the FreeDB panel
    port: 3306, // The default MySQL port
});

// Step 3: Define all SQL queries for the tables you want to create
const tableQueries = [
  `CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                city VARCHAR(255),
                phone VARCHAR(255),
                location TEXT
                
            )`,
  ` CREATE TABLE IF NOT EXISTS signin (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                user_id INT,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )`,
  `CREATE TABLE IF NOT EXISTS newdrugs (
                drug_id INT AUTO_INCREMENT PRIMARY KEY,
                user INT,
                genericName VARCHAR(255) NOT NULL,
                tradeName VARCHAR(255) NOT NULL,
                drugStrength VARCHAR(255),
                drugCategory VARCHAR(255),
                drugStockstatus VARCHAR(255),
                route VARCHAR(255),
                dosageForm VARCHAR(255),
                expiryDate DATE,
                price DECIMAL(10, 2),
                promoted BOOLEAN DEFAULT FALSE,
                promoPrice DECIMAL(10, 2),
                FOREIGN KEY (user) REFERENCES users(id) ON DELETE CASCADE
            )`
];

const allTables = [ 'newdrugs',  'signin','users']

const dropTables =(req, res)=>{

try{
     pool.getConnection((err, connection) => {
            const dot=connection.query(`DROP TABLE newdrugs`, (error, results) => {
            // Release the connection back to the pool
            console.log(results, 'ee')
            connection.release(); })
          })
}catch(err){
  console.error(err)
}

}

//dropTables()

// Step 4: Use a function to execute queries sequentially
function createTablesSequentially(queries, callback) {
  if (queries.length === 0) {
    callback();
    return;
  }
  const currentQuery = queries.shift();
  try{
    const dotx = pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection from pool: ' + err.stack);
      //connection.release();
      return;
    }
    
    const dot =connection.query(currentQuery, (error, results) => {
      connection.release();
      if (error) {
        console.error('Error creating table: ' + error.stack);
        return;
      }
      console.log("Table created successfully with query: " + currentQuery.substring(0, 50) + "...");
      createTablesSequentially(queries, callback);
    });
  });
  }
  catch(err){
    console.error(err)
  }
  
}

// Step 5: Call the function to create the tables
createTablesSequentially(tableQueries, () => {
  console.log("All tables have been created successfully.");
});

const getAllUsers = (req, res)=>{
    pool.getConnection((err, connection) => {
    if (err) {
      console.log(err)
      return res.status(500).send('Database connection error');
    }
    
    // Use the connection to query the database
    const dot = connection.query('SELECT * FROM users', (error, results) => {
      // Release the connection back to the pool
      res.send(results);
      console.log(results, 'ee')
      connection.release(); })
    }
  )}

//
   

//getAllUsers()

const storage = multer.diskStorage({  
  destination: (req, file, cb) => {
    const { user_id } =req.params;
    pool.getConnection((err, connection) => {
    if (err) {
      console.log(err)
      return cb(err); // Pass the error to Multer
    }
    
    connection.query('SELECT name FROM users WHERE id = ?', [user_id], (error, results) => {
      connection.release();
      if (error || results.length === 0) {
        return cb(error || new Error('User not found.'));
      }
      const userDir = `uploads/${results[0].name}`;
      
      // Check if the directory exists, if not, create it
      if (!fs.existsSync(userDir)) {
          fs.mkdirSync(userDir, { recursive: true });
      }
      
      cb(null, userDir);
    });
    });
  },
  filename: (req, file, cb) => {
    const { user_id } =req.params;
    pool.getConnection((err, connection) => {
    if (err) {
      console.log(err)
      return cb(err);
    }
    
    connection.query('SELECT name FROM users WHERE id = ?', [user_id], (error, results) => {
      connection.release();
      if (error || results.length === 0) {
        return cb(error || new Error('User not found.'));
      }
      cb(null, `${results[0].name}`);
    });
    });
  }
});




const createNewUser =(req, res)=>{
     // Validate the request body using Zod
    const validationResult = newUserSchema.safeParse(req.body);

    if (!validationResult.success) {
        console.log(validationResult.error.issues, 'validation error')
        return res.status(400).json({ errors: validationResult.error.issues });
    }
    const { name, city, phone, locationOfUser, username, password } = req.body;
    console.log(name, city, phone, locationOfUser, username, password, 'data from front')
    pool.getConnection((err, connection) => {
    if (err) {
     
      return res.status(500).send('Database connection error');
    }
    
    // Use the connection to query the database
    const ins1 = connection.query('INSERT INTO users (name, city, phone) VALUES (?, ?, ?)',
            [name, city, phone], (error, results) => {
      // Release the connection back to the pool
      console.log(results.insertId, 'create user')
      const ins2 = connection.query('INSERT INTO signin (username, password, user_id) VALUES (?, ?, ?)',
            [username, password, results.insertId], (error, results2) => {
      // Release the connection back to the pool
      console.log(results,'ee', results2, 'ee')
      connection.release(); })

      //console.log(ins1.insertId, 'ins1')

    
      })
    })}

const signInfunx = (req, res)=>{
    const { username, password } = req.body;
    if (!username || !password) {
        return res.json({ response: 'incomplete' });
    }
    if(username == 'keebleAdmin' && password == process.env.ADMINPASSWORD){
        return res.json({ entry: 'ok', user_id: 0, url: 'ad12min2' });
    }
    console.log(username, password, 'data from front')
    try{

      pool.getConnection((err, connection) => {
    if (err) {
     
      return res.status(500).send('Database connection error');
    }
    
    // Use the connection to query the database
    const dot = connection.query('SELECT user_id, password FROM signin WHERE username = ? AND password = ?', [username, password], (error, results) => {
      // Release the connection back to the pool
      //console.log(results[0].user_id, 'ee')
      if (results.length > 0 && results[0].password === password) {
        res.json({ entry: 'ok', user_id: results[0].user_id, url: 'dashboard' });
      } else {
        res.json({ entry: 'denied' });
      }
      connection.release(); })
      })

    } catch (err) {
        console.error(err);
        res.send({ entry: 'denied' });
    }

}


// Get a user's products
const getUserproducts = async (req, res) => {
    const { user_id } = req.params;
    const user_idnum = parseInt(user_id, 10);
    console.log(user_idnum, user_id,'user id from front get products')
    try {
      await pool.getConnection((err, connection) => {
    if (err) {
     
      return res.status(500).send('Database connection error');
    }
       const dot = connection.query('SELECT * FROM newdrugs WHERE user = ?', [user_id], (error, results) => {
      // Release the connection back to the pool
      res.send(results)
      console.log(results, 'data from get products')
      connection.release(); })
    })
    } catch (err) {
        console.error(err);
        res.json({ info: [] });
    }
};


const createNewDrug= (req, res)=>{
   // Validate the request body using Zod
    const validationResult = newDrugSchema.safeParse(req.body);

    if (!validationResult.success) {
        return res.status(400).json({ errors: validationResult.error.issues });
    }
    const { user_id, genericName, tradeName, drugStrength, drugCategory, drugStockstatus, route, dosageForm, expiryDate, price } = req.body;
    const parseUserId = parseInt(user_id, 10);
    console.log(user_id, genericName, tradeName, drugStrength, drugCategory, drugStockstatus, route, dosageForm, expiryDate, price)
    
    pool.getConnection((err, connection) => {
      // Always handle errors when getting a connection from the pool
      if (err) {
        console.error('Error getting connection from pool: ' + err.stack);
        return res.status(500).send('Error getting a database connection.');
      }
      
      const sql = 'INSERT INTO newdrugs (user, genericName, tradeName, drugStrength, drugCategory, drugStockstatus, route, dosageForm, expiryDate, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      
      connection.query(sql,
        [parseUserId, genericName, tradeName, drugStrength, drugCategory, drugStockstatus, route, dosageForm, expiryDate, price],
        (error, results) => {
          // Release the connection back to the pool immediately after the query is done
          res.send(results);
          connection.release();

          // Handle the error within the callback
          if (error) {
            console.error('Error inserting drug: ' + error.message);
            return res.status(500).send('Error inserting drug into the database.');
          }
          
          console.log(results, 'create drug');
          
        }
      );
    });
};


const uploadFromExcel = async(req, res)=>{
    const { user_id } = req.params;
    console.log(user_id);

    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        const filePath = req.file.path;
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(worksheet);

        const values = jsonData.map(doc => [
            doc.genericName ? doc.genericName.trim() : null,
            doc.tradeName ? doc.tradeName.trim().toUpperCase() : null,
            doc.drugStrength ? doc.drugStrength.trim() : null,
            doc.drugCategory ? doc.drugCategory.trim() : null,
            doc.drugStockstatus ? doc.drugStockstatus.trim() : null,
            doc.route ? doc.route.trim() : null,
            doc.dosageForm ? doc.dosageForm.trim() : null,
            doc.expiryDate ? new Date(doc.expiryDate) : new Date(),
            doc.price,
            parseInt(user_id, 10)
        ]);

        pool.getConnection((err, connection) => {
            if (err) {
                return res.status(500).send('Database connection error');
            }

            // Start the transaction
            connection.beginTransaction(beginTransactionError => {
                if (beginTransactionError) {
                    connection.release();
                    return res.status(500).send('Transaction error');
                }

                // Step 1: Delete all existing drugs for the user
                const deleteSql = 'DELETE FROM newdrugs WHERE user = ?';
                connection.query(deleteSql, [user_id], (deleteError, deleteResults) => {
                    if (deleteError) {
                        return connection.rollback(() => {
                            connection.release();
                            console.error('Error deleting drugs:', deleteError.message);
                            res.status(500).json({ message: 'Error deleting old records.' });
                        });
                    }

                    console.log(`Successfully deleted ${deleteResults.affectedRows} old records.`);

                    // Step 2: Insert the new data
                    const insertSql = 'INSERT INTO newdrugs (genericName, tradeName, drugStrength, drugCategory, drugStockstatus, route, dosageForm, expiryDate, price, user) VALUES ?';
                    connection.query(insertSql, [values], (insertError, insertResults) => {
                        if (insertError) {
                            return connection.rollback(() => {
                                connection.release();
                                console.error('Error inserting drugs: ' + insertError.message);
                                res.status(500).json({ message: 'An error occurred during the data transfer.' });
                            });
                        }

                        // If both queries succeed, commit the transaction
                        connection.commit(commitError => {
                            if (commitError) {
                                return connection.rollback(() => {
                                    connection.release();
                                    res.status(500).send('Transaction commit error');
                                });
                            }
                            
                            connection.release();
                            fs.unlinkSync(filePath);
                            res.status(200).json({ info: `Successfully inserted ${insertResults.affectedRows} records.` });
                        });
                    });
                });
            });
        });

    } catch (error) {
        console.error('Error during data transfer:', error);
        res.status(500).json({
            message: 'An error occurred during the data transfer.',
            error: error.message
        });
    }
};

const deleteUser = (req, res)=>{
    const { idtodelete } = req.params;
    console.log(idtodelete, 'id to delete')
    pool.getConnection((err, connection) => {
      const dot=connection.query('DELETE FROM users WHERE id = ?', [idtodelete], (error, results) => {
      // Release the connection back to the pool
      const dot2 = connection.query('DELETE FROM signin WHERE user_id = ?', [idtodelete], (error, results) => {
      // Release the connection back to the pool
      })
      const dot3 =connection.query('DELETE FROM newdrugs WHERE user_id = ?', [idtodelete], (error, results) => {
      // Release the connection back to the pool
      res.send({ info: 'deleted' })
      console.log(results, 'ee')
      connection.release(); })
    })
    })}

const changePassword = (req, res)=>{
    const { user_id, oldPassword, newPassword } = req.body;
    console.log(user_id, oldPassword, newPassword, 'data from front')
    pool.getConnection((err, connection) => {
    if (err) {
     
      return res.status(500).send('Database connection error');
    }
    
    // Use the connection to query the database
    const dot = connection.query('SELECT password FROM signin WHERE user_id = ?', [user_id], (error, results) => {
      // Release the connection back to the pool
      console.log(results, 'ee')
      if (results.length > 0 && (results[0].password === oldPassword || oldPassword === process.env.CHANGEPASSWORD)) {
        const dot2 = connection.query('UPDATE signin SET password = ? WHERE user_id = ?', [newPassword, user_id], (error, results2) => {
          // Release the connection back to the pool
          console.log(results2, 'ee')
          res.json({ info: 'changed' });
          connection.release(); 
        });
      } else {
        res.json({ info: 'incorrect' });
        connection.release(); 
      }
    })
    }
  )}


const updateProduct = (req, res)=>{
     // Validate the request body using Zod
    const validationResult = newDrugSchema.safeParse(req.body);

    if (!validationResult.success) {
        return res.status(400).json({ errors: validationResult.error.issues });
    }
    const { user_id,
        product_id, genericName, tradeName, drugStrength, drugCategory, drugStockstatus, route, dosageForm, expiryDate, price } = req.body;
      const parseProductId = parseInt(product_id, 10);
      const parseUserId = parseInt(user_id, 10);
    console.log(user_id, product_id, genericName, tradeName, drugStrength, drugCategory, drugStockstatus, route, dosageForm, expiryDate, price)
    pool.getConnection((err, connection) => {
      const dot=connection.query('UPDATE newdrugs SET genericName = ?, tradeName = ?, drugStrength = ?, drugCategory = ?, drugStockstatus = ?, route = ?, dosageForm = ?, expiryDate = ?, price = ?, user=? WHERE drug_id = ?',
            [genericName, tradeName, drugStrength, drugCategory, drugStockstatus, route, dosageForm, expiryDate, price, parseUserId, parseProductId], (error, results) => {
      // Release the connection back to the pool    
      console.log(results, 'results of update')
      res.send({ info: 'updated' })
      connection.release(); })
    })}

const promoteProduct=(req, res)=>{
    const { productId, promoPrice } = req.body;
    console.log(productId, promoPrice, 'data from front')
    pool.getConnection((err, connection) => {
    if (err) {
     
      return res.status(500).send('Database connection error');
    }
    
    // Use the connection to query the database
    const dot = connection.query('UPDATE newdrugs SET promoted = TRUE, promoPrice = ? WHERE drug_id = ?', [parseInt(promoPrice), parseInt(productId)], (error, results) => {
      // Release the connection back to the pool
      if(error){
        console.error(error)
      }
      console.log(results, 'ee')
      res.json({ info: 'promoted' });
      connection.release(); })
    }
  )}

const depromoteProduct =(req, res)=>{
    const { productId } = req.body;
    pool.getConnection((err, connection) => {
    if (err) {
     
      return res.status(500).send('Database connection error');
    }
    
    // Use the connection to query the database
    const dot = connection.query('UPDATE newdrugs SET promoted = FALSE, promoPrice = ? WHERE drug_id = ?', [0, product_id], (error, results) => {
      // Release the connection back to the pool
      console.log(results, 'ee')
      res.json({ info: 'promoted' });
      connection.release(); })
    }
  )

}

const searchDrug = (req, res) => {
    const { searchWord } = req.body;
    console.log(searchWord, 'data from front', 'oooo')

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Database connection error:', err);
            return res.status(500).send('Database connection error');
        }

        const searchTerm = '.*' + searchWord.split('').join('.*') + '.*';
        const query = 'SELECT * FROM newdrugs WHERE genericName LIKE ? OR tradeName LIKE ? OR drugCategory LIKE ?';

        connection.query(query, [searchTerm, searchTerm, searchTerm], (error, results) => {
            // Release the connection back to the pool
            connection.release();
            if (error) {
                console.error('Database query error:', error);
                return res.status(500).send('Database query error');
            }

            // Create a new array for unique results and a Set to track seen combinations
            const uniqueResults = [];
            const seenCombinations = new Set();

            // Iterate over the results and add only unique items to the new array
            results.forEach(drug => {
                // Create a unique key by combining genericName and tradeName
                const uniqueKey = `${drug.genericName}-${drug.tradeName}`;

                if (!seenCombinations.has(uniqueKey)) {
                    seenCombinations.add(uniqueKey);
                    uniqueResults.push(drug);
                }
            });

            console.log(uniqueResults, 'ee');
            res.send(uniqueResults);
        });
    });
};

const searchedPage = (req, res)=>{
    const { generic, trade } = req.body;
    console.log(generic, trade, 'data from front')
    pool.getConnection((err, connection) => {
    if (err) {
     
      return res.status(500).send('Database connection error');
    }
    
    // Use the connection to query the database   
    const dot = connection.query('SELECT * FROM newdrugs JOIN users ON newdrugs.user = users.id WHERE genericName LIKE ? OR tradeName LIKE ?', [`%${generic}%`, `%${trade}%`], (error, results) => {
      // Release the connection back to the pool
      console.log(results, 'ee')
      res.send(results);
      connection.release(); })
    }
  )}



const updateLocation = (req, res)=>{
    const { user_id, locationOfUser } = req.body;
    console.log(user_id, locationOfUser, 'data from front')
    pool.getConnection((err, connection) => {
    if (err) {
     
      return res.status(500).send('Database connection error');
    }
    
    // Use the connection to query the database
    const dot = connection.query('UPDATE users SET location = ? WHERE id = ?', [JSON.stringify(locationOfUser), user_id], (error, results) => {
      // Release the connection back to the pool
      console.log(results, 'ee')
      res.json({ info: 'updated' });
      connection.release(); })
    }
  )
}

const getUserDetails = (req, res)=>{
    const { user_id } = req.params;
    console.log(user_id, 'user id from params')
    pool.getConnection((err, connection) => {
    if (err) {
     
      return res.status(500).send('Database connection error');
    }
    
    // Use the connection to query the database
    const dot = connection.query('SELECT * FROM users WHERE id = ?', [user_id], (error, results) => {
      // Release the connection back to the pool
    res.send(results);
    console.log(results, 'ee')
    connection.release(); })
    if (err) {console.error(err)}})
    }

const deleteProduct=(req, res)=>{
  const { productId } = req.params;
  pool.getConnection((err, connection) => {
    if (err) {
     
      return res.status(500).send('Database connection error');
    }
    
    // Use the connection to query the database
    const dot = connection.query('DELETE FROM newdrugs WHERE drug_id = ?', [productId], (error, results) => {
      // Release the connection back to the pool
      res.send(results);
      console.log(results, 'from delete drug')
      connection.release(); })
      if (err) {console.error(err)}})
}
const marketDisplay =()=>{
  console.log('ww')
}

module.exports = {
  storage,
  createNewUser,
  getAllUsers,
  signInfunx,
  getUserproducts,
  createNewDrug,
  deleteUser,
  changePassword,
  updateProduct,
  promoteProduct,
  searchDrug,
  searchedPage,
  getUserDetails,
  updateLocation,
  uploadFromExcel,
  deleteProduct,
  depromoteProduct,
  marketDisplay

}
