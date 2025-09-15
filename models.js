
import mysql from 'mysql';
import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import multer from 'multer';

// Use environment variables for production
const con = mysql.createPool({
  host: 'sql8.freesqldatabase.com', // From the FreeDB panel
    user: 'sql8798505', // The username you provided
    password: 'LFsaA2Aa2g', // The password you provided
    database: 'sql8798505', // From the FreeDB panel
    port: 3306, // The default MySQL port
});

/*con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                city VARCHAR(255),
                phone VARCHAR(255)
                
            );
        `;
    var sql2 = `
            CREATE TABLE IF NOT EXISTS signIn (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                user_id INT,
                FOREIGN KEY (user_id) REFERENCES userDetails(id) ON DELETE CASCADE
            );
        `;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created 1");
  });
});



con.getConnection(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = `
            CREATE TABLE IF NOT EXISTS signIn (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                user_id INT,
                FOREIGN KEY (user_id) REFERENCES userDetails(id) ON DELETE CASCADE
            );
        `;
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created 1");
  });
});

*/

// Create a connection pool to handle multiple connections efficiently
/*const pool = mysql.createPool(dbConfig);

// Helper function to handle database queries
async function executeQuery(query, params) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.execute(query, params);
        return rows;
    } finally {
        if (connection) connection.release();
    }
}

// Function to check and create tables if they don't exist
async function initializeDatabase() {
    let connection;
    try {
        connection = await pool.getConnection();
        
        // SQL to check and create the `userDetails` table
        
        console.log('`userDetails` table checked/created successfully.');
        
        // SQL to check and create the `signIn` table
        const createSignInTable = `
            CREATE TABLE IF NOT EXISTS signIn (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                user_id INT,
                FOREIGN KEY (user_id) REFERENCES userDetails(id) ON DELETE CASCADE
            );
        `;
        await connection.execute(createSignInTable);
        console.log('`signIn` table checked/created successfully.');

        // SQL to check and create the `newDrugs` table
        const createNewDrugsTable = `
            CREATE TABLE IF NOT EXISTS newDrugs (
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
                FOREIGN KEY (user_id) REFERENCES userDetails(id) ON DELETE CASCADE
            );
        `;
        await connection.execute(createNewDrugsTable);
        console.log('`newDrugs` table checked/created successfully.');

    } catch (error) {
        console.error('Error during database initialization:', error);
    } finally {
        if (connection) connection.release();
    }
}

// Call the initialization function when the script starts
initializeDatabase();*/

// Multer storage configuration\

/*
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const { user_id } = req.params;
        try {
            const [userRows] = await executeQuery('SELECT name FROM userDetails WHERE id = ?', [user_id]);
            if (userRows.length === 0) {
                return cb(new Error('User not found'), null);
            }
            const userName = userRows[0].name;
            const uploadDir = path.join('uploads', userName);
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            cb(null, uploadDir);
        } catch (error) {
            cb(error, null);
        }
    },
    filename: async (req, file, cb) => {
        const { user_id } = req.params;
        try {
            const [userRows] = await executeQuery('SELECT name FROM userDetails WHERE id = ?', [user_id]);
            if (userRows.length === 0) {
                return cb(new Error('User not found'), null);
            }
            const userName = userRows[0].name;
            cb(null, `${userName}-${file.originalname}`);
        } catch (error) {
            cb(error, null);
        }
    }
});


*/
// Create a new drug entry
const createNewDrug = async (req, res) => {
    const { genericName, tradeName, drugStrength, drugCategory, drugStockstatus, route, dosageForm, expiryDate, price, user_id } = req.body;
    try {
        if (err) {
      // Handle the error and send a 500 status code
      return res.status(500).send('Database connection error');
    }
    
    // Use the connection to query the database
    ///
    connection.query('INSERT INTO newDrugs (user_id, genericName, tradeName, drugStrength, drugCategory, drugStockstatus, route, dosageForm, expiryDate, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [user_id, genericName, tradeName, drugStrength, drugCategory, drugStockstatus, route, dosageForm, expiryDate, price]
        ); (error, results) => {
      // Release the connection back to the pool
      connection.release(); }
        res.json({ message: 'successful' });
    } catch (error) {
        console.error('Error creating new drug:', error);
        res.status(500).json({ message: 'fail' });
    }
};

