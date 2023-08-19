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

router.get(`/:id`, async (req, res) =>{
    const product = await Product.findById(req.params.id);

    if(!product) {
        res.status(500).json({success: false})
    } 
    res.send(product);
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