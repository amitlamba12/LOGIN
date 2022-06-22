const User = require("../model/user");

const getUsers = async (req, res, next) => {
    const { role } = req.auth
    let allUser

    if (role === "SUPER_ADMIN" || role === "ADMIN") {
        allUser = await User.findAll({})
    }
    else {
        return res.status(404).json({ message: 'Something went Wrong' })
    }

    return res.status(200).json({ User: allUser })
}

const updateDetail = async (req, res, next) => {
    const { role } = req.auth
    const { name, lastname, email, roles, phoneNumber } = req.body

    console.log('req.body.---->',name,lastname,email)
    let userUpdate
    if (role === "SUPER_ADMIN") {
        userUpdate = await User.update({name:req.body.name,
            lastname:req.body.lastname,
            phoneNumber:req.body.phoneNumber,
            roles:req.body.role},
            {
              where: {
                email:req.body.email,
              }
            })
            return res.status(200).json({ message:'User Update Sucessfully',User: userUpdate })
        }
    else {
        return res.status(404).json({ message: 'Not Authenticated Only SUPER_ADMIN Updated the User Detail' })
    }   
}
module.exports = { getUsers ,updateDetail}