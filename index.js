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

//
app.post('/new-product', contoller.createNewDrug)

app.post('/sign-in', contoller.signInfunx)

app.listen(PORT, ()=>{
    console.log('app listening')
})
