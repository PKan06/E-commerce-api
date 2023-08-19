const {Orders} = require('../models/orders')
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) =>{
    const OrderList = await Orders.find();

    if(!OrderList) {
        res.status(500).json({success: false})
    } 
    res.send(OrderList);
})

module.exports =router;