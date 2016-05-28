const app: angular.IModule = angular.module('app', [
  'ui.router',
  'ngAnimate',
  'ngTouch',
  'ui.bootstrap'
]);

app.config(['$urlRouterProvider', '$stateProvider', ($urlRouterProvider: ng.ui.IUrlRouterProvider, $stateProvider: ng.ui.IStateProvider): void => {

  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      template: '<h3>Hey hey</h3'
    });

}]);

app.run(['$state', '$rootScope', ($state: ng.ui.IStateService, $rootScope: ng.IRootScopeService): void => {
  // some running code
}]);

angular.bootstrap(document, ['app']);
