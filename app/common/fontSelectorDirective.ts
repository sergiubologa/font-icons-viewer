namespace fiv.common {

  class FontSelectorController {
    public static $inject: string[] = [];
  }

  angular.module(appModuleName).directive('fivSelectorHeader', (): ng.IDirective => {
    return {
      restrict: 'E',
      templateUrl: 'common/ui/fontSelectorHeader.html',
      controller: FontSelectorController,
      controllerAs: 'fontSelectorCtrl'
    };
  });
}
