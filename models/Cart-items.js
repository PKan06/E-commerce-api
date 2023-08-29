const mongoose = require('mongoose');

const CartItemsSchema = mongoose.Schema({
        quantity: {
            type: Number,
            required: true
        },
        product: {  
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    })

exports.CartItems = mongoose.model('CartItem', CartItemsSchema);
