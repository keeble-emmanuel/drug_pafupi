const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const contoller = require('./controller')
const PORT = 3000

app.use(bodyParser.json())
app.use(express.static('frontend'))

//search input controller
app.post('/', contoller.searchDrug)

//first page display
app.get('/',)
app.get('/new_product', (req, res)=>{
    res.sendFile(__dirname + "/frontend/back-office.html")
})

//
app.post('/new-product', contoller.createNewDrug)

app.post('/sign-in', contoller.signInfunx)
app.get('/getproducts/:user_id',  contoller.getUserproducts )

app.listen(PORT, ()=>{
    console.log('app listening')
})
