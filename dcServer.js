//Deciduous Charm NodeJS Server--------------------------


// Required Modules--------------------

const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      fs = require('fs'),
      multer = require('multer'),
      mongoose = require('mongoose');


mongoose.connect('mongodb://127.0.0.1:27017');

//Application Settings-----------------

app.use(express.static('/home/public'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(function(req, res, next) {
//set headers to allow cross origin request.
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get("/Arbor", function(req, res){
  res.sendFile('/home/public/Arbor/index.htm')
});
app.get("/api/GalleryPost", getAllPosts);
app.post("/api/createGalleryPost", createGalleryPost);

app.post("/api/ImagePathSet", function(req, res){
  res.sendStatus(200);
  imgsLength = req.body.imgsLength;
  console.log(req.body);
});

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, '/home/public/Arbor/Images/Gallery')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

var upload = multer({ storage: storage })


app.post('/api/ImagesUpload', upload.any('files'), function(req, res){

      req.files.forEach(function(file){
          imagePaths.push(file.path);
        })

      res.json({error_code:0,err_desc:null, imagesPaths:imagePaths});
      imgPathReset();
})

app.post('/api/deletePost', deletePost);

//Global Variables-----------------

var imgClass = 0;
var imgsLength;
var imagePaths = [];
var imagePathsUp = [];
var imgPathReset = function(){
    imagePathsUp = imagePaths;
    imagePaths = [];
};



//Post Schema
var gPostSchema = mongoose.Schema({
  title: {type: String, required: true},
  body: String,
  tag: {type: String, enum: ['Trimming', 'Removals', 'Treatments', 'Aboriculture']},
  images: {type: Array, },
  imageClass: Number,
  posted: {type: Date, default: Date.now}
}, {collection: "Gallery Posts"});


var gImageSchema = mongoose.Schema({
  img: {data: Buffer, contentType: String}
}, {collection: "Images"});

var gPostModel = mongoose.model("Gallery Posts", gPostSchema);
var gImageModel = mongoose.model("Images", gImageSchema);







//Functions-------------------------------


//Retrieves all posts fitting Schema
function getAllPosts(req, res) {
  gPostModel
    .find()
    .then(
      function(allPosts){
        res.json(allPosts);
      },
      function(error){
        res.sendStatus(400);
      }
    )
}


//Uses Schema to create post in MongoDB
function createGalleryPost(req, res){
  var gPost = req.body;

/*  imagePaths.push(req.files[0].path);
  console.log(imagePaths);
  if(imagePaths.length == imgsLength){
    res.json({error_code:0,err_desc:null, imagesPaths:imagePaths});
    imgPathReset();
  } else {res.json({error_code:0,err_desc:null})
          };
    });
*/

  //imgClass = gPost.imageClass;
  gPostModel
    .create(gPost)
    .then(
      function(gPostObj){
          res.json(200);
      },
      function(error){
          res.sendStatus(400);
      }
    );
}

//Delete Post/Document from Database
function deletePost (req, res){
  var postId = req.body;
  gPostModel.find({
    _id: postId._id},
    function(err, docs){
        if(docs[0].images.length > 0){
          for(i=0; i<docs[0].images.length; i++){
            imgToDel = '/home/public' + docs[0].images[i];
            fs.unlink(imgToDel, function(err){
              if(err){console.log(err)}
              })
            }
            deleteDoc(postId);
          } else {
            deleteDoc(postId);
          }

      }
    )

  function deleteDoc(postId){
    gPostModel.find({_id: postId._id}).remove(function(err) {
        if(err){
          res.sendStatus(400);
        }else{
          res.send("Post Deleted!");
        }
      })
    }

  /*  function(err, docs){
      console.log(docs);
      if(docs[0].im) {
      for(i=0; i<docs[0].images.length; i++){
        fs.unlink(docs[0].images[i], function(err){
          if(err){console.log(err)}
          })
        }
      }
  }).remove(function(err) {
    if(err){
      res.sendStatus(400);
    }else{
    res.send("Post Deleted!");
  }})
*/

}

//Daemon to reset Server
function resetCheck(){
  var resFile = '/home/protected/Arborsite/resetDaemon';

  fs.access(resFile, fs.constants.F_OK, function(err){
    if (err) {
      //normal state
      return;
    }
    console.log("flag file found. resetting server...");
    fs.unlink(resFile, function(err){
      if (err){
        console.log('fs.unlink failed:' + err);
        return
      };
      process.exit();
    });
  })
}

setInterval(resetCheck, 5000);


//Server---------------------
app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function(){
  console.log("Arborsite Node App running on port:" + app.get('port'));
});
