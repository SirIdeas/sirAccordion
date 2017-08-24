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

app.controller('Principal',['$scope','$compile',function($scope,$compile){
  $scope.activeArray = 1;
  $scope.coord = '';

  var accordionConfig = {
    debug: false,
    animDur: 300,
    expandFirst: false,
    autoCollapse: true,
    watchInternalChanges: false,
    headerClass: '',
    beforeHeader: '',
    afterHeader: '<div class="drop-icon-wrapper sir-accordion-vertical-align"><i class="glyphicon glyphicon-chevron-down"></i></div>',
    topContentClass: '',
    beforeTopContent: '',
    afterTopContent: '<div><p><small>I repeat through all accordion</small></p></div>',
    bottomContentClass: '',
    beforeBottomContent: '',
    afterBottomContent: ''
  };

  var accordionCollection = 
  [
    {"title":"Level 1","topContent":"This is the top content attr","bottomContent":null,"subCollection":[
      {"title":"This is a Level 2 Header!","topContent":"This is some nice text right here","bottomContent":null},
      {"title":"Level 2","topContent":"<pre>And you can ad Html code directly to the content too</pre>","bottomContent":null},
      {"title":"This Level 2 Header has another subCollection","topContent":null,"bottomContent":"<p>You can choose to put text after the subcollection if you prefer (or both before and after)</p>","subCollection":[
        {"title":"And You got to the Level 3","topContent":"<span>Awesome text or HTML Content Here</span>"},
        {"title":"Level 3","topContent":"You can also add AngularJS expressions","subCollection":[
          {"title":"And another Level, Level 4","topContent":"<p>Awesome text or HTML Content Here</p>"},
          {"title":"Level 4","topContent":"<p>Adding HTML</p><div style=\"display:inline-block;width:30%;height:100px;background:blue;margin:5px;padding:5px;\"></div><div style=\"display:inline-block;width:30%;height:100px;background:red;margin:5px;padding:5px;\"></div>"}
        ]},
        {"title":"Level 3","topContent":"<p>Awesome text or HTML Content Here</p>"}
      ]},
      {"title":"Level 2","topContent":"<p>You can keep adding Levels</p>","bottomContent":null, "subCollection":[
        {"title":"Level 3","topContent":"<p>You can keep adding Levels</p>","bottomContent":null, "subCollection":[
          {"title":"Level 4","topContent":"<p>You can keep adding Levels</p>","bottomContent":null}
        ]}
      ]}
    ]},
    {"title":"Level 1","topContent":null,"bottomContent":null,"subCollection":[
      {"title":"Level 2","topContent":"<p>You Can set a Content, a subCollection of items, or combine them; making an element expand to a collection of items with text on the top, bottom or both!.</p>\n<p>Check the next items for examples</p>","bottomContent":null},
      {"title":"Level 2","topContent":"This is a top content","bottomContent":"This text should be the content after the Items","subCollection":[
        {"title":"Level 3 item","topContent":"Awesome text"},
        {"title":"Level 3 item","topContent":"Awesome text"}
      ]},
      {"title":"Level 2","topContent":"<h3>sir-accordion is also perfect for responsive Design!</h3>\n<strong>The content uses VelocityJS, and you can resize the window and it will adapt pretty well</strong>\n<p>You can try it out by using the content provided or adding your own content and resizing your desktop window, it's awesome</p>","bottomContent":null}
    ]},
    {"title":"Level 1","topContent":"This one only goes to Level 1 and the content in it and this is the topContent","bottomContent":"this is the bottom content"},
    {"title":"Level 1","topContent":"This is the topContent field on this element and it also has an array of items (subCollection array field in the JSON object)","bottomContent":null,"subCollection":[
      {"title":"Level 2","topContent":"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat. Duis aute irure dolor in reprehenderit in voluptate velit essecillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat nonproident, sunt in culpa qui officia deserunt mollit anim id est laborum.","bottomContent":null},
      {"title":"Level 2","topContent":"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat. Duis aute irure dolor in reprehenderit in voluptate velit essecillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat nonproident, sunt in culpa qui officia deserunt mollit anim id est laborum.","bottomContent":null},
      {"title":"Level 2","topContent":"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat. Duis aute irure dolor in reprehenderit in voluptate velit essecillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat nonproident, sunt in culpa qui officia deserunt mollit anim id est laborum.","bottomContent":null}
    ]},
    {"title":"Level 1","topContent":null,"bottomContent":null,"subCollection":[
      {"title":"Level 2","topContent":"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat. Duis aute irure dolor in reprehenderit in voluptate velit essecillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat nonproident, sunt in culpa qui officia deserunt mollit anim id est laborum.","bottomContent":null},
      {"title":"Level 2","topContent":"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat. Duis aute irure dolor in reprehenderit in voluptate velit essecillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat nonproident, sunt in culpa qui officia deserunt mollit anim id est laborum.","bottomContent":null},
      {"title":"Level 2","topContent":"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat. Duis aute irure dolor in reprehenderit in voluptate velit essecillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat nonproident, sunt in culpa qui officia deserunt mollit anim id est laborum.","bottomContent":null}
    ]},
    {"title":"Level 1","topContent":null,"bottomContent":null,"subCollection":[
      {"title":"Level 2","topContent":"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat. Duis aute irure dolor in reprehenderit in voluptate velit essecillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat nonproident, sunt in culpa qui officia deserunt mollit anim id est laborum.","bottomContent":null},
      {"title":"Level 2","topContent":"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat. Duis aute irure dolor in reprehenderit in voluptate velit essecillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat nonproident, sunt in culpa qui officia deserunt mollit anim id est laborum.","bottomContent":null},
      {"title":"Level 2","topContent":"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat. Duis aute irure dolor in reprehenderit in voluptate velit essecillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat nonproident, sunt in culpa qui officia deserunt mollit anim id est laborum.","bottomContent":null}
    ]},
    {"title":"Level 1","topContent":null,"bottomContent":null,"subCollection":[
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

  $scope.expandByCoord = function(){
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

}]);