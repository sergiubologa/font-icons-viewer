namespace fiv.home {
  class HomeController {
    public static $inject: string[] = ['$state'];

    constructor(private $state: ng.ui.IStateService) { }
  }

  angular.module(fiv.appModuleName).directive('fivHome', (): ng.IDirective => {
    return {
      restrict: 'E',
      templateUrl: 'home/ui/home.html',
      controller: HomeController,
      controllerAs: 'homeCtrl'
    };
  });
}
