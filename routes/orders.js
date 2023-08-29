const {Order} = require('../models/orders')
const express = require('express');
const { CartItems } = require('../models/Cart-items');
const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Orders:
 *       type: object
 *       required:
 *         - Cart
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
 *         Cart:
 *           type: array
 *           items:
 *              type: object
 *              description: have all the ids to cart Items schema which user added into its cart
 *              properties:
 *                  quantity:   
 *                      type: string
 *                      description: quantity of items to buy
 *                  product: 
 *                      type: string
 *                      description: product id of cart item 
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
 *          Cart: array of Cart items Schema contining quantity and product 
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

/**
 * @openapi
 * /e-shopping/orders:
 *   get:
 *      summary: Get all orders  
 *      description: This api will help the admin to get list of all order placed. The bearer token must be authorized 
 *      tags: [Orders]
 *      responses:
 *          200:
 *              description: The new Category is succesfully created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Orders'
 *          400:
 *              description: The error in the order.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          example:
 *                              message: the order cannot be created!
 *          401:
 *              description: The user is not authorized. Make sure to authorize through the token generated after login.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          example:
 *                              message: The user is not authorized
*/

router.get(`/`, async (req, res) =>{
    const orderList = await Order.find().populate('user', 'name').sort({'dateOrdered': -1}); // sorted orders using dates 

    if(!orderList) {
        res.status(500).json({success: false})
    } 
    res.send(orderList);
})

/**
 * @openapi
 * /e-shopping/orders/{oredr-ID}:
 *   get:
 *      summary: Get the order by its ID from the db 
 *      description: This api will help the user to get the details of orders 
 *      tags: [Orders]
 *      parameters:
 *         - in: path
 *           name: oredr-ID
 *           required: true
 *           description: Enter the Order ID which you want to fetch order details
 *           schema:
 *              type: string
 *      responses:
 *          200:
 *              description: The Order is succesfully found
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Orders'
 *          500:
 *              description: The error in the order ID or Server error .
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          example:
 *                              message: the order cannot be created!
 *          401:
 *              description: The user is not authorized. Make sure to authorize through the token generated after login.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          example:
 *                              message: The user is not authorized
*/
router.get(`/:id`, async (req, res) =>{
    const order = await Order.findById(req.params.id)
    .populate('user', 'name')
    .populate({ 
        path: 'Cart', 
        populate: 
        {
            path : 'product', 
            populate: 'category' // populating category inside the product 
        } 
    });
    
    if(!order) {
        res.status(500).json({success: false})
    } 
    res.send(order);
})

/**
 * @openapi
 * /e-shopping/orders:
 *   post:
 *      summary: Add the new order to db 
 *      description: This api will help the user to place the new orders 
 *      tags: [Orders]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                          type: object
 *                          example:
 *                              Cart:
 *                                  quantity: quantity of items  
 *                                  product: product id of cart items 
 *                              shippingAddress1: shippingAddress1
 *                              shippingAddress2: shippingAddress2
 *                              city: city
 *                              zip: zip-code
 *                              phone: phone
 *                              status: Shipping status
 *                              totalPrice: total order Price
 *                              user: user details of order
 *                              dateOrdered: date of order
 *      responses:
 *          200:
 *              description: The new Category is succesfully created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Orders'
 *          400:
 *              description: The error in the order.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          example:
 *                              message: the order cannot be created!
 *          401:
 *              description: The user is not authorized. Make sure to authorize through the token generated after login.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          example:
 *                              message: The user is not authorized
*/

router.post('/', async (req,res)=>{
    // retrurning promises 
    const CartIds = Promise.all(req.body.Cart.map(async (cartItem) =>{
        let newCartItem = new CartItems({
            quantity: cartItem.quantity,
            product: cartItem.product
        })
        
        newCartItem = await newCartItem.save();
        
        return newCartItem._id;
    }))
    // resolving the promise which contains the above promises 
    const CartIdsResolved =  await CartIds;
    
    const totalPrices = await Promise.all(CartIdsResolved.map(async (CartItemId)=>{
        const cartItem = await CartItems.findById(CartItemId).populate('product', 'price'); // from product give its price price details only  
        const totalPrice = cartItem.product.price * cartItem.quantity;
        return totalPrice
    }))
    
    const totalPrice = totalPrices.reduce((a,b) => a +b , 0);

    let order = new Order({
        Cart: CartIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    })
    order = await order.save();
    
    if(!order)
    return res.status(400).send('the order cannot be created!')

res.send(order);
})

