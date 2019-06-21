const router = require('express').Router()
const bcrypt = require('bcryptjs') //untuk encrypt(kode di rahasiakan) password
const isEmail = require('validator/lib/isEmail')
const {sendMail} = require('../email/nodemailer')
const conn = require('../connection/connection')
const multer = require('multer')
const path = require('path') // Menentukan folder uploads
const fs = require('fs') // menghapus file gambar

const uploadDir = path.join(__dirname + '/../uploads' )

//create users
router.post('/user/register', async (req, res) => { // CREATE USER
    var sql = `INSERT INTO user SET ?;` // Tanda tanya akan digantikan oleh variable data
    var data = req.body 
    
    // validasi untuk email
    if(!isEmail(req.body.email)) return res.send("Email is not valid")
    // ubah password yang masuk dalam bentuk hash
    req.body.password = await bcrypt.hash(req.body.password, 8)
    
    conn.query(sql, data, (err, result) => {
      if(err) return res.send(err.sqlMessage) // Error pada post data
      
      // sendVerify(req.body.username, req.body.name, req.body.email)
      sendMail(req.body.username, req.body.email)
      var sql2 = `update user set role = '2' where id = ${result.insertId}`
      
        conn.query(sql2, (err, result) => {
            if(err) return res.send(err) // Error pada select data

            res.send(result)
        })
    })
})
//verify users
router.get('/verify', (req, res) => {
    const username = req.query.username
    const sql = `UPDATE user SET verified = true WHERE username = '${username}'`
    const sql2 = `SELECT * FROM user WHERE username = '${username}'`

    conn.query(sql, (err, result) => {
        if(err) return res.send(err.sqlMessage)

        conn.query(sql2, (err, result) => {
            if(err) return res.send(err.sqlMessage)

            res.send('<a href="http://localhost:3000/login">Verifikasi berhasil,klik untuk login</a>')
        })
    })
})

//login users
router.post('/users/login', (req, res) => { 
    const {username, password} = req.body

    const sql = `SELECT * FROM user WHERE username = '${username}' or email = '${username}'`

    conn.query(sql, async (err, result) => {
        if(err) return res.send(err.message) 

        const user = result[0] 
        console.log(result);
        
        
        if(!user) return res.status(400).send("User not found") 

        if(!user.verified) return res.status(400).send("Please, verify your email") 

        const hash = await bcrypt.compare(password, user.password) 

        if(!hash) return res.status(400).send("Wrong password")
        
        res.send(user) 
    })
})
router.post('/admin/login', (req, res) => { 
    const {username, password} = req.body

    const sql = `SELECT * FROM user WHERE username = '${username}'`

    conn.query(sql, async (err, result) => {
        if(err) return res.send(err.message) 

        const user = result[0] 
        console.log(result);
        
        
        if(!user) return res.status(400).send("User not found") 

        if(!user.verified) return res.status(400).send("Please, verify your email") 

        const hash = await bcrypt.compare(password, user.password) 

        if(!hash) return res.status(400).send("Wrong password")

        if (user.role !== 1)
      return res
        .status(400)
        .send("Your Account is not registered as an Administrator");
        
        res.send(user) 
    })
})

const storages = multer.diskStorage({
    
    filename : function(req, file, cb) {
        cb(null, Date.now() + file.fieldname + path.extname(file.originalname))
    },
    // Destination
    destination : function(req, file, cb) {
        cb(null, uploadDir)
    }
})

const upload = multer ({
    storage: storages,
    limits: {
        fileSize: 10000000 // Byte
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){ // will be error if the extension name is not one of these
            return cb(new Error('Please upload image file (jpg, jpeg, or png)')) 
        }
        cb(undefined, cb)
    }
})

//upload avatar
router.post('/avatar/uploads/:userid', upload.single('avatar'), (req, res) => {
    const sql = `UPDATE user SET avatar  = '${req.file.filename}' WHERE id = '${req.params.userid}'`
    
    conn.query(sql, (err, result) => {
        if (err) return console.log(err);
        
        
        res.send({filename: req.file.filename})
    })
})

//link avatar
router.get('/users/avatar/:avatar', (req,res) => {
    res.sendFile(`${uploadDir}/${req.params.avatar}`)
})

