var modal = document.getElementById('modal')

window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none"
    }
}

var blogslideleft = document.querySelector('.blogslideLeft');
blogslideleft.addEventListener('click', function() {blogslideDiv(-1);}, false);

var blogslideright = document.querySelector('.blogslideRight');
blogslideright.addEventListener('click', function() {blogslideDiv(1);}, false);


function blogslideDiv(n) {
  blogGallery(slideIndex += n)
}

function blogGallery(n) {
  document.getElementById("modal").style.display = "block";
  var i;
  var x = document.getElementsByClassName("blogImg");
  if (n > x.length) {slideIndex = 1}
  if (n < 1) {slideIndex = x.length}
  for (i = 0; i < x.length; i++) {
     x[i].style.display = "none";
  }
  x[slideIndex-1].style.display = "block";

}

function bmodalg(n) {
  blogGallery(slideIndex = n)
}

var bimgs = document.getElementsByClassName('bimg');
 for (var i=0; i<bimgs.length; i++) {
   (function () {
       var j = i+1;
       bimgs[i].addEventListener('click', function() {bmodalg(j);}, false);
 }());
}

function zoom(){
  var bimgs = document.querySelectorAll('.blogImg, .blogImgZ');
  if (bimgs[0].getAttribute('class') == 'blogImg') {

    for (var i=0; i<bimgs.length; i++) {
    bimgs[i].setAttribute('class', 'blogImgZ');
   }
 } else {
    for (var i=0; i<bimgs.length; i++) {
    bimgs[i].setAttribute('class', 'blogImg');

    }
  }
}

var zimg = document.getElementsByClassName('blogImg');
for (var i=0; i<zimg.length; i++) {
zimg[i].addEventListener('click', zoom, false);
}
