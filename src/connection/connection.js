const mysql = require('mysql')

const conn = mysql.createConnection({
    user: 'root',
    password: 'mysql1234',
    host: 'localhost',
    database: 'pet_travel',
    port: '3308'
})

module.exports = conn