//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const trunc = require(__dirname+"/truncate.js");
const mongoose = require("mongoose");


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
mongoose.connect("mongodb://localhost:27017/blogPostDB",{
  useNewUrlParser:true, 
  useUnifiedTopology: true,  
  useFindAndModify: false});

// let posts = [];
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let flag = 0, flag1=0;
const blogSchema = new mongoose.Schema({
  title : String,
  body : String
})

const Blog = mongoose.model("Blog",blogSchema);

app.get("/",function(req,res){

    const homePosts = [];

    Blog.find({},function(err,foundb){
      if(!err){
        // console.log(foundb); 
        foundb.forEach(function(p){
          const homePost = {
            _id : p._id,
            title : p.title,
            body : trunc.tr(p.body,100)
          };
          homePosts.push(homePost);
        })

        res.render("home",{
          startingContent : homeStartingContent,
          posts : homePosts,
          _ : _
      })
      }
      else{
        console.log(err);
      }
    })
});


app.get("/about",function(req,res){
  res.render("about",{
    aboutContent : aboutContent
  });
})


app.get("/contact",function(req,res){
  res.render("contact",{
    contactContent : contactContent
  });
})


app.get("/compose",function(req,res){
  res.render("compose");
})


app.get("/posts/:pid",function(req,res){
  
  let p = req.params.pid;
  Blog.findOne({_id : p }, function(err,pp){
     if(!err){
      res.render("post",{
        post : pp
      })
      }
      else{
        console.log(err);
      }
  })
})


app.post("/",function(req,res){
  flag=1;
  const post = {
    title: req.body.postTitle,
    body: req.body.postBody};

  const b = new Blog({
    title: post.title,
    body : post.body
  })

  // posts.push(post);
  // console.log(posts);
  b.save(function(err){
    if (!err){
      res.redirect("/");
    }
  });
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
