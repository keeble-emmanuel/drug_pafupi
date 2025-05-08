const signIschema = new Schema({
    username: String,
    password: String
})
const SignInModel = mongoose.model('signInSchema', signIschema)

const newDrugSchema = new Schema({
    genericName: String,
    tradeName: String,
    drugStrength: String,
    drugCategory: String,
    drugStockstatus: String
})
const newDrugModel = mongoose.model('newDrugSchema', newDrugSchema)