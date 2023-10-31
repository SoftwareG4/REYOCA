const http = require('http');
const sql = require('mysql2');

var con = sql.createConnection({
    host: "localhost",
    user: "root",
    password: "root@123",
    database: "Reyoca_DB"
});

