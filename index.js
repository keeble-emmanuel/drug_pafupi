const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const controller = require('./controller')
const controller2 = require('./tx')
const fs = require('fs');
const path = require('path');
const PORT = 3000
const multer = require('multer')

app.use(bodyParser.json())
app.use(express.static('frontend'))
const uploadDir = './uploads'
if(!fs.existsSync(uploadDir)){
  fs.mkdirSync(uploadDir)
}
// Multer is a middleware for handling multipart/form-data, used for file uploads.

const upload = multer({ storage: controller.storage });

//search input controller
app.post('/', controller2.searchDrug)

//first page display
app.get('/',)
app.get('/sign-in-page', (req, res)=>{
    res.sendFile(__dirname + "/frontend/back-office.html")
})

//master-account
app.get('/ad12min2', (req, res)=>{
    res.sendFile(__dirname + "/frontend/master_account.html")
})
//dashboard
app.get('/dashboard', (req, res)=>{
    res.sendFile(__dirname + "/frontend/back-office-y.html")
})
app.get('/pharmacies', (req, res)=>{
    res.sendFile(__dirname + "/frontend/pharmacies.html")
})
//404 page
app.get('/not-found', (req, res)=>{
    res.sendFile(__dirname + "/frontend/404page.html")
})
//delete product
app.get('/deleteProduct/:productId', controller.deleteProduct)
//promote product
app.post('/promote-product', controller.promoteProduct)
//depromote product
app.post('/depromote-product', controller.depromoteProduct)
//get all-users
app.get('/all-users', controller2.getAllUsers)
//get specific user
app.get('/get_user/:user_id', controller2.getUserDetails)
//create new user
app.post('/new-user', controller2.createNewUser)
//update location
app.post('/update-location', controller2.updateLocation)
//change password
app.post('/update-location', controller2.updateLocation)
//delete user
app.get('/keeble/delete-user/:idtodelete', controller2.deleteUser)
//create product
app.post('/new-product', controller2.createNewDrug2)

//upload products using excel sheet
app.post('/:user_id/upload',upload.single('excelFile'), controller2.uploadFromExcel)

//update product
app.post('/update-product', controller2.updateProduct)
//searched page
app.post('/searched-page', controller2.searchedPage)
//display all products
app.get('/all-products', controller.marketDisplay)
//sign-in
app.post('/sign-in', controller2.signInfunx)
//
app.get('/getproducts/:user_id',  controller2.getUserproducts )
//change password
app.post('/change-password', controller2.changePassword)

app.listen(PORT, ()=>{
    console.log('app listening')
})
