const express=require('express')
const router=express.Router()
const {getUsers,updateDetail}=require('../controller/user')
const {checkAccessToken}=require('../middleware/checkauth')

const protected=(req,res,next)=>{
    if(req.cookies.isLoggedIn){
        next()
    }
    else{
        return res.json({message:'Operation Not Allowed'})
    }
}


router.use(protected)
router.get('/fetch-user',getUsers)
router.put('/update-user',updateDetail)

module.exports=router