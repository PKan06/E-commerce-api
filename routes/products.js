const {Product} = require('../models/product'); // schemas 
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Category } = require('../models/category');

const multer = require('multer');
// list of extensions that are alloweed in the images to upload 
const FILE_TYPE_MAP = {
    'image/png': 'png', // defines by the MIME(Multipurpose Internet Mail Extensions) type
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

// it will not allows the file to have the same name 
// so without fear we can upload over file 
const storage = multer.diskStorage({
    // cb -> when there is error while uploading the file 
    destination: function (req, file, cb) {
        //  the file extension validation
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if(isValid) {
            uploadError = null
        }
      cb(uploadError, 'Public/uploads') // path in which image will go and save 
    },
    filename: function (req, file, cb) {
        // here we are renaming the files to meet our needs 
      const fileName = file.originalname.split(' ').join('-'); // replacing the spaces with '-' 
      const extension = FILE_TYPE_MAP[file.mimetype];
      cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
  })
  
const uploadOptions = multer({ storage: storage })

/**
 * @openapi
 * components:
 *   schemas:
 *     Products:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - richDescription
 *         - category
 *         - countInStock
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the User
 *         name:
 *           type: string
 *           description: The name of Product
 *         description:
 *           type: string
 *           description: The crisp description of Product
 *         richDescription:
 *           type: string
 *           description: The long discription of Product
 *         Image:
 *           type: string
 *           description: The single image to show when displaying all Product in ui
 *         images:
 *           type: string
 *           description: The multiple images to show when displaying the details of current Product in ui
 *         brand:
 *           type: string
 *           description: The brand name of Product
 *         price:
 *           type: string
 *           description: The price of Product
 *         category:
 *           type: string
 *           description: The category of Product
 *         countInStock:
 *           type: string
 *           description: The count of Product in stock (0-255)
 *         rating:
 *           type: string
 *           description: The rating of Product
 *         isFeatured:
 *           type: string
 *           description: To display the product as fetured in ui
 *         dateCreated:
 *           type: string
 *           description: The date at which Product is been added to to ui
 *       example:
 *          name: user-name
 *          description: user-email 
 *          richDescription: user-password
 *          Image: user-phoneno
 *          images: true/false
 *          brand: user-address
 *          price: user-house-no 
 *          category: user-zip-code
 *          countInStock: user-city 
 *          rating: user-city 
 *          isFeatured: user-city 
 *          dateCreated: user-country 
 */

/**
  * @swagger
  * tags:
  *   name: Products
  *   description: The products API
  */

 
// get only specific categories of product insted of whole product list 
router.get(`/`, async (req, res) =>{
    let filter = {}; // emty oblect to hold categories 
    // req.query.categories -> queries send by ?name=value in url
    if(req.query.categories)
    {
        // appending the categories to filter 
        // with wich Model.find(filter) will get the products from schema
        filter = {category: req.query.categories.split(',')}
    }
    
    // this will combine the Product list with the categories id table and 
    // fetch it in this json responce
    const productList = await Product.find(filter).populate('category').catch(err => {
        console.log(err);
    });
    
    if(!productList) {
        res.status(500).json({success: false})
    } 
    res.send(productList);
})
    
/**
 * @openapi
 * /e-shopping/products/{Category-Id}:
 *   get:
 *      summary: Get the categories by ID 
 *      description: This api will find the items in Category Schema by given id and return category list if that id is return. As there require no authentication in fatching the cateories.So no token required
 *      tags: [Products]
 *      parameters:
 *         - in: path
 *           name: Category-Id
 *           required: true
 *           description: Enter the categories ID which you want to fetch products
 *           schema:
 *              type: string
 *              example:
 *                  Id: category-Id1,category-Id2,...
 *              allowReserved: true
 *      responses:
 *          200:
 *              description: OK 
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Products'
 *          500:
 *              description: The category with the given ID was not found.
 */
router.get(`/:id`, async (req, res) =>{
    const product = await Product.findById(req.params.id).then(product => {
        if(!product) {
            res.status(500).json({success: false, error: "The category with the given ID was not found"})
        } 
        else{
            res.status(200).send(product);
        }
    }).catch(err => {
        res.status(500).json({success: false, err : err})
    });
})

// 'Image' -> feild name send from the front end 
// this is the middelware which upload our image url in the feild Image
// and the redirect the path to the folder 
router.post(`/`, uploadOptions.single('Image'), async (req, res) =>{
    // only stored catogryies product are allowed (category validation)
    if(!mongoose.isValidObjectId(req.body.category)) {
        return res.status(400).send('Invalid Category Id')
     }
    // req.body.ctegory contains ID
    console.log(req.body);
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Invalid Category')
    // validating the image file
    const file = req.file;
    if(!file) return res.status(400).send('No image in the request') // bad request 

    const fileName = file.filename
    const basePath = `${req.protocol}://${req.get('host')}/Public/uploads/`;
    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        Image: `${basePath}${fileName}`,// full path to the image "http://localhost:5000/public/upload/image-XYZ"
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    })

    product = await product.save().then(products =>{
        console.log(products)
        if(products)
        {
            console.log(products)
            res.status(200).send(product);
        }
        else{
            
            return res.status(500).send('The product cannot be created') // inrenal sever error
        }
    }).catch(err => {
        console.log(err);
    });

})

// updateing the existing product using id
router.put('/:id',async (req, res)=> {
    // to avoid handel error during request 
    // we will handel it using mongoose 
    // by validating the id
    if(!mongoose.isValidObjectId(req.params.id)) {
       return res.status(400).send('Invalid Product Id')
    }
    console.log(req.body, "body")
    const category = await Category.findById(req.body.category).catch(err =>{console.log(err)});
    console.log(category)
    // if(!category ) 
        // return res.status(400).send('Invalid Category')

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            Image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        },
        { new: true}
    )

    if(!product)
    return res.status(500).send('the product cannot be updated!')

    res.status(200).send(product);
})

router.delete('/:id', (req, res)=>{
    Product.findByIdAndRemove(req.params.id).then(product =>{
        if(product) {
            return res.status(200).json({success: true, message: 'the product is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "product not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

router.get(`/get/count`, async (req, res) =>{
    // get the count of product 
    const productCount = await Product.countDocuments((count) => count)

    if(!productCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        productCount: productCount
    });
})

// get only the fetured products
router.get(`/get/featured/:count`, async (req, res) =>{
    const count = req.params.count ? req.params.count : 0
    // all feature with true we will count 
    const products = await Product.find({isFeatured: true}).limit(+count);
    //                                                            ^
    //                                                   changing string to number  
    if(!products) {
        res.status(500).json({success: false})
    } 
    res.send(products);
})

// updating the gallery for other files 
// only rout havinf url gallery-images & Product id
router.put(
    '/gallery-images/:id', 
    uploadOptions.array('images', 10), // allowed maximum files at a time 
    async (req, res)=> {
        if(!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).send('Invalid Product Id')
         }
         console.log(req.body)
         const files = req.files // all the images files paths send to this url
         let imagesPaths = [];
         const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

         if(files) {
            files.map(file =>{
                imagesPaths.push(`${basePath}${file.filename}`);
            })
         }
         // updating only the images in the product schema 
         const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                images: imagesPaths
            },
            { new: true} // return the updated product 
        )

        if(!product)
            return res.status(500).send('the gallery cannot be updated!')

        res.send(product);
    }
)

module.exports = router;