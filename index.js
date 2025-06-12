const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const controller = require('./controller')
const PORT = 3000

app.use(bodyParser.json())
app.use(express.static('frontend'))

//search input controller
app.post('/', controller.searchDrug)

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
app.get('/deleteProduct/:productId', controller.deleteProduct)
//get all-users
app.get('/all-users', controller.getAllUsers)
//get specific user
app.get('/get_user/:user_id', controller.getUserDetails)
//create new user
app.post('/new-user', controller.creatNewUser)
//update location
app.post('/update-location', controller.updateLocation)
//
app.get('/keeble/delete-user/:idtodelete', controller.deleteUser)
//create product
app.post('/new-product', controller.createNewDrug)
//update product
app.post('/update-product', controller.updateProduct)
//searched page
app.get('/searched-page/:genericName/:tradeName', controller.searchedPage)
//display all products
app.get('/all-products', controller.marketDisplay)
//sign-in
app.post('/sign-in', controller.signInfunx)
app.get('/getproducts/:user_id',  controller.getUserproducts )

app.listen(PORT, ()=>{
    console.log('app listening')
})
