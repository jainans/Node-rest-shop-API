const Product =  require('../models/product');
const mongoose = require('mongoose');
exports.get_all_products = (req, res, next)=>{
    // res.status(200).json({
    //      message: 'Handling GET requests to /products'
    // });
     Product.find()
     .select('name price _id productImage')
     .exec()
     .then(docs =>{
        //  console.log(docs);
        //  res.status(200).json(docs);
       const response = {
           count: docs.length,
           products: docs.map(doc =>{
               return{
                   name : doc.name,
                   price: doc.price,
                   productImage: doc.productImage,
                   _id: doc._id,
                   request: {
                       type: 'GET',
                       url : 'http://localhost:3000/products/'+doc._id
                   }
               }
           })
       };
       res.status(200).json(response);
     })
     .catch(err => {
         console.log(err);
         res.status(500).json({
             error:err
         });
     });
}

exports.post_product = (req, res, next)=>{
    // const product  = {
    //     name: req.body.name,
    //     price: req.body.price
    // };

    const product = new Product({
         _id: new mongoose.Types.ObjectId(),
         name: req.body.name,
         price: req.body.price,
         productImage: req.file.path
    });

    product
    .save()
    .then(result=>{
        // console.log(result);

        res.status(201).json({
            message: 'product created successfully',
            createdProduct :{
                name : result.name,
                price: result.price,
                _id : result._id, 
                request: {
                   type: 'GET' ,
                   url : 'http://localhost:3000/products/'+result._id
                }
            }
    })
    })
    .catch(err=> {
        console.log(err);
        res.status(500).json({
            error : err
        });
    });

}

exports.get_a_productdetails = (req, res, next)=>{
    //  if(id==="special"){
    //      res.status(200).json({
    //          message: 'you discoverd the special products with ',
    //          id : id
    //      });
    //  }
    //  else{
    //      res.status(200).json({
    //          message: 'you discoverd the products with id ',
    //          id : id
    //      });
 
    //  }
   const id = req.params.productID;
   Product.findById(id)
   .select('name price _id productImage')
   .exec()
   .then(doc => {
       console.log("From Database", doc);
       if(doc){
       res.status(200).json({
           product : doc,
           request : {
               type : 'GET', 
               description : 'Get List of All products here',
               url : 'http://localhost:3000/products/'
           }
       });
       }
       else{
           res.status(404).json({
               message : "Not Found Any valid entry for given ID"
           });
       }
   })
   .catch(err => {
       console.log(err);
       res.status(500).json({error : err});
   }); 

}

exports.update_product = (req, res, next)=>{
    // const id = req.params.productID;
    // res.status(200).json({
    //    message: 'product updated successfully with productID',
    //    id : id
    // });
    const id = req.params.productID;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id : id}, { $set: updateOps })
    .exec()
    .then(result => {
        
        res.status(200).json({
            message : "Product Updated",
            request :{
                type : 'GET',
                url : 'http://localhost:3000/products/'+id
            }
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error : err
        });
    });
}

exports.delete_product = (req, res, next)=>{
    // const id = req.params.productID;
    // res.status(201).json({
    //    message: 'product deleted successfully with productID',
    //    id : id
    // });
    const id = req.params.productID;
    Product.remove({_id: id})
    .exec()
    .then(result=>{
        res.status(200).json({
            message : 'Product Deleted Successfully !',
            request : {
                type : 'POST',
                url : 'http://localhost:3000/products/',
                body :{
                    name : 'String',
                    price : 'Number'
                }
            }
        });

    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error : err
        });
    });
}