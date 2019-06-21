const router = require("express").Router();
const conn = require("../connection/connection");
const multer = require("multer");
const path = require("path"); // Menentukan folder uploads
const fs = require("fs"); // menghapus file gambar

const uploadPet = path.join(__dirname + '/../pet' )
const uploadProduct = path.join(__dirname + '/../product' )
const uploadTransport = path.join(__dirname + '/../transport' )
const uploadHome = path.join(__dirname + '/../home' )

const storagE = multer.diskStorage({
    
    filename : function(req, file, cb) {
        cb(null, Date.now() + file.fieldname + path.extname(file.originalname))
    },
    // Destination
    destination : function(req, file, cb) {
        cb(null,uploadPet)
    }
})
const storages = multer.diskStorage({
    
    filename : function(req, file, cb) {
        cb(null, Date.now() + file.fieldname + path.extname(file.originalname))
    },
    // Destination
    destination : function(req, file, cb) {
        cb(null,uploadProduct)
    }
})
const storageTrans = multer.diskStorage({
    
    filename : function(req, file, cb) {
        cb(null, Date.now() + file.fieldname + path.extname(file.originalname))
    },
    // Destination
    destination : function(req, file, cb) {
        cb(null,uploadTransport)
    }
})
const storageHome = multer.diskStorage({
    
    filename : function(req, file, cb) {
        cb(null, Date.now() + file.fieldname + path.extname(file.originalname))
    },
    // Destination
    destination : function(req, file, cb) {
        cb(null,uploadHome)
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
const uploadTrans = multer ({
    storage: storageTrans,
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
const uploads = multer ({
    storage: storages,
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
const uploadsHome = multer ({
    storage: storageHome,
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
router.get('/pet/images/:image', (req,res) => {
  res.sendFile(`${uploadPet}/${req.params.image}`)
})
//link image product
router.get('/product/images/:image', (req,res) => {
  res.sendFile(`${uploadProduct}/${req.params.image}`)
})
//link image transport
router.get('/transport/images/:image',(req,res) => {
  res.sendFile(`${uploadTransport}/${req.params.image}`)
})
//link image Home
router.get('/home/images/:image',(req,res) => {
  res.sendFile(`${uploadHome}/${req.params.image}`)
})

//show pet category
router.get("/pet", (req, res) => {
  const sql = `SELECT * FROM pet_category`;

  conn.query(sql, (err, result) => {
    if (err) return res.send(err.mess);

    result.map(item =>{
      item.pet_image = (`http://localhost:1995/pet/images/${item.pet_image}?v=` +Date.now())
  })

    res.send(result);
  });
});

//edit pet category
router.patch('/pet/edit/:idpet', upload.single('pet_image'), (req,res) => {
    const data = [req.body, req.params.idpet]
    const sql = `UPDATE pet_category SET ? WHERE id = ?`
    const sql2 = `UPDATE pet_category SET pet_image  = '${req.file.filename}' WHERE id = '${data[1]}'`
    const sql3 = `SELECT * FROM pet_category`

    conn.query(sql, data, (err, result) => {
        if (err) return res.send(err.mess)
        
        
        conn.query(sql2, (err,result2) => {
            if (err) return res.send(err.mess)
            
            conn.query(sql3,(err,result) => {
              if (err) return res.send(err.mess)
              
              res.send(result2)
            })

        })

    })
})

//show transport category
router.get("/transport", (req, res) => {
  const sql = `SELECT * FROM transport_category`;

  conn.query(sql, (err, result) => {
    if (err) return res.send(err.mess);

    result.map(item =>{
      item.transport_image = (`http://localhost:1995/transport/images/${item.transport_image}?v=` +Date.now())
  })

    res.send(result);
  });
});

//edit transport category
router.patch('/transport/edit/:idtransport', uploadTrans.single('transport_image'),(req,res) => {
    const data = [req.body, req.params.idtransport]
    const sql = `UPDATE transport_category SET ? WHERE id = ?`
    const sql2 = `UPDATE transport_category SET transport_image  = '${req.file.filename}' WHERE id = '${data[1]}'`
    const sql3 = `SELECT * FROM transport_category`

    conn.query(sql, data, (err, result) => {
        if (err) return res.send(err.mess)
        
        
        conn.query(sql2, (err,result2) => {
            if (err) return res.send(err.mess)
            
            conn.query(sql3,(err,result3) => {
              if (err) return res.send(err.mess)
              
              res.send(result3)
            })

        })

    })
})

//show size category
router.get("/size", (req, res) => {
  const sql = `SELECT * FROM size_category`;

  conn.query(sql, (err, result) => {
    if (err) return res.send(err.mess);

    res.send(result);
  });
});

//edit size category
router.patch('/size/edit/:idsize', (req,res) => {
    const data = [req.body, req.params.idsize]
    const sql = `UPDATE size_category SET ? WHERE id = ?`
    const sql2 = `SELECT * FROM size_category`

    conn.query(sql, data, (err, result) => {
        if (err) return res.send(err.mess)
        
        
        conn.query(sql2, (err,result2) => {
            if (err) return res.send(err.mess)

            res.send(result2)
        })

    })
})

//show price product list
    router.get("/product/pricelist", (req, res) => {
      const sql = `SELECT pp.id ,p.product_name AS product, c.category_name AS category, s.size_name AS size,pp.product_image as image, price FROM product_price pp JOIN pet_category c ON c.id = pp.product_category_id JOIN product_name p ON p.id = pp.product_name_id JOIN size_category s ON s.id = pp.product_size_id ORDER BY pp.id`;
    
      conn.query(sql, (err, result) => {
        if (err) return res.send(err.mess);

        result.map(item =>{
          item.image = (`http://localhost:1995/product/images/${item.image}?v=` +Date.now())
          
      })
    
        res.send(result);
      });
    });
//show price list
    router.get("/travel/pricelist", (req, res) => {
      const sql = `SELECT tp.id ,p.category_name AS PET, t.transport_name AS TRANSPORT, s.size_name AS SIZE,price AS PRICE FROM travel_price tp JOIN pet_category p ON p.id = tp.pet_category_id JOIN transport_category t ON t.id = tp.transport_category_id JOIN size_category s ON s.id = tp.size_category_id ORDER BY tp.id`;
    
      conn.query(sql, (err, result) => {
        if (err) return res.send(err.mess);
    
        res.send(result);
      });
    });

    //add travel price
router.post('/product/pricelist/add', uploads.single('product_image'), (req,res) => {
  const data = req.body
  const sql = `INSERT INTO product_price SET ?`
  const sql3 = `SELECT * FROM product_price`
  
  conn.query(sql, data, (err, result) => {
    if (err) return res.send(err.mess)
    
    const sql2 = `UPDATE product_price SET product_image  = '${req.file.filename}' WHERE id = '${result.insertId}'`
      
      conn.query(sql2, (err,result2) => {
          if (err) return res.send(err.mess)
          
          conn.query(sql3,(err,result3) => {
            if (err) return res.send(err.mess)

            res.send(result3)
          })

      })

  })
})

//edit travel price
router.patch('/pricelist/edit/:idlist', (req,res) => {
    const data = [req.body, req.params.idlist]
    const sql = `UPDATE travel_price SET ? WHERE id = ?`
    const sql2 = `SELECT * FROM travel_price`

    conn.query(sql, data, (err, result) => {
        if (err) return res.send(err.mess)
        
        
        conn.query(sql2, (err,result2) => {
            if (err) return res.send(err.mess)

            res.send(result2)
        })

    })
})

//price
router.get("/price/:pet/:transport/:size", (req, res) => {
    const data = req.params
    const sql = `SELECT price FROM travel_price tp WHERE pet_category_id = ${data.pet} AND transport_category_id = ${data.transport} AND size_category_id = ${data.size}`;

  
    conn.query(sql,(err, result) => {
      
      if (err) return res.send(err.sqlMessage);
      
      res.send(result);
    });
  });
router.get("/product/:product/:transport/:size", (req, res) => {
    const data = req.params
    const sql = `SELECT price FROM product_price  WHERE product_name_id = ${data.product} AND product_category_id = ${data.product} AND product_size_id = ${data.size};`;
  
    conn.query(sql,(err, result) => {
      
      if (err) return res.send(err.sqlMessage);
      
      res.send(result);
    });
  });

//show pproduct name
router.get("/products", (req, res) => {
  const sql = `SELECT * FROM product_name`;


  
  conn.query(sql, (err, result) => {
    if (err) return res.send(err.mess);

    res.send(result);
  });
});

//edit product name
router.patch('/product/edit/:idproduct', (req,res) => {
    const data = [req.body, req.params.idproduct]
    const sql = `UPDATE product_name SET ? WHERE id = ?`
    const sql2 = `SELECT * FROM product_name`

    conn.query(sql, data, (err, result) => {
        if (err) return res.send(err.mess)
        
            
            conn.query(sql2,(err,result2) => {
              if (err) return res.send(err.mess)

              res.send(result2)
            })

    })
})

//post image home
router.post('/home/add', uploadsHome.single('image'),(req,res) =>{
  const sql = `INSERT INTO imageHome (image) VALUES ('${req.file.filename}')`

  conn.query(sql,(err,result) => {
    
    if (err) return res.send(err.message);
    
    res.send(result)
  })
})

//get image home
router.get('/home/show',(req,res) => {
  const sql = `SELECT * FROM imageHome`
  
  conn.query(sql,(err,result) => {
    if (err) return res.send(err.message);

    result.map(item => {
      item.image = (`http://localhost:1995/home/images/${item.image}?v=` +Date.now())

    })

    res.send(result)
  })
})

//edit image home
router.patch('/home/edit/:id', uploadsHome.single('image'),(req,res) => {
  const sql = `UPDATE imageHome SET image  = '${req.file.filename}' WHERE id = '${req.params.id}'`

  conn.query(sql, (err, result) => {
      if (err) return res.send(err.mess)
      
      res.send(result)
    
    })
})


    module.exports = router
