const {Orders} = require('../models/orders')
const express = require('express');
const { OrderItem } = require('../models/order-items');
const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Orders:
 *       type: object
 *       required:
 *         - orderItems
 *         - shippingAddress1
 *         - city
 *         - zip
 *         - country
 *         - phone
 *         - status
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the Orders
 *         orderItems:
 *           type: string
 *           description: have all the ids to order Items schema which user added into its cart
 *         shippingAddress1:
 *           type: string
 *           description: Shipping Address 1 for delivery  
 *         shippingAddress2:
 *           type: string
 *           description: Shipping Address 2 for delivery, so that the salesman can deside the nearby address 
 *         city:
 *           type: string
 *           description: Providing the city in which delivery has to be done  
 *         zip:
 *           type: string
 *           description: Providing the zip Code in which delivery has to be done 
 *         country:
 *           type: string
 *           description: Providing the country in which delivery has to be done.
 *         phone:
 *           type: string
 *           description: Providing the phone number of the user at which delivery has to be done 
 *         status:
 *           type: string
 *           description: Showing the status of delivery
 *         totalPrice:
 *           type: Number
 *           description: Providing the total extimated price to the user  
 *         user:
 *           type: string
 *           description: it will allow us to identify the order specific to the user 
 *         dateOrdered:
 *           type: Date
 *           description: The date of the order has been recorded 
 *       example:
 *          orderItems: Items-to-Deliver
 *          shippingAddress1: Delivery-to-address-1
 *          shippingAddress2: Delivery-to-address-2
 *          city: Delivery-to-city
 *          zip: Delivery-to-zipCode
 *          country: Delivery-to-country 
 *          phone: Delivery-to-contact-details
 *          status: order-status
 *          totalPrice: order-price
 *          user: user-belong to order 
 *          dateOrdered: orderd-date 
 */

router.get(`/`, async (req, res) =>{
    const OrderList = await Orders.find();

    if(!OrderList) {
        res.status(500).json({success: false})
    } 
    res.send(OrderList);
})

module.exports =router;