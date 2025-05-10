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
    const addNewDrug = new newDrugModel({
        user_id: log_id,
        genericName: genericName,
        tradeName: tradeName,
        drugStrength: drugStrength,
        drugCategory: drugCategory,
        drugStockstatus: drugStockstatus
    })
    const save = await addNewDrug.save();
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
    const { searchWord } = req.body;
    const reg = new RegExp(`.*${searchWord}.*`, 'i')
    console.log(searchWord, reg)
    const datatosend = []
    newDrugModel.find({
        $or:[
            {genericName: {
                $regex: reg
            }},
            {tradeName: {
                $regex: reg
            }}

        ]}
        
)
    .then((data)=>{
        data.forEach((el)=>{
            const news = []
            news.unshift(el)
            const boj = { owner: 'l'}
            SignInModel.find({username: 'keeble'})
            .then((datax)=>{ 
            })
            .catch((err)=>{
                console.error(err)
            })
            news.unshift(boj)
            datatosend.unshift(news)
        })
        console.log(datatosend)
        
        /*res.json({
            user_id: data[0].user_id,
            genericName: data[0].genericName,
            tradeName: data[0].tradeName,
            drugStrength: data[0].drugStrength,
            drugCategory: data[0].drugCategory,
            drugStockstatus: data[0].drugStockstatus
        })*/
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
