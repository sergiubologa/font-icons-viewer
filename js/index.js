(function($){
  
  var iconsUrl = 'http://cdn.coresystems.net/icons/coresystems-app-icons-1.0.0.css';
  
  $.when($.get(iconsUrl))
   .done(function(response) {
      addIconLibraryToHead(iconsUrl);
      var cssClasses = parseCssFile(response);
      displayIcons(cssClasses);      
   });
   
   var parseCssFile = function(cssString) {
     return cssString.match(/\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*\s*:/gm);
   }
   
   var addIconLibraryToHead = function(cssUrl) {
      var headHTML = document.getElementsByTagName('head')[0].innerHTML;
      headHTML    += '<link type="text/css" rel="stylesheet" href="' + cssUrl + '">';
      document.getElementsByTagName('head')[0].innerHTML = headHTML;
   }
   
   var displayIcons = function(iconsArray) {
     var html = '<div class="row">';
     iconsArray.forEach(function(icon) {
       var className = icon.substring(1, icon.length-1);
       html += '<div class="col-sm-2">'+
                  '<i class="icon ' + className + '"></i>'+
                  '<p>'+className+'</p>'+
               '</div>';
     }, this);
     html += "</div>";
     $('#icons-container').html(html);
   }
  
})(jQuery);