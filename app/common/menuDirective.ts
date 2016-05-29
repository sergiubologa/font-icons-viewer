namespace fiv.common {
  class MenuController {
    public static $inject: string[] = [];
    private isMenuOnSmallScreensCollapsed: boolean = true;

    public toggleMenuOnSmallScreens = (): void  => {
      this.isMenuOnSmallScreensCollapsed = !this.isMenuOnSmallScreensCollapsed;
    };
  }

  angular.module(fiv.appModuleName).directive('fivMenu', (): ng.IDirective => {
    return {
      restrict: 'E',
      templateUrl: 'common/ui/menu.html',
      controller: MenuController,
      controllerAs: 'menuCtrl'
    };
  });
}
