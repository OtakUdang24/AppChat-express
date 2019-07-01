'user strict';
const mysql = require('mysql')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'groupchat'
})

connection.connect(function(err) {
    if (err) throw err;
});

module.exports = { 
    secret: 'REACT' ,
    db : connection
};