const express = require('express');
const router  = express.Router();

const checkAuth = require("../middleware/checkauth");

const OrdersController = require("../controllers/orders");

router.get('/',checkAuth , OrdersController.get_all_orders);

router.post('/',checkAuth , OrdersController.post_order);


router.get('/:orderID',checkAuth , OrdersController.get_order);

router.delete('/:orderID',checkAuth , OrdersController.delete_order);
module.exports = router;