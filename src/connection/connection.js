const mysql = require('mysql')

const conn = mysql.createConnection({
    user: 'root',
    password: 'Vya22Feb1994',
    host: 'localhost',
    database: 'pet_travel',
    port: '3306'
})
conn.on('error', function(err) {
    if (err.fatal)
        startConnection();
});

module.exports = conn