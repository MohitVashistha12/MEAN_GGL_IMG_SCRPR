GGL_IMG_SCRPR = angular.module('GGL_IMG_SCRPR', ['ngRoute'])
  .config(function($routeProvider,$locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
      .when('/', {
        templateUrl: '/partials/IMG.html',
        controller: 'IMGCtrl'
      }).when('/showHistory', {
        templateUrl: '/partials/history.html',
        controller: 'historyCtrl'
      }).otherwise({
        redirectTo: '/'
      });
  });
