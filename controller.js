const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

const signIschema = new Schema({
    username: String,
    password: String
})
const SignInModel = mongoose.model('signInSchema', signIschema)

const newDrugSchema = new Schema({
    id: String,
    genericName: String,
    tradeName: String,
    drugStrength: String,
    drugCategory: String,
    drugStockstatus: String
})
const newDrugModel = mongoose.model('newDrugSchema', newDrugSchema)


const createNewDrug=(req, res)=>{

}

const signInfunx =(req, res)=>{
    const data = req.body;
    const { username }= req.query;
    if(data.username == '' || data.password){
        res.json({
            response: 'incomplete'
        })
    }else{
        SignInModel.find({username: username})
        .then((data)=>{
            

        })
        .catch((err)=>{
            console.log(err)
        })
        
        
    }

}

const searchDrug = (req, res)=>{
    const searchResults = []
    const { searchkey } = req.body;
    const reg = new RegExp('\\b${searchKey}\\b', 'i')
    newDrugModel.find({genericName: searchkey , tradeName: searchkey})
    .then((data)=>{
        res.json({
            data: data
        })
    })
    .catch((err)=>{
        console.error(err)
    })
    

}

module.exports = {
    createNewDrug,
    signInfunx,
    searchDrug
}