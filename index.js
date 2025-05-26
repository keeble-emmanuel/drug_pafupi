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
//master-account
app.get('/keeble', (req, res)=>{
    res.sendFile(__dirname + "/frontend/master_account.html")
})
//delete product
app.get('/deleteProduct/:productId', contoller.deleteProduct)

//
app.post('/new-product', contoller.createNewDrug)
//searched page
app.get('/searched-page/:genericName/:tradeName', contoller.searchedPage)
//market page
app.get('/market', contoller.marketDisplay)
//sign-in
app.post('/sign-in', contoller.signInfunx)
app.get('/getproducts/:user_id',  contoller.getUserproducts )

app.listen(PORT, ()=>{
    console.log('app listening')
})
