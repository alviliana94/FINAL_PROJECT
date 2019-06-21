const express = require('express') //untuk import framework express
const cors = require("cors"); // untuk connect / express
const userRouter = require('./router/userRouter')
const productRouter = require('./router/productRouter')
const placeRouter = require('./router/placeRouter')

const app = express()
const port = process.env.PORT

app.get('/', (req,res) => {
    res.send(`<h1>API runnning on ${port}</h1>`)
})

app.use(cors())
app.use(express.json())
app.use(userRouter)
app.use(productRouter)
app.use(placeRouter)

app.listen(port, () => {
    console.log("Running at ", port);
    
})