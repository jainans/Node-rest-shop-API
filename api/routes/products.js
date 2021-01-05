const express = require('express');

const router  = express.Router();

const multer = require('multer');

const path  = require('path');

const checkAuth = require("../middleware/checkauth");

const ProductControllers = require("../controllers/products");
// storage engine
const storage = multer.diskStorage({
   destination: "./upload",
   filename: (req, file, cb)=>{
       return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
   }
});

const fileFilter =  (req, file, cb)=>{
    if(file.mimetype=== 'image/jpeg' || file.mimetype=== 'image/png'){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
}

const upload = multer({
    storage : storage,
    limits : {
        fileSize : 1024*1024*5
    },
    fileFilter : fileFilter
});


//getting all products
router.get('/', ProductControllers.get_all_products);

//posting a new product
router.post('/',  checkAuth ,  upload.single('productImage'), ProductControllers.post_product);

//get individual product with id
router.get('/:productID', ProductControllers.get_a_productdetails);

//updating a product details
router.patch('/:productID',checkAuth,  ProductControllers.update_product);

//delete a particular product 
router.delete('/:productID', checkAuth,  ProductControllers.delete_product);

module.exports = router;