System.import('angular@1.4.8').then(function(angular) {
    console.log('loaded');
    angular.module('bulkken', [])
        .controller('bulkController', function($scope, $http) {
            $http.get('/data').then(function(success) {
                console.log(success);
            }, function(fail) {
                console.log(fail);
            });
        });
});
