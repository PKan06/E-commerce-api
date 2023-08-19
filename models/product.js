const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    richDescription:{
        type: String,
        default:""
    },
    Image:{
        type: String,
        default: ""
    },
    images: [{
        type:String
    }],
    brand: {
        type: String,
        default:""
    },
    price:{
        type: Number,
        default:0
    },
    category:{
        type: mongoose.Schema.Types.ObjectId, // this object id of categories {for validation}
        ref: "Category", // refrence to schema 
        required: true
    },
    countInStock:{
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    rating:{
        type: Number,
        default: 0
    },
    numReviews:{
        type: Number,
        default: 0
    },
    isFeatured:{
        type: Boolean, // home page featured product 
        default: false,
    },
    dateCreated:{
        type: Date,
        defalut: Date.now,
    }
})

// to make an virtual id 
// this will get us some relef in using id insted of '_id' 
// as most of the application use it  
productSchema.virtual('id').get(function () {
    return this._id.toHexString(); // becase _id object is defined in hexstring 
});

productSchema.set('toJSON', {
    virtuals: true,
});

exports.Product = mongoose.model('Product', productSchema);
