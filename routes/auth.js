const express = require("express");
const router = express.Router();
const {register,login,forgotPassword,resetPassword,verifyedEmail,verifyOtp}=require('../controller/auth')
const {registrationValidation}=require('../utils/validation')
const {checkAccessToken}=require('../middleware/checkauth')
router.post('/register',registrationValidation,register)
router.post('/login',login)
router.post('/forgetPassword',forgotPassword) 
router.post('/resetPassword/:token',resetPassword) 
router.post('/verifyemail',verifyedEmail) 
router.get('/verifyOtp/:email',verifyOtp) 

module.exports = router;