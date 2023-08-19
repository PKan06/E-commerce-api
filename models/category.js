const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    color:{
        type: String,
    },
    icon:{ // #000 -> to display in the front end 
        type: String,
    }
})

exports.Category = mongoose.model('Category', categorySchema);
