const express = require('express');
const app = express();
const bodyParser = require('body-parser'); // this will make our http response readable json
const morgan = require('morgan');
const cors = require('cors');

// Connection to db
const connectToMongo = require('./db.js');
require('dotenv/config'); // connect to env file and add the data in process.env
connectToMongo(); // connect to db 
const authJwt = require('./helpers/jwt.js');
const errorHandler = require('./helpers/error-handler.js');

// middelware
app.use(cors()); // allows to interact with frontend 
app.options('*', cors())
app.use(bodyParser.json()); // send by user {Post}
app.use(morgan('tiny'));
app.use(authJwt()); // this middelware will check the user authentication 
app.use(errorHandler); // handel the error in authorizing by middelware


// importing routes
const ProductRouters = require('./routes/products.js')
const CategoriesRoutes = require('./routes/categories.js');
const UsersRoutes = require('./routes/users.js');
const OrdersRoutes = require('./routes/orders.js');

// Routers
const api = process.env.API_URL;
app.use(`${api}/categories`, CategoriesRoutes);
app.use(`${api}/products`, ProductRouters);
app.use(`${api}/users`, UsersRoutes);
app.use(`${api}/orders`, OrdersRoutes);

//server
app.listen(5000,()=>{
    console.log('server is running http://localhost:5000');
})