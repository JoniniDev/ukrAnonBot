const { ObjectID } = require("mongodb");
const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({ 
    _id: { type: Number, require: true},
    gender: { type: Boolean},
    age: { type: String},
    rating: {type: Number, require: true},
    paidStatus: {type: Number, require: true}
}, {timestamps: true});
  
module.exports = mongoose.model("User", userSchema)