const router = require("express").Router();
const conn = require("../connection/connection");
const multer = require("multer");
const path = require("path"); // Menentukan folder uploads
const fs = require("fs"); // menghapus file gambar

const uploadPayment = path.join(__dirname + '/../payment' )

const storagE = multer.diskStorage({
    
    filename : function(req, file, cb) {
        cb(null, Date.now() + file.fieldname + path.extname(file.originalname))
    },
    // Destination
    destination : function(req, file, cb) {
        cb(null,uploadPayment)
    }
})

const upload = multer ({
    storage: storagE,
    limits: {
        fileSize: 100000000 // Byte
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){ // will be error if the extension name is not one of these
            return cb(new Error('Please upload image file (jpg, jpeg, or png)')) 
        }
        cb(undefined, cb)
    }
})

//link image pet
router.get('/payment/images/:image', (req,res) => {
  res.sendFile(`${uploadPayment}/${req.params.image}`)
})

//place order

// router.post('/ordering', (req,res) => {
//     const sql = `INSERT INTO order_travel SET ?`
//     const data = req.body

//     conn.query(sql,data, (err,result) => {
//         if (err) return res.send(err.message);

//         const orderid = result[0].insertId

//         const sql2 = `INSERT INTO order_travel_item  `
//     })
// })