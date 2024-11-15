const express = require('express');
const {
    getCustomers,
    newCustomer,
    getSingleCustomer,
    updateCustomer,
    deleteCustomer,
    getActiveCustomers
} = require('../controllers/customerController'); 
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');

const router = express.Router();

router.route('/customers').get(getCustomers); // Get all customers with optional filtering/pagination
router.route('/activeCustomers').get(getActiveCustomers); // Get active customers only

// Use these routes if authentication and authorization are needed
// router.route('/customers').get(isAuthenticatedUser, authorizeRoles('admin'), getCustomers);

router.route('/customer').post(newCustomer); // Add a new customer
router.route('/customer/:id').get(getSingleCustomer); // Get a single customer by ID
router.route('/customer/:id').put(updateCustomer); // Update a customer by ID
router.route('/customer/:id').delete(deleteCustomer); // Delete a customer by ID

module.exports = router;
