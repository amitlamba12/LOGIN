const express = require('express')
const cookieparser = require("cookie-parser");
require('dotenv').config()
const routes = require("./routes");
const app = express()
app.use(express.json());
app.use(cookieparser());
const db = require("./config/db");
const main=async()=>{
    try {
        await db.authenticate()
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}

main()

app.get("/api/v1", (req, res, ) => {
    res.status(200).json({ message: "Server running properly" });
});

app.use("/api/v1", routes);

const PORT = process.env.PORT || 3000;

app.get('/setcookie', (req, res) => {
//   res.cookie(`Cookie token name`,`encrypted cookie string Value`);
     res.clearCookie("Cookie token name")
    // res.cookie('isLoggedIn',true,{
    //   // expires works the same as the maxAge
    //   expires: new Date('12 12 2022'),
    //   secure: true,
    //   httpOnly: true,
    // })
  res.send('Cookie have been saved successfully');
});

app.listen(PORT, () => {
    console.log(`Server is Started : ${PORT}`)
})