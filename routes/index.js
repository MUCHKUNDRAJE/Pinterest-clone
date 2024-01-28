var express = require('express');
var router = express.Router();
const usermodule = require("./users");
const postmodule = require("./post");

const passport = require('passport');
const localStrategy = require("passport-local");
var upload =require('./multer');


passport.use(new localStrategy(usermodule.authenticate()));


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
}); 
router.get('/register' ,function(req ,res,next){
  res.render('register')
})
router.get('/profile', isLoggedIn , async function(req , res ,next){
  const user =
   await usermodule
  .findOne({username:req.session.passport.user})
  .populate('post')
  res.render('profile',{user})
})

router.get('/upload', isLoggedIn , async function(req , res ,next){
  const user =
   await usermodule
  .findOne({username:req.session.passport.user})
  .populate('post')
  res.render('upload',{user})
})

router.get('/feed', isLoggedIn , async function(req , res ,next){
  const user =
   await usermodule
  .findOne({username:req.session.passport.user})
     const post =  await postmodule.find()
  .populate('user')
  res.render('feed',{user, post})
})


router.post('/fileupload', isLoggedIn ,upload.single('image'), async function(req , res ,next){
   const user = await usermodule.findOne({username:req.session.passport.user});
   user.profileimg = req.file.filename;
   await user.save(); 
   res.redirect("/profile");
 
})

router.post('/createpost', isLoggedIn ,upload.single('postimage'), async function(req , res ,next){
  const user = await usermodule.findOne({username:req.session.passport.user});
   const post = await postmodule.create({
    user : user._id,
    title:req.body.text,
    discription:req.body.discription,
    img : req.file.filename,

  });
user.post.push(post._id);
await user.save();
res.redirect("/profile")

})






router.get('/add', isLoggedIn ,upload.single('image'), async function(req , res ,next){
  const user = await usermodule.findOne({username:req.session.passport.user})
  res.render('add',{user})

})



router.post('/register', function(req, res, next) {
  const data = new usermodule({
    username: req.body.username,
    email: req.body.email,
    name: req.body.name,
  });
  usermodule.register(data, req.body.password)
    .then(function(user) {
      passport.authenticate('local')(req, res, function() {
        res.redirect("/");
      });
    })


})







router.post('/login', passport.authenticate('local',{
failureRedirect:"/" ,
successRedirect: "/profile",
}), function(req, res, next) {
})

router.get('/logout',function(req,res,next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/");
}



module.exports = router;
