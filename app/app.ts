namespace fiv {
  angular.module(appModuleName)
         .config(['$urlRouterProvider', '$stateProvider', ($urlRouterProvider: ng.ui.IUrlRouterProvider, $stateProvider: ng.ui.IStateProvider): void => {

    $urlRouterProvider.otherwise('/');

    $stateProvider
      .state('home', {
        url: '/',
        template: `<fiv-home></fiv-home>`
      })
        .state('home.font', {
          url: 'font/:title/:version',
          template: `<fiv-icons></fiv-icons>`
        })
      .state('about', {
        url: '/about',
        templateUrl: `about/ui/about.html`
      })
      .state('contact', {
        url: '/contact',
        templateUrl: `contact/ui/contact.html`
      });
  }])
  .run(['$state', '$rootScope', ($state: ng.ui.IStateService, $rootScope: ng.IRootScopeService): void => {
    // some running code
  }]);

  // bootstrap the application
  angular.bootstrap(document, [appModuleName]);
}
