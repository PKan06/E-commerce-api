const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// getting user 
router.get(`/`, async (req, res) =>{
    const userList = await User.find().select('-passwordHash'); // getting user details without password
    
    if(!userList) {
        res.status(500).json({success: false})
    } 
    res.send(userList);
})

// getting user with perticular user id
router.get('/:id', async(req,res)=>{
    const user = await User.findById(req.params.id).select('-passwordHash'); // getting user details without password 

    if(!user) {
        res.status(500).json({message: 'The user with the given ID was not found.'})
    } 
    res.status(200).send(user);
})
// new user 
router.post('/', async (req,res)=>{
    // console.log(req.body);
    
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10), // hasing the password (original password, salt)
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })
    user = await user.save().catch(err => {
        console.log(err);
    });
    
    if(!user)
    return res.status(400).send('the user cannot be created!')

res.send(user);
})
// updating the password 
router.put('/:id',async (req, res)=> {
    
    const userExist = await User.findById(req.params.id);
    let newPassword
    if(req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10)
    } else {
        newPassword = userExist.passwordHash;
    }
    
    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            passwordHash: newPassword,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
        },
        { new: true}
        )

    if(!user)
    return res.status(400).send('the user cannot be created!')

res.send(user);
})

router.post('/login', async (req,res) => {
    // only we want username and password for login
    // {validating user}
    // console.log(req.body)
    const user = await User.findOne({email: req.body.email})
    const secret = process.env.secret;
    if(!user) {
        return res.status(400).send('The user not found');
    }
    // validating the password with the hash in database 
    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        // server respond with jwt token 
        // which will furthur use to authorize user to use api
        const token = jwt.sign(
            {
                // data sending with token
                userId: user.id,
                isAdmin: user.isAdmin // checking secretly whether the user is admin or not 
                // if yes then we will provide  the access to data 
            },
            secret,
            {expiresIn : '1d'} // expiretion time
            )
            
            res.status(200).send({user: user.email , token: token}) 
        } else {
            res.status(400).send('password is wrong!');
        } 
})

// this will register the user in db 
// then it is able to post products, and update it
router.post('/register', async (req,res)=>{
    console.log(req.body);
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })
    user = await user.save().catch(err => {
        console.log(err);
    });

    if(!user)
    return res.status(400).send('the user cannot be created!')

    res.send(user);
})

// to delete account from the db 
router.delete('/:id', (req, res)=>{
    User.findByIdAndRemove(req.params.id).then(user =>{
        if(user) {
            return res.status(200).json({success: true, message: 'the user is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "user not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})
// this will cout the number of registered user present in db 
router.get(`/get/count`, async (req, res) =>{
    const userCount = await User.countDocuments()

    if(!userCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        userCount: userCount
    });
})

module.exports =router;