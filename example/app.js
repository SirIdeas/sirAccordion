'use strict';
var app = angular.module('sirAccordion', [
  'sir-accordion'
  ])

app.run([function() {
  if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
      FastClick.attach(document.body);
    }, false);
  }
}]);

app.controller('Principal',['$scope','$compile', function($scope,$compile){
  $scope.activeArray = 1;
  $scope.coord = '';

  var accordionConfig = {
    debug: false,
    animDur: 300,
    expandFirst: false,
    autoCollapse: true,
    watchInternalChanges: true,
    headerAttrs: 'accordion-scroller',
    headerClass: '',
    beforeHeader: '<div class="sir-accordion-vertical-align"><div>',
    afterHeader: '</div></div>',
    topContentClass: '',
    beforeTopContent: '',
    afterTopContent: '<p><button class="btn btn-secondary" ng-click="backToTop()"><strong>Back to top</strong></button></p>',
    bottomContentClass: '',
    beforeBottomContent: '',
    afterBottomContent: ''
  };

  $scope.backToTop = function(){
    var container = document.getElementById('scroller');
    Velocity(container,'scroll', {offset: -container.scrollTop, container: container, duration: 300 });
    //$scope.sirAccordion.collection[0].title = 'hola';
    //$scope.sirAccordion.collection.pop();
  };

  var accordionCollection = 
  [
    {
      "title": "Sir accordion",
      "topContent": "",
      "bottomContent": "",
      "subCollection": [
        {"title": "Introduction", "topContent": "<div ng-include=\"'accordionContent/top/1-1.html'\"></div>"},
        {"title": "The collection", "topContent": "<div ng-include=\"'accordionContent/top/1-2.html'\"></div>", "subCollection": [
          {"title": "Title", "topContent": "<p>The <code>title</code> attr sets the content of the header in each item.</p>"},
          {"title": "topContent", "topContent": "<div ng-include=\"'accordionContent/top/1-2-2.html'\"></div>"},
          {"title": "bottomContent", "topContent": "<div ng-include=\"'accordionContent/top/1-2-3.html'\"></div>"},
          {"title": "subCollection", "topContent": "<div ng-include=\"'accordionContent/top/1-2-4.html'\"></div>"},
        ]},
        {"title":"The subCollection","topContent":null,"bottomContent":"This is the bottom content attr :)","subCollection":[
        ]},
        {"title":"As many levels as you want","topContent":"<p>You can keep adding Levels</p>","bottomContent":null, "subCollection":[
          {"title":"Level 3","topContent":"<p>You can keep adding Levels</p>","bottomContent":null, "subCollection":[
            {"title":"Level 4","topContent":"<p>You can keep adding Levels</p>","bottomContent":null}
          ]}
        ]}
      ]
    },
    {"title":"Configuration object","topContent":null,"bottomContent":null,"subCollection":[
      {"title":"Level 2","topContent":"<p>You Can set a Content, a subCollection of items, or combine them; making an element expand to a collection of items with text on the top, bottom or both!.</p>\n<p>Check the next items for examples</p>","bottomContent":null},
      {"title":"Level 2","topContent":"This is a top content","bottomContent":"This text should be the content after the Items","subCollection":[
        {"title":"Level 3 item","topContent":"Awesome text"},
        {"title":"Level 3 item","topContent":"Awesome text"}
      ]},
      {"title":"Level 2","topContent":"<h3>sir-accordion is also perfect for responsive Design!</h3>\n<strong>The content uses VelocityJS, and you can resize the window and it will adapt pretty well</strong>\n<p>You can try it out by using the content provided or adding your own content and resizing your desktop window, it's awesome</p>","bottomContent":null}
    ]},
    {"title":"Events","topContent":"This one only goes to Level 1 and the content in it and this is the topContent","bottomContent":"this is the bottom content"},
    {"title":"Themes","topContent":"This is the topContent field on this element and it also has an array of items (subCollection array field in the JSON object)","bottomContent":null,"subCollection":[
      {"title":"Level 2","topContent":"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat. Duis aute irure dolor in reprehenderit in voluptate velit essecillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat nonproident, sunt in culpa qui officia deserunt mollit anim id est laborum.","bottomContent":null},
      {"title":"Level 2","topContent":"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat. Duis aute irure dolor in reprehenderit in voluptate velit essecillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat nonproident, sunt in culpa qui officia deserunt mollit anim id est laborum.","bottomContent":null},
      {"title":"Level 2","topContent":"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat. Duis aute irure dolor in reprehenderit in voluptate velit essecillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat nonproident, sunt in culpa qui officia deserunt mollit anim id est laborum.","bottomContent":null}
    ]},
    {"title":"Advanced","topContent":null,"bottomContent":null,"subCollection":[
      {"title":"Level 2","topContent":"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat. Duis aute irure dolor in reprehenderit in voluptate velit essecillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat nonproident, sunt in culpa qui officia deserunt mollit anim id est laborum.","bottomContent":null},
      {"title":"Level 2","topContent":"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat. Duis aute irure dolor in reprehenderit in voluptate velit essecillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat nonproident, sunt in culpa qui officia deserunt mollit anim id est laborum.","bottomContent":null},
      {"title":"Level 2","topContent":"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat. Duis aute irure dolor in reprehenderit in voluptate velit essecillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat nonproident, sunt in culpa qui officia deserunt mollit anim id est laborum.","bottomContent":null}
    ]},
    {"title":"Contributing","topContent":null,"bottomContent":null,"subCollection":[
      {"title":"Level 2","topContent":"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat. Duis aute irure dolor in reprehenderit in voluptate velit essecillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat nonproident, sunt in culpa qui officia deserunt mollit anim id est laborum.","bottomContent":null},
      {"title":"Level 2","topContent":"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat. Duis aute irure dolor in reprehenderit in voluptate velit essecillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat nonproident, sunt in culpa qui officia deserunt mollit anim id est laborum.","bottomContent":null},
      {"title":"Level 2","topContent":"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat. Duis aute irure dolor in reprehenderit in voluptate velit essecillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat nonproident, sunt in culpa qui officia deserunt mollit anim id est laborum.","bottomContent":null}
    ]}
  ];

  $scope.sirAccordion = {
    collection: accordionCollection,
    config: accordionConfig
  };

  $scope.toggleAutoCollapse = function(){
    $scope.$broadcast('sacCollapseAll');
    $scope.sirAccordion.config.autoCollapse = !$scope.sirAccordion.config.autoCollapse;
  };

  $scope.expandByCoord = function(coord){
    if(coord){
      $scope.$broadcast('sacExpandContentById', coord);
      return
    }
    $scope.$broadcast('sacExpandContentById', $scope.coord);
  }

  $scope.collapseByCoord = function(){
    $scope.$broadcast('sacCollapseContentById', $scope.coord);
  }

  $scope.expandAll = function(){
    $scope.$broadcast('sacExpandAll');
  };

  $scope.collapseAll = function(){
    $scope.$broadcast('sacCollapseAll');
  };

}])
.directive('accordionScroller', ['$timeout', function($timeout){
  return{
    restrict: 'A',
    link: function(scope, element, attrs){
      var container = document.getElementById('scroller');
      var scrollTimeout = null;
      element.on('click', function(){
        if(!element.next().hasClass('completeExpanded')){
          angular.element(container).on('scroll', function(){
            $timeout.cancel(scrollTimeout);
            angular.element(container).off();
          });
          scrollTimeout = $timeout(function() {
            Velocity(element,'scroll', {offset: -container.scrollTop, container: container, duration: 400});
          }, scope.sirAccordion.config.animDur);
          
        }
      });

      scope.$on('$destroy', function(){
        element.off();
      });
    }
  };
}]);