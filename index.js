const express = require('express');
const app = express();
const bodyParser = require('body-parser'); // this will make our http response readable json
const morgan = require('morgan');
const cors = require('cors');

// Connection to db
const connectToMongo = require('./db.js');
require('dotenv/config'); // connect to env file and add the data in process.env
connectToMongo(); // connect to db 

// for authentication 
const authJwt = require('./helpers/jwt.js');
const errorHandler = require('./helpers/error-handler.js');

// CDN CSS
const CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

// initilizing swager doc
// const YAML = require('yamljs')
// const swaggerJsDocs = YAML.load('./Doc/api-doc.yaml')
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const options = {
    definition: {
        openapi : '3.0.0',
        info : {
            title : "The Complete E-Commerce Web API",
            version: "1.0.0",
            description: "This documentation contains NodeJs backend routes for the E-Commerce Web API"
        },
        components: {
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              in: 'header',
              name: 'Authorization',
              description: 'Bearer token to access the api endpoints',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
        servers:[
            {
                url: "http://localhost:5000" ,
                description: 'Development server'
            },
            {
                url: "https://e-commerce-api-nu.vercel.app" ,
                description: 'Vercel Deplyoment server'
            }
        ]
    },
    apis: ["./routes/*.js"]
}
const swaggerJsDocs = swaggerJSDoc(options)
app.use(`/api-docs`, 
        swaggerUi.serve, 
        swaggerUi.setup(
            swaggerJsDocs, 
            { 
                customCssUrl: CSS_URL 
            }
        ))


// middelware
app.use(cors()); // allows to interact with frontend 
app.options('*', cors())
app.use(bodyParser.json()); // send by user {Post}
app.use(morgan('tiny'));
app.use(authJwt()); // this middelware will check the user authentication 
app.use("/Public/uploads",express.static(__dirname + "/Public/uploads")) // allowing the images that will be shown to coustomer
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
    console.log('server is running http://localhost:5000/api-docs');
})