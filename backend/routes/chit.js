const express = require('express');
const {
    getAllChits,
    addChit,
    getSingleChit,
    updateChit,
    deleteChit,
} = require('../controllers/chitController'); // Ensure you have these functions in your controller
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');

const router = express.Router();

// Route to get all chits with optional filtering/pagination
router.route('/chits').get(getAllChits);

// Route to add a new chit
router.route('/addchit').post(addChit);

// Route to get a single chit by ID
router.route('/chit/:id').get(getSingleChit);

// Route to update a chit by ID
router.route('/chit/:id').put(updateChit);

// Route to delete a chit by ID
router.route('/chit/:id').delete(deleteChit);


// Use these routes with authentication and role-based access if needed
// router.route('/chits').get(isAuthenticatedUser, authorizeRoles('admin'), getChits);
// router.route('/chit').post(isAuthenticatedUser, authorizeRoles('admin'), newChit);

module.exports = router;
