const http = require('http');
const sql = require('mysql2');

var con = sql.createConnection({
    host: "localhost",
    user: "root",
    password: "root@123",
    database: "Reyoca_DB"
});
// TEMPLATE FOR QUERY
con.connect(function(err) {
    if (err) throw err;
    var sql = "SELECT * FROM employee_details WHERE employee_id IN ("+ids+")";
    con.query(sql, function (err, result) {
        if (err){
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('Requested record not cound the the database. Change the primary key');
            return;
        };
        // console.log(typeof result);
        result=JSON.stringify(result)
        // console.log(result)
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(result);
    });
});