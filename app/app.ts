namespace fiv {
  angular.module(appModuleName)
         .config(['$urlRouterProvider', '$stateProvider', ($urlRouterProvider: ng.ui.IUrlRouterProvider, $stateProvider: ng.ui.IStateProvider): void => {

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        template: `he he`
      });

  }])
  .run(['$state', '$rootScope', ($state: ng.ui.IStateService, $rootScope: ng.IRootScopeService): void => {
    // some running code
  }]);

  // bootstrap the application
  angular.bootstrap(document, [appModuleName]);
}
