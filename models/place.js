const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const placeSchema = new Schema({
    title: { type : String, required : true},
    address: { type : String, required : true},
    description: { type : String, required : true},
    creator: { type : String, required : true},
    image: { type : String, required : true},
    location: { 
        lat: { type: Number, required : true},
        lng: { type: Number, required : true}
    }
});

module.exports = mongoose.model('Place', placeSchema);
//Place is model name then it will create collection name as plural of the model name: places