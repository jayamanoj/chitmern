const express = require('express');
const { getAllVouchar } = require('../controllers/voucharController');

const router = express.Router();

router.route('/getvouchar').get(getAllVouchar);



module.exports = router;
