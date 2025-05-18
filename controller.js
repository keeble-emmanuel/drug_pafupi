const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const Schema  = mongoose.Schema;
var log_id = 1;

mongoose.connect('mongodb+srv://keeble:140076812keeble@cluster0.it6ej.mongodb.net/');
// user signin credentials
const signIschema = new Schema({
    username: String,
    password: String,
    user_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }
})
const SignInModel = mongoose.model('signInSchema', signIschema)

//user details schema
const userDetails =  new Schema({
    name: String,
    location:String,
    phone: String,
})
const User = mongoose.model('User', userDetails)

//product schema
const newDrugSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
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
        user_id
    } = req.body;
    console.log(log_id)
    const addNewDrug = new newDrugModel({
        
        genericName: genericName,
        tradeName: tradeName,
        drugStrength: drugStrength,
        drugCategory: drugCategory,
        drugStockstatus: drugStockstatus,
        user_id: user_id
    })
    try{
        const save = await addNewDrug.save();
    }catch(error){
        console.log(err)
    }
    
    
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
                    entry:'ok',
                    user_id: datas[0].user_id
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
    .populate('user_id')
    .then((data)=>{
        res.send(data)
        
    })
    .catch((err)=>{
        console.error(err)
    })
    

}

const getUserproducts =(req, res)=>{
    const { user_id } = req.params;
    //console.log(user_id)
    newDrugModel.find({user_id: user_id})
    .then((data)=>{
        res.send(data)
    })
    .catch((err)=>{
        res.json({
            info:'user-not-found'
        })
    })
}

const doPopulate =()=>{
    newDrugModel.find({
        genericName: 'aspirin'
    }).populate('user_id')
    .then((data)=>{
        console.log(data)
    })
    .catch((err)=>{
        console.error(err)
    })
}

const searchedPage =(req, res)=>{
    newDrugModel.find().
    populate('user_id')
    .then((data)=>{
        res.send(data)
    })
    .catch((err)=>{
        console.error(err)
    })

}

module.exports = {
    createNewDrug,
    signInfunx,
    searchDrug,
    getUserproducts,
    doPopulate,
    searchedPage
}
