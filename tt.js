var mysql = require('mysql');

var con = mysql.createConnection({
  host: 'sql8.freesqldatabase.com', // From the FreeDB panel
    user: 'sql8798505', // The username you provided
    password: 'LFsaA2Aa2g', // The password you provided
    database: 'sql8798505', // From the FreeDB panel
    port: 3306, // The default MySQL port
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "CREATE TABLE IF NOT EXISTS customers (name VARCHAR(255), address VARCHAR(255))";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
});