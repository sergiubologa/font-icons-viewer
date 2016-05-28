var app = angular.module('app', [
    'ui.router',
    'ngAnimate',
    'ngTouch',
    'ui.bootstrap'
]);
app.config(['$urlRouterProvider', '$stateProvider', function ($urlRouterProvider, $stateProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('home', {
            url: '/',
            template: '<h3>Hey hey</h3'
        });
    }]);
app.run(['$state', '$rootScope', function ($state, $rootScope) {
        // some running code
    }]);
angular.bootstrap(document, ['app']);
