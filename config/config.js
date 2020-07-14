const mysql = require('mysql');
var connection = mysql.createConnection({multipleStatements: true});
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '2852',
    database: 'example1',
    dateStrings: 'date',
    multipleStatements: true
});

module.exports = pool;