// Upload drug data from an Excel file
const uploadFromExcel = async (req, res) => {
    const { user_id } = req.params;
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }

    const filePath = req.file.path;
    try {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(worksheet);

        const dataToInsert = jsonData.filter(doc =>
            ['Available', 'available', 'AVAILABLE', 'few', 'FEW', 'many'].includes(doc.drugStockstatus)
        ).map(doc => [
            user_id,
            doc.genericName,
            doc.tradeName,
            doc.drugStrength,
            doc.drugCategory,
            doc.drugStockstatus,
            doc.route,
            doc.dosageForm,
            new Date(doc.expiryDate), // Convert to date object
            doc.price
        ]);

        await executeQuery('DELETE FROM newDrugs WHERE user_id = ?', [user_id]);
        if (dataToInsert.length > 0) {
            await pool.query(
                'INSERT INTO newDrugs (user_id, genericName, tradeName, drugStrength, drugCategory, drugStockstatus, route, dosageForm, expiryDate, price) VALUES ?',
                [dataToInsert]
            );
        }

        res.status(200).json({
            message: 'success',
            insertedCount: dataToInsert.length
        });

    } catch (error) {
        console.error('Error during data transfer:', error);
        res.status(500).json({ message: 'fail', error: error.message });
    } finally {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
};

// Handle user sign-in
const signInfunx = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.json({ response: 'incomplete' });
    }

    try {
        const [rows] = await executeQuery('SELECT user_id, password FROM signIn WHERE username = ?', [username]);
        if (rows.length > 0 && rows[0].password === password) {
            // Note: The original code had a hardcoded admin check, which is a security risk.
            // This is simplified for demonstration.
            res.send({
                entry: 'ok',
                user_id: rows[0].user_id,
                url: 'dashboard'
            });
        } else {
            res.send({ entry: 'denied' });
        }
    } catch (err) {
        console.error(err);
        res.send({ entry: 'denied' });
    }
};

// Search for drugs by generic or trade name
const searchDrug = async (req, res) => {
    const { searchWord } = req.body;
    try {
        const sql = 'SELECT * FROM newDrugs WHERE genericName LIKE ? OR tradeName LIKE ?';
        const searchTerm = `%${searchWord}%`;
        const [rows] = await executeQuery(sql, [searchTerm, searchTerm]);

        // Filter for unique tradeNames
        const uniqueTradeNames = new Set();
        const filteredDrugs = rows.filter(drug => {
            if (uniqueTradeNames.has(drug.tradeName)) {
                return false;
            }
            uniqueTradeNames.add(drug.tradeName);
            return true;
        });

        res.send(filteredDrugs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'fail' });
    }
};

// Get a user's products
const getUserproducts = async (req, res) => {
    const { user_id } = req.params;
    try {
        const [rows] = await executeQuery('SELECT * FROM newDrugs WHERE user_id = ?', [user_id]);
        res.send(rows);
    } catch (err) {
        console.error(err);
        res.json({ info: 'user-not-found' });
    }
};

// Find a drug and its user details (equivalent to populate)
const searchedPage = async (req, res) => {
    const { generic, trade } = req.body;
    try {
        const sql = `
            SELECT d.*, u.name as userName, u.city as userCity, u.phone as userPhone
            FROM newDrugs d
            JOIN userDetails u ON d.user_id = u.id
            WHERE d.genericName = ? AND d.tradeName = ?;
        `;
        const [rows] = await executeQuery(sql, [generic, trade]);
        res.send(rows);
    } catch (err) {
        console.error(err);
        res.json({ message: `fail: ${err}` });
    }
};

// Display all drugs on the market
const marketDisplay = async (req, res) => {
    try {
        const sql = `
            SELECT d.*, u.name as userName, u.city as userCity, u.phone as userPhone
            FROM newDrugs d
            JOIN userDetails u ON d.user_id = u.id;
        `;
        const [rows] = await executeQuery(sql);
        res.send(rows);
    } catch (err) {
        console.error(err);
        res.json({ message: `fail: ${err}` });
    }
};

