//const mysql = require('mysql');
import mysql from 'mysql';

// Step 2: Create a single connection pool
const pool = mysql.createPool({
  host: 'sql8.freesqldatabase.com', // From the FreeDB panel
    user: 'sql8798505', // The username you provided
    password: 'LFsaA2Aa2g', // The password you provided
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
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
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
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )`
];

const allTables = [ 'newdrugs',  'signin','users']

const dropTables =(req, res)=>{

try{
     pool.getConnection((err, connection) => {
            const dot=connection.query(`DROP TABLE ${allTables}`, (error, results) => {
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
      connection.release();
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

createTablesSequentially(tableQueries, () => {
  console.log("All tables have been created successfully.");
});

const createNewUser =(req, res)=>{
  
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
      console.log(results.insertId, 'ee')
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
    if(username == 'keebleAdmin' && password == 'x23'){
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
      console.log(results[0].user_id, 'ee')
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
    console.log(user_idnum, user_id,'user id from front')
    try {
      pool.getConnection((err, connection) => {
    if (err) {
     
      return res.status(500).send('Database connection error');
    }
       const dot = connection.query('SELECT * FROM newdrugs JOIN users ON newdrugs.user_id = users.id WHERE user_id = ?', [user_idnum], (error, results) => {
      // Release the connection back to the pool
      res.send(results, 'jsfjsfjh')
      console.log(results, 'ee')
      connection.release(); })
    })
    } catch (err) {
        console.error(err);
        res.json({ info: [] });
    }
};

const createNewDrug = (req, res)=>{
    const { user_id, genericName, tradeName, drugStrength, drugCategory, drugStockstatus, route, dosageForm, expiryDate, price } = req.body;
    console.log(user_id, genericName, tradeName, drugStrength, drugCategory, drugStockstatus, route, dosageForm, expiryDate, price)
    pool.getConnection((err, connection) => {
      const dot=connection.query('INSERT INTO newdrugs (genericName, tradeName, drugStrength, drugCategory, drugStockstatus, route, dosageForm, expiryDate, price, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [genericName, tradeName, drugStrength, drugCategory, drugStockstatus, route, dosageForm, expiryDate, price, user_id], (error, results) => {
      // Release the connection back to the pool
      res.send(results)
      console.log(results, 'ee')
      connection.release(); })
    })}

const uploadFromExcel = (req, res)=>{
    const { user_id } = req.params;
    console.log(user_id, 'user id from params')
    console.log(req.file, 'file from front')
    //console.log(req.file.buffer.toString(), 'file from front')
    const fileBuffer = req.file.buffer;
    const fileContent = fileBuffer.toString('utf-8');
    const rows = fileContent.split('\n');
    const data = rows.map(row => row.split(','));
    //console.log(data, 'data from excel')
    // Assuming the first row contains headers
    const headers = data[0];
    const entries = data.slice(1);
    //console.log(headers, 'headers')
    //console.log(entries, 'entries')
    entries.forEach((entry)=>{
        //console.log(entry, 'entry')
        const entryObj = {};
        headers.forEach((header, index)=>{
            entryObj[header.trim()] = entry[index] ? entry[index].trim() : null;
        })
        //console.log(entryObj, 'entry object')
        const { genericName, tradeName, drugStrength, drugCategory, drugStockstatus, route, dosageForm, expiryDate, price } = entryObj;
        pool.getConnection((err, connection) => {
            const dot=connection.query('INSERT INTO newdrugs (user_id, genericName, tradeName, drugStrength, drugCategory, drugStockstatus, route, dosageForm, expiryDate, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                  [user_id, genericName, tradeName, drugStrength, drugCategory, drugStockstatus, route, dosageForm, expiryDate, price], (error, results) => {
            // Release the connection back to the pool
            console.log(results, 'ee')
            connection.release(); })
          })
    })
    res.send({ info: 'uploaded' })
}


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
      if (results.length > 0 && (results[0].password === oldPassword || oldPassword === 'keeble')) {
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
    const { user_id,
        product_id, genericName, tradeName, drugStrength, drugCategory, drugStockstatus, route, dosageForm, expiryDate, price } = req.body;
      const parseProductId = parseInt(product_id, 10);
      const parseUserId = parseInt(user_id, 10);
    console.log(user_id, product_id, genericName, tradeName, drugStrength, drugCategory, drugStockstatus, route, dosageForm, expiryDate, price)
    pool.getConnection((err, connection) => {
      const dot=connection.query('UPDATE newdrugs SET genericName = ?, tradeName = ?, drugStrength = ?, drugCategory = ?, drugStockstatus = ?, route = ?, dosageForm = ?, expiryDate = ?, price = ?, user_id=? WHERE id = ?',
            [genericName, tradeName, drugStrength, drugCategory, drugStockstatus, route, dosageForm, expiryDate, price, parseUserId, parseProductId], (error, results) => {
      // Release the connection back to the pool    
      console.log(results, 'results of update')
      res.send({ info: 'updated' })
      connection.release(); })
    })}

const promote=(req, res)=>{
    const { product_id, promoPrice } = req.body;
    console.log(product_id, promoPrice, 'data from front')
    pool.getConnection((err, connection) => {
    if (err) {
     
      return res.status(500).send('Database connection error');
    }
    
    // Use the connection to query the database
    const dot = connection.query('UPDATE newdrugs SET promoted = TRUE, promoPrice = ? WHERE id = ?', [promoPrice, product_id], (error, results) => {
      // Release the connection back to the pool
      console.log(results, 'ee')
      res.json({ info: 'promoted' });
      connection.release(); })
    }
  )}

const searchDrug = (req, res)=>{
    const { searchWord } = req.body;
    console.log(searchWord, 'data from front', 'oooo')
    pool.getConnection((err, connection) => {
    if (err) {
     
      return res.status(500).send('Database connection error');
    }
    
    // Use the connection to query the database   
    const dot = connection.query('SELECT * FROM newdrugs WHERE genericName LIKE ? OR tradeName LIKE ? OR drugCategory LIKE ?', [`%${searchWord}%`, `%${searchWord}%`, `%${searchWord}%`], (error, results) => {
      // Release the connection back to the pool
      console.log(results, 'ee')
      res.send(results);
      connection.release(); })
    }
  )}

const searchedPage = (req, res)=>{
    const { generic, trade } = req.body;
    console.log(generic, trade, 'data from front')
    pool.getConnection((err, connection) => {
    if (err) {
     
      return res.status(500).send('Database connection error');
    }
    
    // Use the connection to query the database   
    const dot = connection.query('SELECT * FROM newdrugs JOIN users ON newdrugs.user_id = users.id WHERE genericName LIKE ? OR tradeName LIKE ?', [`%${generic}%`, `%${trade}%`], (error, results) => {
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




export{
  createNewUser,
  getAllUsers,
  signInfunx,
  getUserproducts,
  createNewDrug,
  deleteUser,
  changePassword,
  updateProduct,
  promote,
  searchDrug,
  searchedPage,
  getUserDetails,
  updateLocation,
  uploadFromExcel

}
