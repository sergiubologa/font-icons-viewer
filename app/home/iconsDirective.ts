namespace fiv.home {
  class IconsController {
    public static $inject: string[] = ['$stateParams'];

    constructor(private $stateParams: ng.ui.IStateParamsService) {
      // 
    }
  }

  angular.module(fiv.appModuleName).directive('fivIcons', (): ng.IDirective => {
    return {
      restrict: 'E',
      templateUrl: 'home/ui/icons.html',
      controller: IconsController,
      controllerAs: 'iconsCtrl'
    };
  });
}
