const mongoose = require('mongoose');
const Schema  = mongoose.Schema;
var log_id = 1;

mongoose.connect('mongodb+srv://keeble:140076812keeble@cluster0.it6ej.mongodb.net/');
const signIschema = new Schema({
    username: String,
    password: String
})
const SignInModel = mongoose.model('signInSchema', signIschema)

const newDrugSchema = new Schema({
    user_id: String,
    genericName: String,
    tradeName: String,
    drugStrength: String,
    drugCategory: String,
    drugStockstatus: String
})
const newDrugModel = mongoose.model('newDrugSchema', newDrugSchema)


const createNewDrug= async(req, res)=>{
    const { username }= req.query;
    const { genericName, 
        tradeName,
        drugStrength,
        drugCategory,
        drugStockstatus,
    } = req.body;
    console.log(log_id)
    /*const addNewDrug = new newDrugModel({
        user_id: log_id,
        genericName: genericName,
        tradeName: tradeName,
        drugStrength: drugStrength,
        drugCategory: drugCategory,
        drugStockstatus: drugStockstatus
    })
    const save = await addNewDrug.save()*/
}

const signInfunx =(req, res)=>{
    const data = req.body;
    const { username }= req.query;
    if(!data.username || !data.password){
        res.json({
            response: 'incomplete'
        })
    }else{
        SignInModel.find({username: data.username})
        .then((datas)=>{
            if(datas[0].password == data.password){
                log_id = data.password
                res.send({
                    entry:'ok'
                })
            }else{
                res.send({
                    entry: "denied"
                })
            }

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
