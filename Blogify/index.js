const express = require('express');
const path = require('path');
const mongoose = require('mongoose');


const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const Blog = require('./models/blog');

const cookieParser = require('cookie-parser');
const {checkForAuthenticationCookie} = require('./middlewares/authentication');

const app = express();
const PORT = 80;

mongoose.connect('mongodb://127.0.0.1:27017/blogify').then(()=>console.log("mongoDB connected"));

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.resolve('./public')))

app.set('view engine','pug');
app.set('views', path.resolve('./views'));

app.get('/', async(req, res)=>{
    const allBlogs =  await Blog.find({});
    // console.log(req.user)
    return res.render('home',{
        user: req.user,
        blogs: allBlogs,
    });
});


app.use('/user', userRoute);
app.use('/blog', blogRoute);

app.listen(PORT,()=>console.log(`Server Startes at PORT: ${PORT}`));