const express = require('express');
const { getBill, newBill, getsingleBill, updateBill, deleteBill, getUserBills, getallBill } = require('../controllers/saleBillController');

const router = express.Router();

router.route('/getbill').get(getBill);

router.route('/getallbill').get(getallBill);

router.route('/newbill').post(newBill); 

router.route('/getsinglebill').get(getsingleBill); 

router.route('/updatebill').get(updateBill)

router.route('/deletebill').get(deleteBill)

router.route('/user/:userId').get(getUserBills)


module.exports = router;
