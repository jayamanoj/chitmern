const express = require('express');
const {
    getProduct,
    newProduct,
    getsingleProduct,
    updateProduct,
    deleteProduct,
    getActiveProduct
} = require('../controllers/productController'); 
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');



const router = express.Router();
router.route('/product').get(getProduct); // Ensure getProduct is correctly defined
router.route('/getActiveProduct').get(getActiveProduct);
// router.route('/product').get(isAuthenticatedUser,authorizeRoles('admin'), getProduct); // Ensure getProduct is correctly defined
router.route('/addproduct').post(newProduct); // Ensure newProduct is correctly defined
router.route('/product/:id').get(getsingleProduct); // Ensure getsingleProduct is correctly defined
router.route('/product/:id').put(updateProduct); // Ensure updateProduct is correctly defined
router.route('/product/:id').delete(deleteProduct); // Ensure deleteProduct is correctly defined

module.exports = router;
