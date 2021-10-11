const express = require('express');

const app = express();

const morgan = require('morgan');

// const bodyParser = require('body-parser');

require("dotenv").config();

const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');

const orderRoutes = require('./api/routes/orders');

const userRoutes  =  require('./api/routes/user');

mongoose.connect('mongodb+srv://node-rest-shop:'+ process.env.MONGO_ATLAS_PW +'@node-rest-shop.ge2bu.mongodb.net/myproject?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

mongoose.Promise  = global.Promise;

app.use(morgan('dev'));


app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use('/upload', express.static('upload/'));

// Routes which should handle request
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use((req, res, next)=>{
   const error = new Error('Not Found');
   error.status = 404;
   next(error);
});

app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({

        error : {
            message : error.message
        }
    });

});

module.exports = app;