//delete avatar
router.get('/avatar/delete', (req,res) => {
    const sql = `SELECT * FROM user WHERE username = ?`
    const sql2 = `UPDATE user SET avatar = NULL WHERE username = ?`
    var data = req.body.username

    conn.query(sql, data, (err, result) => {
        if (err) return res.send(err)

        fs.unlink(`${uploadDir}/${result[0].avatar}`, (err) => {
            if(err) throw err
        })
        conn.query(sql2, data ,(err , result) => {
            if (err) return res.send(err)

            res.send("Delete Success")
        })
    })

})
//read profile
router.get('/users/profile/:userid', (req,res) => {
    
    const data = req.params.userid

    const sql = `SELECT *, YEAR(CURDATE()) - YEAR(birthday) AS age FROM user WHERE id = '${data}'`


    conn.query(sql,data, (err,result) => {
        if(err) return res.send(err.message)
        

        result.map(item =>{
          item.avatar = `http://localhost:1995/users/avatar/${item.avatar}?v=` +Date.now()
        })

        console.log(result);
        

        if(!result[0]) return res.status(400).send("User not found") // User tidak ditemukan

        res.send(result)
        
    })
})

// UPDATE USER
router.patch('/users/:userid', (req, res) => { 
    const sql = `UPDATE user SET ? WHERE id = ${req.params.userid}`
    const sql2 = `SELECT * FROM USER WHERE id = ${req.params.userid}`
    const data = [req.body]

    conn.query(sql, data, (err, result) => {
      console.log(req.body);
      
        if (err) return res.send(err.message)
        
        conn.query(sql2,(err,result) => {
            if (err) return res.send(err.message)
            
            res.send(result)
        })

    })
})

//kodepos
router.get("/kodepos", (req, res) => {
    const sql = `SELECT * FROM tbl_kodepos`;
  
    conn.query(sql, (err, result) => {
      if (err) return res.send(err.sqlMessage);
  
      res.send(result);
    });
  });
  
  //detail address
  router.get("/address/:id", (req, res) => {
    const sql = `SELECT * FROM tbl_kodepos WHERE id = '${req.params.id}'`;
  
    conn.query(sql, (err, result) => {
      if (err) return res.send(err.sqlMessage);
  
      res.send(result);
    });
  });
  //detail address user
  router.get("/user/address/:iduser", (req, res) => {
    const sql = `SELECT kelurahan,kecamatan,kabupaten,provinsi,tbl_kodepos.kodepos FROM user JOIN tbl_kodepos ON user.kodepos_id = tbl_kodepos.id WHERE user.id = '${
      req.params.iduser
    }'`;
  
    conn.query(sql, (err, result) => {
      if (err) return res.send(err.sqlMessage);
  
      res.send(result);
    });
  });
  //show province
  router.get("/province", (req, res) => {
    const sql = `SELECT DISTINCT provinsi FROM tbl_kodepos`;
  
    conn.query(sql, (err, result) => {
      if (err) return res.send(err.sqlMessage);
  
      res.send(result);
    });
  });
  //show kabupaten
  router.get("/kabupaten/:provinsi", (req, res) => {
    const sql = `SELECT DISTINCT kabupaten FROM tbl_kodepos WHERE provinsi = '${
      req.params.provinsi
    }'`;
  
    conn.query(sql, (err, result) => {
      if (err) return res.send(err.sqlMessage);
  
      res.send(result);
    });
  });
  //show kecamatan
  router.get("/kecamatan/:kabupaten", (req, res) => {
    const sql = `SELECT DISTINCT kecamatan FROM tbl_kodepos WHERE kabupaten ='${
      req.params.kabupaten
    }'`;
  
    conn.query(sql, (err, result) => {
      if (err) return res.send(err.sqlMessage);
  
      res.send(result);
    });
  });
  //show kelurahan
  router.get("/kelurahan/:kecamatan", (req, res) => {
    const sql = `SELECT kelurahan FROM tbl_kodepos WHERE kecamatan = '${
      req.params.kecamatan
    }'`;
  
    conn.query(sql, (err, result) => {
      if (err) return res.send(err.sqlMessage);
  
      res.send(result);
    });
  });
  //show kodepos
  router.get("/kodepos/:kelurahan", (req, res) => {
    const sql = `SELECT id,kodepos FROM tbl_kodepos WHERE kelurahan = '${
      req.params.kelurahan
    }'`;
  
    conn.query(sql, (err, result) => {
      if (err) return res.send(err.sqlMessage);
  
      res.send(result);
    });
  });

module.exports = router