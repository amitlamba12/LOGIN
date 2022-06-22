const res = require("express/lib/response")
const User = require("../model/user")

const verifyEmail = async (email, otp) => {
    const user = await User.findOne({ where: { email: email } })
    if (!user) {
        return res.status(404).json("Something went Wrong")
    }
    
    if (user && user.Otp !== otp) {
        return res.status(404).json("Otp doesn't match")
    }

    try {
        await User.update(
        {isVerified:true},
          {
            where: {
                isVerified:false
            },
          }
        );
      } catch (error) {
        return res.status(400).json({ message: "Something went Wrong" });
      }

}

module.exports={verifyEmail}