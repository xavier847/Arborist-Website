//Deciduous Charm AngularJS----------------------

//Initializations-------------------------

console.log("APPJS RAN");
var app = angular.module('fileUpload', ['ngFileUpload']);

app.controller("GalleryPostController",['Upload', '$http', '$scope', '$window', GPCont]);
app.controller("delButCont",['$scope','$element', dBC]);
app.directive("filesInput", filesInput);
app.directive("filesBrowse", filesBrowse);




//Gallery Post Page Functions----------------

function dBC($scope, $element){
  $scope.$watch(function(){return $element[0].childNodes.length;}, function(newV, oldV){
    if (newV === oldV){
    }else{
      if(window.location.href.indexOf('GalleryPostApp') > -1) {
        var deleteView = document.getElementsByClassName('delButt');
        for(i=0;i<deleteView.length;i++) {
         deleteView[i].style.display = "block";
        }
      }
    }
  })
}







var filesToUpload = [];

function filesBrowse() {
var browseFiles = []
return {
  require: "ngModel",
  link: function postLink(scope,elem,attrs,ctrl) {
    elem.on("change", function(e) {
      var files = elem[0].files;
      for(i=0; i<files.length; i++){
      filesToUpload.push(files[i]);
    }
      ctrl.$setViewValue(filesToUpload);
    })
  }
}
}


function filesInput() {
  var files = [];
function filesInputCtrl($scope){
}


function link($scope, $elem, $attrs, $ctrl) {
  var drop = $elem[0].getElementsByClassName("dropzone")[0];
  var dropFiles = [];
  function onDrop(event) {
    event.preventDefault();

  if (event.dataTransfer && event.dataTransfer.files) {
    var files = event.dataTransfer.files;
    for(i=0;i<files.length;i++) {
      filesToUpload.push(files[i]);
    }
    $ctrl.$setViewValue(filesToUpload);
      this.className = "dropzone";
      console.log();
    }
  }


  drop.addEventListener("dragenter", function(event){
    this.className = "derp";
  }, false);

  drop.addEventListener("dragover", function(event){
    event.preventDefault();
    this.className = "derp";
  }, false);

  drop.addEventListener("dragleave", function(event){
    this.className = "dropzone";
  }, false);


  drop.addEventListener("drop", onDrop, false);

}

return {
  require: "ngModel",
  restrict: "EA",
  scope:{} ,
  controllerAs: 'vm',
  link:  link
}

};


 function GPCont(Upload, $http, $scope, $window) {

   function init() {
       getAllPosts();
     };

   init();




    var vm = this;
    vm.submit = function(gPost){

      if(vm.images != undefined){
        vm.imageClass = currImgClass;
        var imgsLength = vm.images.length;
        $http.post('/api/ImagePathSet', ({imgsLength: imgsLength}));
        vm.upload(vm.images)}
      else{
          vm.GalleryPost(gPost);

        };

      };




    function getAllPosts() {
      $http
        .get("/api/GalleryPost")
        .then(
          function(allPosts){
            //console.log(allPosts);
            var data = allPosts.data;
            for(i=0;i<data.length;i++){
            $scope.gPosts = newGalleryPost(data[i]);
            }
          },
          function(error){
            console.log("POST request error")
          }
      );
    }

    vm.upload = function (files) {
        Upload.upload({
          url: '/api/ImagesUpload',
          method: 'POST',
          data: {
            files:files,
          }
        }
        )
        .then(function (resp) {
          if(resp.data.error_code === 0){
            if(resp.data.imagesPaths){
            //console.log(resp.data.imagesPaths);
            //setImagePaths();
            vm.GalleryPost($scope.gPost, resp.data.imagesPaths);
          }
        } else if(resp.data.error_code === 1){
            console.log(resp.data.err_desc);
          };
        });
    }

  vm.GalleryPost =  function(gPost, images) {
    gPost.images = images;
    console.log(gPost.images);
    if (gPost.images != undefined){
      for(i=0; i<gPost.images.length; i++){
        gPost.images[i] = gPost.images[i].slice(12);
      };
    };


    $http
        .post("/api/createGalleryPost", gPost)
        .then(function(resp){
          window.location.reload(true);
        })
    }

    vm.deletePost = function(postId) {
      var postId = (postId);
      //console.log(postId);
      var data = {_id: postId};
      console.log(data);
      var conf = confirm("Delete Post?")
      if (conf){
        $http
          .post('/api/deletePost', data)
          .then(function(resp){
            window.location.reload(true);
          })
        }
      }


  };




/*  function getRecentPost() {
    $http
      .get("/api/GalleryPost")
      .then(
        function(allPosts){
          var datal = allPosts.data.length;
          $scope.gPosts = newGalleryPost(allPosts.data[datal-1]);
      },
        function(error){
          console.log("GET request error")
        }
    );
  });*/
//Gallery Page Functions ----------------------


  angular
    .module("GalleryPage", [])
    .controller("GalleryPageController", GPageCont);

  function GPageCont($scope, $http) {

  function init() {
      getAllPosts();
    }

  init();


    function getAllPosts() {
      $http
        .get("/api/GalleryPost")
        .then(
          function(allPosts){
            var data = allPosts.data;
            for(i=0;i<data.length;i++){
            $scope.gPosts = newGalleryPost(data[i]);
          }
        },
          function(error){
            console.log("GET request error")
          }
      );
    }
  }
