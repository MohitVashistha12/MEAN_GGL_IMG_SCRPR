GGL_IMG_SCRPR.controller('IMGCtrl', function($rootScope, $scope, ImageSearch) {
  $scope.search = function($event) {
    if ($event.which == 13 && $scope.searchImage) {
      ImageSearch.getImages({
        "image": $scope.searchImage
      }).then(function(data) {
      });
      $scope.searchImage = '';
    }
  };
});

GGL_IMG_SCRPR.controller('historyCtrl', function($rootScope, $scope, ImageSearch) {
  $scope.ImageSearches = [];
  ImageSearch.checkImages().then(function(data) {
    $scope.ImageSearches = data.data;
  });
  $scope.getAllFiles = function($event, path, i) {
    console.log(path);
    ImageSearch.GetAllFiles({
      "dest": path
    }).then(function(data) {

    });
  };

});
