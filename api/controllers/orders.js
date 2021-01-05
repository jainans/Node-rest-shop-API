const Order = require('../models/order');
const mongoose = require('mongoose');
const Product = require('../models/product');
exports.get_all_orders =  (req, res, next)=>{
    Order.find()
    .select('product quantity _id')
    .populate('product', 'name')
    .exec()
    .then(docs =>{
         res.status(200).json({
              count  : docs.length,
              orders : docs.map(doc => {
                   return {                                   
                        _id : doc._id,
                        product : doc.product,
                        quantity  : doc.quantity,
                        request :{
                             type : 'GET',
                             url : 'http://localhost:3000/orders/' + doc._id
                        }
                   }
              })
         })
    })
    .catch(err =>{
         console.log(err),
         res.status(500).json({
              error : err
         })
    });
//     res.status(200).json({
//          message: 'Handling GET requests to /orders'
//     });
          

}


exports.post_order = (req, res, next)=>{
    //     const order = {
    //          productID : req.body.productID,
    //          quantity : req.body.quantity
    //     };
    //     res.status(200).json({
    //          message: 'Handling POST requests to /orders',
    //          order : order
    //     });
         Product.findById(req.body.productId)
         .then(product =>{
              if(!product){
                   return res.status(404).json({
                        message : "Product Not Found"
    
                   });
              }
              const order = new Order({
                   _id : mongoose.Types.ObjectId(),
                   quantity : req.body.quantity,
                   product : req.body.productId
              });
         
             return  order.save();
         })
              .then(result =>{
                   
                   res.status(201).json({
                        message :  'order was placed successfully',
                        createdOrder : {
                             _id : result._id,
                             quantity : result.quantity,
                             product : result.product
                        },
                        request : {
                             type : 'GET',
                             url : 'http://localhost:3000/orders/' + result._id
                        }
                   });
              })
              .catch(err => {
                  console.log(err),
                  res.status(500).json({
                       error : err
                  })
              });
          
    
    }


    exports.get_order =   (req, res, next)=>{
        //     const id = req.params.orderID;
        //     res.status(200).json({
        //          message: 'order details with orderID as below ',
        //          id: id
        //     });
               Order.findById(req.params.orderID)
               .populate("product")
               .exec()
               .then(order =>{
                    if(!order){
                         res.status(404).json({
                              message : "Order Not Found"
                         });
                    }
                    res.status(200).json({
                         order : order,
                         request : {
                              type : 'GET',
                              url : "http://localhost:3000/orders/"
                         }
                    })
               })
               .catch(err =>{
                    res.status(500).json({
                         error : err
                    })
               });
        
        }

exports.delete_order = (req, res, next)=>{
    //     const id = req.params.orderID;
    //     res.status(200).json({
    //          message: 'order deleted successfully! ',
    //          id: id
    //     });
          Order.remove({_id  : req.params.orderID})
          .exec()
          .then(result =>{
               res.status(200).json({
                    message : "order deleted",
                    request :{
                         type : "POST",
                         url : "http://localhost:3000/orders/",
                         body :{
                              productId : 'ID',
                              quantity : "Number"
                         }
                    }
               })
          })
          .catch(err =>{
              res.status(500).json({
                   error : err
              })
         });
    }