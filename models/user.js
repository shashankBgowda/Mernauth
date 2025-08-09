import mongoose from 'mongoose';

const userschema = new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verifyotp: { type: String, required: true, default:""},
    verifyotpexptime : {type:Number, default:0},
    isAccountverified: { type: Boolean, default: false },
    restotp:{type:String, default:""},
    restotpexptime:{type:Number, default:0},
})

const userModel = mongoose.model.user|| mongoose.model("users", userschema);

export default userModel;