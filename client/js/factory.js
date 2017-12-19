GGL_IMG_SCRPR.factory('ImageSearch', function($http) {
  var urlBaseSearch = '/api/search';
  var urlBaseFiles = '/api/getFiles';
  var _ImageService = {};
  _ImageService.getImages = function(data) {
    return $http.post(urlBaseSearch,data);
  };
  _ImageService.checkImages = function() {
    return $http.get(urlBaseSearch);
  };
  _ImageService.GetAllFiles = function(data) {
    return $http.put(urlBaseFiles,data);
  };
  return _ImageService;
});
