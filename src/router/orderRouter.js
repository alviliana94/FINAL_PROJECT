const router = require("express").Router();
const conn = require("../connection/connection");
const multer = require("multer"); // untuk upload foto
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

//order travel
router.post('/ordertravel/:userid', (req,res) => {
    const date = new Date()
    const data = req.body
    const order_code = `${req.params.userid}${date.getMilliseconds}${Math.floor((Math.random() * 10000))}`
    const sql = `INSERT INTO order_travel (order_code,user_id,order_status,order_origin,order_destination) values (${order_code},${req.params.userid},0,${data.order_origin},${data.order_destination})`

    conn.query(sql, (err,result) => {
        if (err) return res.send(err.message);

        const orderid = result.insertId

        res.send({orderid,result})
    })
})
//order product
router.post('/orderproduct/:userid', (req,res) => {
    const date = new Date()
    const data = req.body
    const order_code = `${req.params.userid}${date.getMilliseconds}${Math.floor((Math.random() * 10000))}`
    const sql = `INSERT INTO order_product (order_code,user_id,order_status,order_origin,order_destination) values (${order_code},${req.params.userid},0,${data.order_origin},${data.order_destination})`

    conn.query(sql,data, (err,result) => {
        if (err) return res.send(err.message);

        const orderid = result.insertId

        res.send({orderid,result})
    })
})
//order item product
router.post('/orderproduct/item', (req,res) => {
    const data = req.body
    
    data[0].forEach(item => {
        const sql = `insert into order_item_product (order_id,product_price_id,quantity) values (${item})`
        conn.query(sql, [data], (err,result) => {
            if (err) return res.send(err.message);
            
            res.send(result)
        })
    })
})
//order item travel
router.post('/ordertravel/item', (req,res) => {
    const data = req.body
    
    data[0].forEach(item => {
        const sql = `insert into order_item_travel (order_id,travel_price_id,quantity) values (${item})`
        conn.query(sql, [data], (err,result) => {
            if (err) return res.send(err.message);
            
            res.send(result)
        })
    })
})

//combine order
router.post('/orders', (req,res) => {
    const sql = `insert into orders set ?`
    const data = req.body

    conn.query(sql,data, (err,result) => {
        if (err) return res.send(err.message);

        res.send({orderid,result})
    })


})

module.exports = router