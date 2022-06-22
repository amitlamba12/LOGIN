const User = require("../model/user");
const bcrypt = require("bcrypt");
const { generateToken, oneDay } = require('../utils/generatedToken')
const { sendMail } = require("../utils/sendMail");
const { hashPassword } = require("../utils/hash-password");
const { Op } = require("sequelize");
const jwt = require('jsonwebtoken')
const dayjs = require("dayjs");
const register = async (req, res,next) => {
  const {
    name,
    lastname,
    email,
    password,
    phoneNumber,
    address,
    roles,
  } = req.body;

  let otp = Math.random();
  otp = otp * 1000000;
  otp = parseInt(otp);
  console.log(otp);

  let userExists;
  try {
    userExists = await User.findOne({
      where: { email },
    });
  } catch (error) {
    return res.status(400).json({ message: "Something went wrong2" });
  }
  if (userExists) return res.status(422).json({ message: "Email is Already Exists" });
  const genSalt = bcrypt.genSaltSync(12)
  const hashPassword = bcrypt.hashSync(password, genSalt)
  const user = {
    name: name,
    lastname: lastname,
    email: email,
    password: hashPassword,
    phoneNumber: phoneNumber,
    address: address,
    roles: roles,
    otp: otp
  }

  try {
    await User.create(user);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Something went wrong" });
  }

  const url = `http://localhost:127.0.0.1/api/verify/OTP/${otp}`
  try {
    await sendMail({
      to: email,
      from: "thebestamitkumar@gmail.com",
      subject: "User - Reset Password",
      html: `<h4>Hello ${user.name} ${user.lastname}. Please click in the <a href=${url}>link</a> to reset Password of your account</h4>`,
    });
  } catch (error) {
    console.log(error);
  }
  return res.status(201).json({ message: "User created successfully"});
};


const verifyedEmail = async (req, res,next) => {
  const { email, otp } = req.body;
  // const user = await verifyEmail(email, otp);
  // res.send(user);
let user
try {
  user = await User.findOne({ where: { email: email } })

} catch (error) {
  return res.status(400).json({ message: "Something went wrong" });
} 
 if (!user) {
    return res.status(404).json("Something went Wrong")
  }

  if (user && user.otp !== otp) {
    return res.status(404).json("Otp doesn't match")
  }

  
  const verify=await User.update(
    { isVerified: true },
    {
      where: {
        email: email,
        isVerified: { [Op.eq]: false },
      },
    }
  );

  return res.status(202).json({message:'verify Email Sucessfully'})
};

const login = async (req, res) => {
  const {
    email,
    password,
  } = req.body;

  let user;

  try {
    user = await User.findOne({
      where: { email },
    });
  } catch (error) {
    return res.status(400).json({ message: "Something went wrong" });

  }
  if (!user) return res.status(422).json({ message: "Wrong Credentials" })

  if (!(bcrypt.compareSync(password, user.password))) {
    return res.status(422).json({ message: "invalid password " });
  }

  let otp = Math.random();
  otp = otp * 1000000;
  otp = parseInt(otp);
  console.log(otp);

  const url = `http://localhost:127.0.0.1/api/verify/OTP/${otp}`
  try {
    await sendMail({
      to: email,
      from: "thebestamitkumar@gmail.com",
      subject: "User - Reset Password",
      html: `<h4>Hello ${user.name} ${user.lastname}. Please click in the <a href=${url}>link</a> to reset Password of your account</h4>`,
    });
  } catch (error) {
    console.log(error);
  }

  try {
      await User.update(
      { otp: otp },
      {
        where: {
          email: email
        },
      }
    );
  
  } catch (error) {
    return res.status(422).json({ message: "Something Went Wrong"});
  }
  
  return res.status(201).json({ message: "Before Login Please Verify the OTP"});
};

const verifyOtp = async (req, res,next) => {
  // const {otp } = req.body;
  const {email}=req.params
  // console.log("Email :--",email)
  const user = await User.findOne({ where: { email: email } })
  // if (!user) {
  //   return res.status(404).json("Something went Wrong")
  // }

  // if (user && user.otp !== otp) {
  //   return res.status(404).json("Otp doesn't match")
  // }

  const accessToken = generateToken(
    {
      id: user.id,
      role: user.roles,
      email: user.email,
      name: user.name,
      lastname: user.lastname,
    },
    oneDay
  );

  // const refreshToken = generateToken(
  //   {
  //     id: user.id,
  //     role: user.role_id,
  //     email: user.email,
  //     name: user.name,
  //     lastname: user.lastname,
  //   },
  //   oneDay
  // );

  // res.cookie("refreshToken", JSON.stringify(refreshToken),{
  //   maxAge: 5000,
  //   // expires works the same as the maxAge
  //   expires:dayjs().add(1, "days").toDate(),
  //   secure: true,
  //   httpOnly: true,
  // })

   res.cookie('isLoggedIn',true,{
    // expires works the same as the maxAge
    expires: new Date('12 12 2022'),
    secure: true,
    httpOnly: true,
  })

  return res.status(202).json({message:'Login Sucessfully'})
};


const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  let user = {};
  try {
    user = await User.findOne({
      where: {
        email,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Something went wrong!" });
  }

  if (!user) {
    return res.status(422).json({ message: "Invalid data!" });
  }

  if (user?.email !== email) {
    return res.status(403).json({ message: "User is not registered" });
  }

  //console.log("user", user);
  const resetPasswordToken = generateToken(
    {
      id: user.id,
      role: user.roles,
      email: user.email,
      name: user.name,
      lastname: user.lastname,
    },
    oneDay
  );
  const link = `http://localhost:127.0.0.1/reset-password/${resetPasswordToken}`;
  // console.log("link", link);
  //thebestamitkumar@gmail.com
  try {
    await sendMail({
      to: email,
      from: "thebestamitkumar@gmail.com",
      subject: "User - Reset Password",
      html: `<h4>Hello ${user.name} ${user.lastname}. Please click in the <a href=${link}>link</a> to reset Password of your account</h4>`,
    });
  } catch (error) {
    console.log(error);
  }
  res.status(200).json({ message: "Password Reset Link Sent" });
};



const resetPassword = async (req, res, next) => {
  const { password: _plainPassword, confirmPassword } = req.body;
  const { token } = req.params;
  console.log('token', token)
  console.log("password:--", _plainPassword,"confirmPassword:-- ",confirmPassword);
  const secret = process.env.APP_SECRET;
  let decodedToken = {};
  try {
    decodedToken = jwt.verify(token, secret);
  } catch (error) {
    return res.status(403).json({ message: "Please request again" });
  }

  if (!decodedToken) {
    return res.status(422).json({ message: "Invalid data" });
  }
  if (_plainPassword !== confirmPassword) {
    return res.status(422).json({ message: "Password does not match" });
  }
   console.log("decodedToken", decodedToken);

  const password = await hashPassword(_plainPassword);
  try {
    await User.update(
      { password },
      {
        where: {
          id: decodedToken.id,
        },
      }
    );
  } catch (error) {
    return res.status(400).json({ message: "Something went wrong!" });
  }

  return res.status(200).json('Password Updated Sucessfully')
}


const logout=(req,res)=>{
 res.clearCookie("refreshToken")
}
// router.post('/logout', (req, res) => {
//   //show the saved cookies
//   res.clearCookie()
//   res.send('Cookie has been deleted successfully');
// });

module.exports = {register,login, forgotPassword, resetPassword, verifyedEmail,verifyOtp }