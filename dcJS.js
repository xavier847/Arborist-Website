//Deciduous Charm Javascript------------------

//Modal Functions ----------------
var  modal = document.getElementById('modal');

window.onclick = function(event) {
  var ModalImgZ = document.getElementsByClassName("galleryImgZ");

    if (event.target == modal) {
      if(ModalImgZ[0] != undefined){
          console.log(ModalImgZ[0]);
        ModalImgZ[0].className = "galleryImg";
      };
      modal.style.display = "none";
    }
}


// Page Functions -----------------
//Services Page functionality
function servicesbox(n) {
 var i;
 var x = document.getElementsByClassName("servicesinfo");
 for (i = 0; i < x.length; i++) {
    x[i].style.display="none";
 }
 x[n].style.display="block";

}

//Services Page lnks assignment
var servlinks = document.getElementsByClassName('servlink');
  for (var i=0; i<servlinks.length; i++) {
    (function () {
      var j = i;
      servlinks[i].addEventListener('click', function() {servicesbox(j);}, false);
    }());
  }



//------------ Gallery Post------------------
//Variables
var ids = [];
var currImgClass = 1;
var gImgArray = [];
var imagePosts = '';
var modalImages = '';
function reset(){
  imagePosts = '';
}

//Functions
function gPostSet() {
  var gPostArray;
  var x = document.getElementById("gallery");
  var y = x.getElementsByClassName("text2");
  var num = y.length + 1;
  return "post"+num;
}


function gImgClassSet() {
  var num = gImgArray.length + 1;
  gImgArray.push(num);
  return num;
}


//The creator function for each Gallery Post
function newGalleryPost (data) {
  //Properties
  this.id = data._id;
  this.title = data.title;
  this.text = data.body;
  this.imgArray = data.images;
  this.tags = data.tag;
  this.gPost = gPostSet();
  this.imgClass = gImgClassSet();


//Variables
  var g = document.getElementById("gallery");
  var gcontent = g.innerHTML;
  var modalC = document.getElementById("modal-content");
  var modalContent = modalC.innerHTML;
  var postsList = g.getElementsByClassName("text2");



  //Creates HTML for each Post
  function addHTML(){



    modalImages = '';

    if(this.imgArray.length != 0) {
    for(i=0;i<this.imgArray.length;i++){

        imagePosts = imagePosts.concat('<td><img class="gimg"\
         id="gimg'+gPost+'p'+i+'"" \
        src="' + this.imgArray[i] + '"></td>');

        modalImages = modalImages.concat("<img class='galleryImg' src='"+this.imgArray[i]+"'>");
        if(i==this.imgArray.length-1){
          modalImages = "<div class='modalFrame' id='m" +gPost+"'>"+modalImages+"</div>";
        }
      }};

      var gnew = "<div id='"+gPost+"' class='text2'>\
      <div class='delButt' id='"+gPost+"delButt'>Delete</div><h2>"+title+"</h2><p>"+text+"<br><br> <div class='gallerytable'><table >\
      "+imagePosts+"</table></div><div class='tags'>Tags:"+tags+"</div></div>"
      g.innerHTML = gnew + gcontent;
      modalC.innerHTML = modalContent + modalImages;

  };
  //Immediately invoke addHTML function
  addHTML();


  //Attaches Modal opening links to Thunbnails
  for(h=0; h<postsList.length; h++){
    var currDivPost = postsList[h];
    var gimgs = currDivPost.getElementsByTagName("img");

    for (var i=0; i<gimgs.length; i++) {

      (function () {
        var currDiv = postsList[h];
        var modalImg = gimgs[i];
        var j = i+1;
         gimgs[i].addEventListener('click', function() {modalg(currDiv, modalImg);}, false);
      }());
    }
  }

  //Link to open appropriate Modal
  var slideleft = document.querySelector('.slideLeft');
  var slideright = document.querySelector('.slideRight');
  modalg = function(currDiv, modalImg) {
    var xTemp = modalImg.id.lastIndexOf('p');
    n = parseInt(modalImg.id.slice(xTemp+1));

    slideleft.onclick = function(){slideDiv(currDiv, -1)};
    slideright.onclick = function(){slideDiv(currDiv, 1)};

    gallery(currDiv, slideIndex = n );
  }

  function slideDiv(currDiv, n) {
    var ModalImgZ = document.getElementsByClassName("galleryImgZ");
    if(ModalImgZ[0] != undefined){if(ModalImgZ[0].className == "galleryImgZ"){
      ModalImgZ[0].className = "galleryImg";
    }};


    gallery(currDiv, slideIndex += n)
  }


  //Modal display fucntion for thumbnails
  gallery = function(currDiv, n) {
    document.getElementById("modal").style.display = "block";


    //console.log(currDiv);
    var i;
    var allImgs = document.getElementsByClassName("galleryImg");
    var currImgs = currDiv.getElementsByTagName("img");
    var currImgsLen = currImgs.length;
    var modalFrames = document.getElementsByClassName("modalFrame");
    var currModalImgsDiv = document.getElementById("m"+currDiv.id);
    var currModalImgs = currModalImgsDiv.getElementsByClassName('galleryImg');

    if (n > currImgsLen - 1) {slideIndex = 0}
    if (n < 0) {slideIndex = currImgsLen - 1}
    for (i = 0; i < allImgs.length; i++) {
        allImgs[i].style.display = "none";
    }
      //console.log("n:"+n, "slideIndex:"+ slideIndex, currImgsLen);
    for(i=0; i< modalFrames.length; i++){
      modalFrames[i].style.display = "none";
      if(modalFrames[i].id == "m" + currDiv.id){
        modalFrames[i].style.display = "table-cell";
      }
    }
    currModalImgs[slideIndex].style.display = "inline-block";

  }


  //Add Zoom function to Gallery Thumbnails
  var img = document.getElementsByClassName('galleryImg');
  for (var i=0; i<img.length; i++) {
  img[i].addEventListener('click', zoom, false);
  }

  //Add Delete button to eaach post
  var delButts = document.getElementsByClassName('delButt');
  ids = ids.concat(this.id);

  for(i=0; i<postsList.length; i++){
    (function (){
      var delButtNums = /\d+/g.exec(delButts[i].id);
      var currId = ids[i];
      var currButt = delButts[delButtNums[0] - 1];
      currButt.addEventListener('click', function(){deletePost(currId);}, false);
  }());
  }




//Reset variables for inidividual posts
reset()

}



//Zoom function for modal images
var zoom = function(event) {
  if (event.target.getAttribute('class') ==  'galleryImg') {
    event.target.setAttribute('class', 'galleryImgZ');
  } else {
    event.target.setAttribute('class', 'galleryImg');
  }
event.stopPropagation();
}


//Delete Post Function
var deletePost = function(postId){
  angular.element(document.getElementById('GPC')).scope().gPost.deletePost(postId)
}
