const router = require("express").Router();
const conn = require("../connection/connection");

//get city
router.get('/city',(req,res) => {
    const sql = `SELECT DISTINCT kabupaten FROM tbl_kodepos`
    const sql2 = `SELECT DISTINCT kabupaten FROM tbl_kodepos LIMIT 11`

    conn.query(sql,(err,result) => {
        if (err) return res.send(err.sqlMessage);
        
        conn.query(sql2,(err,result2) => {
            if (err) return res.send(err.sqlMessage);

            res.send({result,result2})
        })
    })
})

module.exports = router