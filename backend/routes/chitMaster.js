const express = require('express');
const {
    getAllChits,
    addChit,
    getSingleChit,
    updateChit,
    deleteChit,
    getAllChitsunwind,
    updateChitMemberDue,
} = require('../controllers/chitmasterController'); // Ensure your ChitMaster controller has these functions
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');

const router = express.Router();

// Route to get all chits with optional filtering/pagination
router.route('/chitmasters').get( getAllChits);

// Route to add a new chit
router.route('/chitmaster').post(addChit);

// Route to get a single chit by ID
router.route('/chitmaster/:id').get(getSingleChit);

// Route to update a chit by ID
router.route('/chitmaster/:id').put(updateChit);

// Route to delete a chit by ID
router.route('/chitmaster/:id').delete(deleteChit);

router.route('/getallchitsunwind').get(getAllChitsunwind);

router.route('/updatechitmemberdue').post(updateChitMemberDue);

// Optionally, you can add role-based access control for more security
// Example:
// router.route('/chitmasters').get(isAuthenticatedUser, authorizeRoles('admin'), getAllChits);
// router.route('/chitmaster').post(isAuthenticatedUser, authorizeRoles('admin'), addChit);

module.exports = router;
