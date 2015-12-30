require("angular");

console.log('loaded');

angular.module('bulkken', [])
    .controller('bulkController', function($scope, $http) {

        let user;

        $http.get('/user').then(function(success) {
            user = success.data
            $http.get('https://api.fitbit.com/1/user/-/profile.json', {
                headers: {
                    Authorization: 'Bearer ' + user.token
                }
            }).then(function(success) {
                $scope.data = success.data;
            });
        });
    });