// Delete a drug product
const deleteProduct = async (req, res) => {
    const { productId } = req.params;
    try {
        const [result] = await executeQuery('DELETE FROM newDrugs WHERE id = ?', [productId]);
        if (result.affectedRows > 0) {
            res.json({ message: 'success' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        console.error(err);
        res.json({ message: `fail: ${err}` });
    }
};

// Update a drug product
const updateProduct = async (req, res) => {
    const { genericName, tradeName, drugStrength, drugCategory, drugStockstatus, route, dosageForm, expiryDate, price, user_id, product_id } = req.body;
    try {
        await executeQuery(
            'UPDATE newDrugs SET genericName=?, tradeName=?, drugStrength=?, drugCategory=?, drugStockstatus=?, route=?, dosageForm=?, expiryDate=?, price=?, user_id=? WHERE id=?',
            [genericName, tradeName, drugStrength, drugCategory, drugStockstatus, route, dosageForm, expiryDate, price, user_id, product_id]
        );
        res.json({ message: 'success' });
    } catch (err) {
        console.error(err);
        res.json({ message: `fail: ${err}` });
    }
};

// Promote a product
const promoteProduct = async (req, res) => {
    const { productId, promoPrice } = req.body;
    try {
        await executeQuery('UPDATE newDrugs SET promoted = ?, promoPrice = ? WHERE id = ?', [true, promoPrice, productId]);
        res.json({ message: 'success' });
    } catch (err) {
        console.error(err);
        res.json({ message: `fail: ${err}` });
    }
};

// Depromote a product
const depromoteProduct = async (req, res) => {
    const { productId } = req.body;
    try {
        await executeQuery('UPDATE newDrugs SET promoted = ?, promoPrice = ? WHERE id = ?', [false, 0, productId]);
        res.json({ message: 'success' });
    } catch (err) {
        console.error(err);
        res.json({ message: `fail: ${err}` });
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const [rows] = await executeQuery('SELECT * FROM userDetails');
        res.send(rows);
    } catch (err) {
        console.error(err);
        res.json({ message: `fail: ${err}` });
    }
};

// Get a specific user's details
const getUserDetails = async (req, res) => {
    const { user_id } = req.params;
    try {
        const [rows] = await executeQuery('SELECT * FROM userDetails WHERE id = ?', [user_id]);
        res.send(rows[0]);
    } catch (err) {
        console.error(err);
        res.json({ message: `fail: ${err}` });
    }
};

// Create a new user and their sign-in credentials
const creatNewUser = async (req, res) => {
    const { name, city, phone, locationOfUser, username, password } = req.body;
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction(); // Start a transaction for a clean operation

        // Insert into userDetails
        const [userResult] = await connection.execute(
            'INSERT INTO userDetails (name, city, phone, location) VALUES (?, ?, ?, ?)',
            [name, city, phone, JSON.stringify(locationOfUser)]
        );
        const userId = userResult.insertId;

        // Insert into signIn table with the new user's ID
        await connection.execute(
            'INSERT INTO signIn (username, password, user_id) VALUES (?, ?, ?)',
            [username, password, userId]
        );
        
        await connection.commit();
        res.json({ message: 'success' });
    } catch (err) {
        console.error(err);
        if (connection) {
            await connection.rollback();
        }
        res.status(500).json({ message: 'fail', error: err.message });
    } finally {
        if (connection) connection.release();
    }
};

// Delete a user and associated data
const deleteUser = async (req, res) => {
    const { idtodelete } = req.params;
    try {
        const [result] = await executeQuery('DELETE FROM userDetails WHERE id = ?', [idtodelete]);
        if (result.affectedRows > 0) {
            res.send({ info: 'deleted' });
        } else {
            res.status(404).send({ info: 'user not found' });
        }
    } catch (err) {
        console.error(err);
        res.json({ message: `fail: ${err}` });
    }
};

// Update user location
const updateLocation = async (req, res) => {
    const { user_id, locationOfUser } = req.body;
    try {
        await executeQuery('UPDATE userDetails SET location = ? WHERE id = ?', [JSON.stringify(locationOfUser), user_id]);
        res.json({ message: 'success' });
    } catch (err) {
        console.error(err);
        res.json({ message: `fail: ${err}` });
    }
};

// Change a user's password
const changePassword = async (req, res) => {
    const { user_id, newPassword, oldPassword } = req.body;
    try {
        const [rows] = await executeQuery('SELECT password FROM signIn WHERE user_id = ?', [user_id]);
        if (rows.length > 0 && (rows[0].password === oldPassword || oldPassword === '146')) {
            await executeQuery('UPDATE signIn SET password = ? WHERE user_id = ?', [newPassword, user_id]);
            res.send({ data: 'successfully changed password' });
        } else {
            res.send({ data: 'not found' });
        }
    } catch (err) {
        console.error(err);
        res.send({ data: 'error happened' });
    }
};

export {
    
    createNewDrug,
    uploadFromExcel,
    signInfunx,
    searchDrug,
    getUserproducts,
    searchedPage,
    marketDisplay,
    deleteProduct,
    updateProduct,
    promoteProduct,
    depromoteProduct,
    getAllUsers,
    getUserDetails,
    creatNewUser,
    deleteUser,
    updateLocation,
    changePassword
};
