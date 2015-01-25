'use strict';
angular.module('sir-accordion', [])
.directive('sirNgAccordion',['$compile', function($compile){
  var template='';
  return{
    restrict: 'A', 
    scope: {
      collection: '=',
      config: '=?'
    },
    template: template,
    controller: function($scope){
      $scope.config.headerClass = $scope.config.headerClass || '';
      $scope.config.preHeader = $scope.config.preHeader || '<div class="sir-accordion-vertical-align"><div>';
      $scope.config.postHeader = $scope.config.postHeader || '</div></div>';
      $scope.config.topContentClass = $scope.config.topContentclass || '';
      $scope.config.preTopContent = $scope.config.preTopContent || '';
      $scope.config.postTopContent = $scope.config.postTopContent || '';
      $scope.config.bottomContentClass = $scope.config.bottomContentclass || '';
      $scope.config.preBottomContent = $scope.config.preBottomContent || '';
      $scope.config.postBottomContent = $scope.config.postBottomContent || '';
    },
    link: function(scope,element){      
      var header = '';
      var topContent = '';
      var bottomContent = '';
      var item = '';
      var parentId = 0;
      var uniqueIndex = '';
      var accordionHTML = '';
      var domObjectTree = [];
      var currentExpanded = '0';
      var activeHeaders = [];
      var consoleHighLight = 'background: #0044CE; color: #fff';

      scope.$watch('collection', function() {

        if (!angular.isArray(scope.collection)){
          element.html('No collection found');
          return;
        }

        header = '';
        topContent = '';
        bottomContent = '';
        item = '';
        parentId = 0;
        uniqueIndex = '';
        accordionHTML = '';
        domObjectTree = [];
        currentExpanded = '0';
        activeHeaders = [];
        accordionHTML = itemRegen(scope.collection, 0, 0, 0);
        $compile(accordionHTML)(scope, function(compiled, scope)   {
          element.html(compiled); 
        });
        setObjectTree();
      });

      var setObjectTree = function(){
        for (var i = domObjectTree.length - 1; i >= 0; i--) {
          domObjectTree[i] = document.getElementById('sac' + domObjectTree[i]);
          domObjectTree[i].visibleHeight = domObjectTree[i].clientHeight;
          /*console.log(domObjectTree[i].clientHeight);
          domObjectTree[i].style.height = '0px';*/
        };
      };

      var itemRegen = function(collection, parentIndex, currentIndex, level) {
        if (currentIndex == collection.length){
          return '';
        }

        uniqueIndex = level ? String(parentIndex) + '-' + String(currentIndex + 1) : String(currentIndex + 1);
        header = scope.config.preHeader + collection[currentIndex].title + scope.config.postHeader;
        topContent = setContent(scope.config.preTopContent, collection[currentIndex].topContent, scope.config.postTopContent);
        domObjectTree.push(uniqueIndex);

        if (currentIndex == 0){
          if (level == 0)
            item = '<div class="sir-accordion-wrapper"> <div class="sir-accordion-header ' + scope.config.headerClass + '" ng-click="expandCollapse($event,\'' + uniqueIndex + '\')" class="' + scope.config.headerClass + '">' + header + '</div>' + '<div id="sac' + uniqueIndex + '" class="sir-accordion-content ' + scope.config.topContentClass + '">' + topContent;  
          else 
            item = '<div class="sir-accordion-group"> <div class="sir-accordion-header ' + scope.config.headerClass + '" ng-click="expandCollapse($event,\'' + uniqueIndex + '\')" class="' + scope.config.headerClass + '">' + header + '</div>' + '<div id="sac' + uniqueIndex + '" class="sir-accordion-content ' + scope.config.topContentClass + '">' + topContent;  
        }
        else{
          item = '<div class="sir-accordion-header ' + scope.config.headerClass + '" ng-click="expandCollapse($event,\'' + uniqueIndex + '\')" class="' + scope.config.headerClass + '">' + header + '</div>' + '<div id="sac' + uniqueIndex + '" class="sir-accordion-content ' + scope.config.topContentClass + '">' + topContent;
        }

        if (angular.isArray(collection[currentIndex].subCollection)){
          item = item + itemRegen(collection[currentIndex].subCollection, uniqueIndex, 0, level + 1);
          bottomContent = setContent(scope.config.preBottomContent, collection[currentIndex].bottomContent, scope.config.postBottomContent);
          item = item + bottomContent + '</div></div>';
        }
        else{
          bottomContent = setContent(scope.config.preBottomContent, collection[currentIndex].bottomContent, scope.config.postBottomContent);
          item = item + bottomContent + '</div>';
        }

        return item + itemRegen(collection, parentIndex, currentIndex + 1, level);
      };

      var setContent = function(pre,content,post) {
        if (!content){
          content = '';
        }
        else{
          content = pre + content + post;
        }
        return content;
      };

      var chainCollapse = function(toCollapse,stopId) {
        if (scope.config.debug) console.log('Chain collapsing');
        do {
          for (var i = domObjectTree.length - 1; i >= 0; i--) {
            if (domObjectTree[i].id == ('sac' + toCollapse)){
              toggleClass(domObjectTree[i],'expanded');
            }  
          }
          toCollapse = getParentId(toCollapse);
          toggleClass(activeHeaders[activeHeaders.length-1],'active-header');
          activeHeaders.pop();
        }
        while (getLevel(toCollapse) != getLevel(stopId));
      };

      var getLevel = function(id) {
        if (id == '0') return 0;
        else return id.split('-').length;
      };

      var getParentId = function(string) {
        if(string.indexOf('-') == -1){
          return '0';
        }
        var lastChar = '';
        do {
          lastChar = string.substr(string.length -1);
          string = string.slice(0,-1);
        }
        while (lastChar != '-');
        return string;
      };

      var toggleClass = function (domObject,toggleClass){
        var classes = domObject.className;
        classes = classes.split(' ');
        if(classes.length == 1){
          if(classes[0] == toggleClass){
            if (scope.config.debug) console.log('removing class ' + domObject.id);
            domObject.className = ''; 
            return;  
          }
          if (scope.config.debug) console.log('adding class ' + domObject.id);
          domObject.className = domObject.className + ' ' + toggleClass; 
          return;
        }
        for (var i = classes.length - 1; i >= 0; i--) {
          if (classes[i] == toggleClass){
            domObject.className = domObject.className.replace(toggleClass,'');
            if (scope.config.debug) console.log('removing class ' + domObject.id);
            return;
          }
        };
        domObject.className = domObject.className.trim() + ' ' + toggleClass;
        if (scope.config.debug) console.log('adding class ' + domObject.id);
        return;
      };

      var isParent = function (parentId,childId){
        var result = false;
        do{
          if (getParentId(childId) == parentId)
            result = true;
          childId = getParentId(childId);
        }
        while(getLevel(childId) > getLevel(parentId));
        return result;
      }

      var setHeight = function(objeto){
         /*console.log(objeto.visibleHeight);
         objeto.style.height = objeto.visibleHeight + 'px';*/
      }

      scope.expandCollapse = function(event,id){
        if(scope.config.autoCollapse){
          var parentIndex = '-1'; 
          if (currentExpanded == '0'){
            for (var i = domObjectTree.length - 1; i >= 0; i--) {
              if (domObjectTree[i].id == ('sac' + id)) {
                toggleClass(domObjectTree[i],'expanded');
                setHeight(domObjectTree[i]);
                currentExpanded = id;
                break;
              };
            };
            parentId = 0;
            toggleClass(event.currentTarget, 'active-header');
            activeHeaders.push(event.currentTarget);
            if (scope.config.debug) console.log('%c Opening First',consoleHighLight);
            if (scope.config.debug) console.log('From 0 to ' + currentExpanded);
            return;
          }
          if (currentExpanded == id){
            for (var i = domObjectTree.length - 1; i >= 0; i--) {
              if (domObjectTree[i].id == ('sac' + id)) {
                toggleClass(domObjectTree[i],'expanded');
                if (getLevel(currentExpanded) > 1){
                  currentExpanded = getParentId(id);
                  activeHeaders.pop();
                  toggleClass(event.currentTarget,'active-header');
                  setHeight(domObjectTree[i]);
                }
                else{
                  currentExpanded = '0';
                  activeHeaders = [];
                  toggleClass(event.currentTarget,'active-header');
                  setHeight(domObjectTree[i]);
                } 
              };
            }
            if (scope.config.debug) console.log('%c Closing same',consoleHighLight);
            if (scope.config.debug) console.log('From current element to ' + currentExpanded);
            return;
          }
          if (currentExpanded != id){
            for (var i = domObjectTree.length - 1; i >= 0; i--) {
              if (domObjectTree[i].id == ('sac' + currentExpanded)) {
                if(getParentId(id) == currentExpanded) {
                  if (scope.config.debug) console.log('%c Opening Child',consoleHighLight);
                  currentExpanded = id;
                  activeHeaders.push(event.currentTarget);
                  toggleClass(event.currentTarget,'active-header');
                  break;  
                }
                else if(isParent(id,currentExpanded)){
                  if (scope.config.debug) console.log('%c Closing Parent',consoleHighLight);
                  chainCollapse(currentExpanded,id);
                  toggleClass(event.currentTarget,'active-header');
                  activeHeaders.pop();
                  currentExpanded = getParentId(id);
                  break;  
                }
                
                if(getParentId(currentExpanded) == getParentId(id)) {
                  if (scope.config.debug) console.log('%c Opening sibling',consoleHighLight);
                  toggleClass(domObjectTree[i],'expanded');
                  toggleClass(activeHeaders[activeHeaders.length-1], 'active-header');
                  activeHeaders.pop();
                  activeHeaders.push(event.currentTarget);
                  toggleClass(event.currentTarget, 'active-header');
                  currentExpanded = id;
                  break;
                }
                if (scope.config.debug) console.log('%c Opening other',consoleHighLight);
                chainCollapse(currentExpanded,getParentId(id));
                toggleClass(event.currentTarget,'active-header');
                activeHeaders.push(event.currentTarget);
                currentExpanded = id;
                break;
              }
            }
            for (var i = domObjectTree.length - 1; i >= 0; i--) {
              if (domObjectTree[i].id == ('sac' + id)){
                if(currentExpanded != id){ 
                  toggleClass(domObjectTree[i],'expanded');
                }
                else{
                  toggleClass(domObjectTree[i],'expanded');
                }
                if (getLevel(id) == 1){
                  parentId = getParentId(id);
                }
                else{
                  parentId = 0;
                }
              }
            }
            if (scope.config.debug) console.log('From diferent element to ' + currentExpanded);
            return;
          }
        }
        else{
          if (scope.config.debug) console.log('Auto collapse disabled');
          for (var i = domObjectTree.length - 1; i >= 0; i--) {
            if (domObjectTree[i].id == ('sac' + id)){
              toggleClass(domObjectTree[i],'expanded');
            }
          };
        }
      };
    }
  }
}]);