/**
 * @openapi
 * /e-shopping/orders/{order-id}:
 *   put:
 *      summary: Update status using order ID 
 *      description: This api will help the user to update the existing order status wiuth its order Id 
 *      tags: [Orders]
 *      parameters:
 *         - in: path
 *           name: order-id
 *           required: true
 *           description: Enter the Order ID which you want to fetch order details
 *           schema:
 *              type: string
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                          type: object
 *                          example:
 *                              status: updated Shipping status
 *      responses:
 *          200:
 *              description: The new Category is succesfully created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Orders'
 *          400:
 *              description: The error in the order.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          example:
 *                              message: the order cannot be created!
 *          401:
 *              description: The user is not authorized. Make sure to authorize through the token generated after login.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          example:
 *                              message: The user is not authorized
*/
// updating status
router.put('/:id',async (req, res)=> {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status
        },
        { new: true}
    )

    if(!order)
    return res.status(400).send('the order cannot be update!')

res.send(order);
})

/**
 * @openapi
 * /e-shopping/orders/{order-id}:
 *   delete:
 *      summary: Deleting the order using Order ID 
 *      description: This api will help the user to selete the existing order with its order Id 
 *      tags: [Orders]
 *      parameters:
 *         - in: path
 *           name: order-id
 *           required: true
 *           description: Enter the Order ID which you want to fetch order details
 *           schema:
 *              type: string
 *      responses:
 *          200:
 *              description: The new Category is succesfully created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Orders'
 *          404:
 *              description: The error in the order.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          example:
 *                              success: false
 *                              message: order not found!
 *          401:
 *              description: The user is not authorized. Make sure to authorize through the token generated after login.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          example:
 *                              message: The user is not authorized
 *          500:
 *              description: The error in the order ID or Server error .
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          example:
 *                              message: the order cannot be created!
*/
// Removing the order (IMP)
router.delete('/:id', (req, res)=>{
    Order.findByIdAndRemove(req.params.id).then(async order =>{
        if(order) {
            await order.Cart.map(async cartItem => {
                await CartItems.findByIdAndRemove(cartItem)
            })
            return res.status(200).json({success: true, message: 'the order is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "order not found!"})
        }
    }).catch(err=>{
        return res.status(500).json({success: false, error: err}) 
    })
})

/**
 * @openapi
 * /e-shopping/orders/get/totalsales:
 *   get:
 *      summary: fetch the total sales from orderd schema
 *      description: This api will help the user to fetch the total sales from orderd schema
 *      tags: [Orders]
 *      responses:
 *          200:
 *              description: The total sales in orderd schema
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          example:
 *                              totalsales: total sales price 
 *          400:
 *              description: The error in the order ID or Server error .
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          example:
 *                              message: The order sales cannot be generated
*/
// return the totalsales in json format 
router.get('/get/totalsales', async (req, res)=> {
    // joining all tables inside the table 
    const totalSales= await Order.aggregate([
        { $group: 
            { _id: null , // as mongose cannot return withoud an id so putting it null will be a great choice
            totalsales : 
            { $sum : '$totalPrice'} // moongose methord to calcualte sum of total price 
        }
    }
])

if(!totalSales) {
    return res.status(400).send('The order sales cannot be generated')
}

    res.send({totalsales: totalSales.pop().totalsales})
    //                                ^
    // return the             first item of the array 
})
/**
 * @openapi
 * /e-shopping/orders/get/count:
 *   get:
 *      summary: get the total order count from orderd schema  
 *      description: This api will help the user to fetch the total order count from orderd schema
 *      tags: [Orders]
 *      responses:
 *          200:
 *              description: The total sales in orderd schema
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          example:
 *                              orderCount: total order count 
 *          500:
 *              description: The error in the order ID or Server error .
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          example:
 *                              message: the order cannot be created!
*/
// total order count
router.get(`/get/count`, async (req, res) =>{
    const orderCount = await Order.countDocuments()
    
    if(!orderCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        orderCount: orderCount
    });
}
)
/**
 * @openapi
 * /e-shopping/orders/get/userorders/{user-id}:
 *   get:
 *      summary: get the total order count from orderd schema for the perticular 
 *      description: This api will help the user to fetch the total order count from orderd schema
 *      tags: [Orders]
 *      parameters:
 *         - in: path
 *           name: user-id
 *           required: true
 *           description: Enter the user ID for which you want to fetch order details
 *           schema:
 *              type: string
 *      responses:
 *          200:
 *              description: The total sales in orderd schema
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          example:
 *                              orderCount: total order count 
 *          500:
 *              description: The error in the order ID or Server error .
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          example:
 *                              success: false
 *                              message: the order cannot be created!
*/
// liat of order for a perticular user 
// which is a order history for the user 
router.get(`/get/userorders/:userid`, async (req, res) =>{
    const userOrderList = await Order.find({user: req.params.userid}).populate({ 
        path: 'Cart', 
        populate: {
            path : 'product', 
            populate: 'category'
        } 
        }).sort({'dateOrdered': -1});

    if(!userOrderList) {
        res.status(500).json({success: false})
    } 
    res.send(userOrderList);
})



module.exports =router;