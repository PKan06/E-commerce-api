const {Category} = require('../models/category');
const express = require('express');
const router = express.Router();

// to avoid duplicates response wee define the schema of categories  
/**
 * @openapi
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the Category
 *         name:
 *           type: string
 *           description: The name of Category
 *         color:
 *           type: string
 *           description: The color to dispay for the Category
 *         icon:
 *           type: string
 *           description: Which icon to display in the front end
 *       example:
 *         id: Category-ID
 *         name: men-fashion
 *         color: color-men-fashion
 *         icon: icon-men-fasion
 */

/**
  * @swagger
  * tags:
  *   name: Categories
  *   description: The categories API
  */

/**
 * @openapi
 * /e-shopping/categories:
 *   get:
 *      summary: Show all the categories 
 *      description: This api will find the items in Category Schema and return category list. As there require no authentication in fatching the cateories.So no token required
 *      tags: [Categories]
 *      responses:
 *          200:
 *              description: There exist catogorys which are then return
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Category'
 *          500:
 *              description: There doesn't exist any catogories yet
 */


router.get(`/`, async (req, res) =>{
    const categoryList = await Category.find();

    if(!categoryList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(categoryList);
})

/**
 * @openapi
 * /e-shopping/categories/{Category-Id}:
 *   get:
 *      summary: Get the categories by ID 
 *      description: This api will find the items in Category Schema by given id and return category list if that id is return. As there require no authentication in fatching the cateories.So no token required
 *      tags: [Categories]
 *      parameters:
 *         - in: path
 *           name: Category-Id
 *           required: true
 *           description: Enter the categories ID which you want to fetch 
 *           schema:
 *              type: string
 *      responses:
 *          200:
 *              description: OK 
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Category'
 *          500:
 *              description: The category with the given ID was not found.
 */

// get categories by id
router.get('/:id', async(req,res)=>{
    const category = await Category.findById(req.params.id).catch(err=>{
        console.log(err) 
    });
    
    if(!category) {
        res.status(500).json({message: 'The category with the given ID was not found.'})
    } 
    res.status(200).send(category);
})

/**
 * @openapi
 * /e-shopping/categories:
 *   post:
 *      summary: Add the new categories in the db 
 *      description: This api will add the items in Category Schema and return updated category list if added succesfully. Make sure to add the bearer token as this can only done by admins
 *      tags: [Categories]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                          type: object
 *                          example:
 *                              name: men-fashion
 *                              color: color-men-fashion
 *                              icon: icon-men-fasion
 *      responses:
 *          200:
 *              description: The new Category is succesfully created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Category'
 *          400:
 *              description: The category missing some feilds.
 *          401:
 *              description: The user is not authorized. Make sure to authorize through the token generated after login.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          example:
 *                              message: The user is not authorized
 */
//add a new categories 
router.post('/', async (req,res)=>{
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    })
    category = await category.save();
    
    if(!category)
    return res.status(400).send('the category cannot be created!')

res.send(category);
})

/**
 * @openapi
 * /e-shopping/categories/{Category-Id}:
 *   put:
 *      summary: Update the existing categories in the db based on ID
 *      description: This api update the items in Category Schema and return updated category list if added succesfully. Make sure to add the bearer token as this can only done by admins
 *      tags: [Categories]
 *      parameters:
 *         - in: path
 *           name: Category-Id
 *           required: true
 *           description: Enter the categories ID which you want to fetch 
 *           schema:
 *              type: string
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                          type: object
 *                          example:
 *                              name: men-fashion
 *                              color: color-men-fashion
 *                              icon: icon-men-fasion
 *      responses:
 *          200:
 *              description: The new Category is succesfully created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Category'
 *          400:
 *              description: The category missing some feilds.
 *          401:
 *              description: The user is not authorized. Make sure to authorize through the token generated after login.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          example:
 *                              message: The user is not authorized
*/
router.put('/:id',async (req, res)=> {
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            icon: req.body.icon || category.icon,
            color: req.body.color,
        },
        { new: true} // get the new doc or old 
        )
        
        if(!category)
        return res.status(400).send('the category cannot be created!')
    
    res.send(category);
})

/**
 * @openapi
 * /e-shopping/categories/{Category-Id}:
 *   delete:
 *      summary: Delete the existing categories in the db based on ID
 *      description: This api Delete the items in Category Schema. Make sure to add the bearer token as this can only done by admins
 *      tags: [Categories]
 *      parameters:
 *         - in: path
 *           name: Category-Id
 *           required: true
 *           description: Enter the categories ID which you want to fetch 
 *           schema:
 *              type: string
 *      responses:
 *          200:
 *              description: The new Category is succesfully created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Category'
 *          404:
 *              description: The category not found.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          example:
 *                              message: category not found!
 *          401:
 *              description: The user is not authorized. Make sure to authorize through the token generated after login.
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          example:
 *                              message: The user is not authorized
 *          500:
 *              description: The server error.
 */
router.delete('/:id', (req, res)=>{
    Category.findByIdAndRemove(req.params.id).then(category =>{
        if(category) {
            return res.status(200).json({success: true, message: 'the category is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "category not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

module.exports =router;