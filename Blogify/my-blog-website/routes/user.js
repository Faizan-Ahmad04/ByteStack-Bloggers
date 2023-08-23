const express = require("express");
const User = require("../models/user");

const router = express.Router();

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
  try {

    const user = await User.findOne({ email });
    const userFullName = user.fullname;

    const token = await User.matchPasswordAndgenerateToken(email, password);
    
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render('signin',{
        error:"Incorrect email id or password"
    })
  }
});

router.post("/signup", async (req, res) => {
  const { fullname, email, password } = req.body;
  // console.log(req.body.fullname);
  await User.create({
    fullname,
    email,
    password,
  });
  return res.redirect("/");
});

router.get('/logout', (req, res)=>{
  res.clearCookie('token').redirect('/');
});



module.exports = router;
