'use strict';
angular.module('sir-accordion', [])
.directive('sirNgAccordion',['$compile','$timeout', function($compile,$timeout){
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
      var uniqueIndex = '';
      var accordionHTML = '';
      var domObjectTree = [];
      var animating = [];
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
        uniqueIndex = '';
        accordionHTML = '';
        domObjectTree = [];
        currentExpanded = '0';
        animating = [];
        activeHeaders = [];
        accordionHTML = itemRegen(scope.collection, 0, 0, 0);

        $compile(accordionHTML)(scope, function(compiled, scope)   {
          element.html('');
          element.append(compiled);
        });
        setObjectTree();
      });

      var setObjectTree = function(){
        for (var i = domObjectTree.length - 1; i >= 0; i--) {
          domObjectTree[i] = document.getElementById('sac' + domObjectTree[i]);
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
            item = '<div class="sir-accordion-wrapper"> <div class="sir-accordion-header ' + scope.config.headerClass + '" ng-click="expandCollapse($event,\'' + uniqueIndex + '\')" class="' + scope.config.headerClass + '">' + header + '</div>' + '<div id="sac' + uniqueIndex + '" class="sir-accordion-content ' + scope.config.topContentClass + '"> <div>' + topContent;  
          else 
            item = '<div class="sir-accordion-group"> <div class="sir-accordion-header ' + scope.config.headerClass + '" ng-click="expandCollapse($event,\'' + uniqueIndex + '\')" class="' + scope.config.headerClass + '">' + header + '</div>' + '<div id="sac' + uniqueIndex + '" class="sir-accordion-content ' + scope.config.topContentClass + '"> <div>' + topContent;  
        }
        else{
          item = '<div class="sir-accordion-header ' + scope.config.headerClass + '" ng-click="expandCollapse($event,\'' + uniqueIndex + '\')" class="' + scope.config.headerClass + '">' + header + '</div>' + '<div id="sac' + uniqueIndex + '" class="sir-accordion-content ' + scope.config.topContentClass + '"> <div>' + topContent;
        }

        if (angular.isArray(collection[currentIndex].subCollection) && collection[currentIndex].subCollection.length){
          item = item + itemRegen(collection[currentIndex].subCollection, uniqueIndex, 0, level + 1);
          bottomContent = setContent(scope.config.preBottomContent, collection[currentIndex].bottomContent, scope.config.postBottomContent);
          item = item + bottomContent + '</div></div></div>';
        }
        else{
          bottomContent = setContent(scope.config.preBottomContent, collection[currentIndex].bottomContent, scope.config.postBottomContent);
          item = item + bottomContent + '<div class="sir-accordion-content-margin"></div></div></div>';
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
        if (domObject.className.indexOf(toggleClass) > -1){
          domObject.className = domObject.className.replace(toggleClass,'');
          if (scope.config.debug) console.log('removing class ' + domObject.id);
          if (toggleClass == "expanded"){
            setContentHeight(domObject,0);
          }
          return;
        }
        else{
          domObject.className = trim(domObject.className) + ' ' + toggleClass;
          if (scope.config.debug) console.log('adding class ' + domObject.id);
          if (toggleClass == "expanded"){
            var height = domObject.firstChild.offsetHeight || domObject.firstElementChild.offsetHeight;
            setContentHeight(domObject,height);
          }
          return;
        }
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
      };

      var trim = function (str) {
        var str = str.replace(/^\s\s*/, ''),
        ws = /\s/,
        i = str.length;
        while (ws.test(str.charAt(--i)));
        return str.slice(0, i + 1);
      };

      var isAnimating = function(id){
        for (var i = animating.length - 1; i >= 0; i--) {
          if (animating[i] == id){
            return true;
          }
        };
        return false;
      };

      var setContentHeight = function(domObject,height){
        animating.push(domObject.id);
        $timeout(function(){
          animating = [];
          if (domObject.style.height != '0px'){
            domObject.style.height = 'auto';  
          }
        }, 400);
        $timeout(function() {
          domObject.style.height = height + 'px';  
        }, 1);
      };

      var getDomObjectTreeIndex = function(id){
        for (var i = domObjectTree.length - 1; i >= 0; i--) {
          if (domObjectTree[i].id == ('sac' + id) || domObjectTree[i].id == (id))
            return i;
        }
        return -1;
      };

      var getCurrentTargetIE8 = function(sourceElement){
        while(sourceElement.className.indexOf('sir-accordion-header') == -1){
          sourceElement = sourceElement.parentElement;
        }
        return sourceElement;
      };

      var cleanAutoHeight = function(){
        for (var i = domObjectTree.length - 1; i >= 0; i--) {
          if (domObjectTree[i].style.height == 'auto'){
            var height = domObjectTree[i].firstChild.offsetHeight || domObjectTree[i].firstElementChild.offsetHeight;
            domObjectTree[i].style.height = height + 'px';
          }
        };
      };

      scope.expandCollapse = function(event,id){
        var headerElement = (event.currentTarget) ? event.currentTarget : getCurrentTargetIE8(event.srcElement);
        var idIndex = getDomObjectTreeIndex(id);
        var currentExpandedIndex = getDomObjectTreeIndex(currentExpanded);
        var domObject = domObjectTree[idIndex];
        var auxObject = domObject;
        var parent = domObjectTree[getDomObjectTreeIndex(getParentId(domObject.id))];
        var height = domObject.firstChild.offsetHeight || domObject.firstElementChild.offsetHeight;
        if (domObject.id && isAnimating(domObject.id))
          return;
        cleanAutoHeight();
        var parentIndex = '-1';
        if (currentExpanded == '0'){
          toggleClass(headerElement, 'active-header');
          toggleClass(domObjectTree[idIndex],'expanded');
          currentExpanded = id;
          activeHeaders.push(headerElement);
          if (scope.config.debug) console.log('%c Opening First',consoleHighLight);
          if (scope.config.debug) console.log('From 0 to ' + currentExpanded);
          return;
        }
        if (currentExpanded == id){
          toggleClass(domObjectTree[idIndex],'expanded');
          toggleClass(headerElement,'active-header');
          currentExpanded = getParentId(id) || '0';
          activeHeaders.pop();
          while (getLevel(auxObject.id) >= 2){
            setContentHeight(parent,parent.offsetHeight - height);
            auxObject = parent;
            parent = domObjectTree[getDomObjectTreeIndex(getParentId(auxObject.id))];
          }
          if (scope.config.debug) console.log('%c Closing same',consoleHighLight);
          if (scope.config.debug) console.log('From current element to ' + currentExpanded);
          return;
        }
        if (currentExpanded != id && !animating.length){
          var type = '';
          var currentExpandedHeight = domObjectTree[currentExpandedIndex].style.height;
          currentExpandedHeight = currentExpandedHeight.substr(0,currentExpandedHeight.length - 2);
          if(getParentId(id) == currentExpanded) {
            if (scope.config.debug) console.log('%c Opening Child',consoleHighLight);
            toggleClass(domObjectTree[idIndex],'expanded');
            toggleClass(headerElement,'active-header');
            activeHeaders.push(headerElement);
            currentExpanded = id;
            while (getLevel(auxObject.id) >= 2){
              setContentHeight(parent,parent.offsetHeight + height);
              auxObject = parent;
              parent = domObjectTree[getDomObjectTreeIndex(getParentId(auxObject.id))];
            }
            return;
          }
          else if(isParent(id,currentExpanded)){
            if (scope.config.debug) console.log('%c Closing Parent',consoleHighLight);
            chainCollapse(currentExpanded,id);
            toggleClass(domObjectTree[idIndex],'expanded');
            toggleClass(headerElement,'active-header');
            activeHeaders.pop();
            currentExpanded = getParentId(id);
            while (getLevel(auxObject.id) >= 2){
              setContentHeight(parent,parent.offsetHeight - height);
              auxObject = parent;
              parent = domObjectTree[getDomObjectTreeIndex(getParentId(auxObject.id))];
            }
            return;
          }
          else if(getParentId(currentExpanded) == getParentId(id)) {
            if (scope.config.debug) console.log('%c Opening sibling',consoleHighLight);
            toggleClass(domObjectTree[currentExpandedIndex],'expanded');
            toggleClass(activeHeaders[activeHeaders.length-1], 'active-header');
            activeHeaders.pop();
            activeHeaders.push(headerElement);
            toggleClass(headerElement, 'active-header');
            toggleClass(domObjectTree[idIndex],'expanded');
            currentExpanded = id;
            while (getLevel(auxObject.id) >= 2){
              setContentHeight(parent,parent.offsetHeight + height - currentExpandedHeight);
              auxObject = parent;
              parent = domObjectTree[getDomObjectTreeIndex(getParentId(auxObject.id))];
            }
            return;
          }
          else {
            if (scope.config.debug) console.log('%c Opening other',consoleHighLight);
            if (getLevel(id) >= 2){
              var prueba = getParentId(currentExpanded);
              prueba = getDomObjectTreeIndex(prueba);
              prueba = domObjectTree[prueba];
              while (getLevel(prueba.id) > getLevel(id)){
                prueba = domObjectTree[getDomObjectTreeIndex(getParentId(prueba.id))];
              }                
              prueba = height - prueba.offsetHeight;
              var auxParent = parent;
              while (auxParent && getLevel(auxParent.id) >= 1){
                setContentHeight(auxParent,auxParent.offsetHeight + prueba);  
                auxParent = domObjectTree[getDomObjectTreeIndex(getParentId(auxParent.id))];                  
              }
            }
            chainCollapse(currentExpanded,getParentId(id));
            toggleClass(headerElement,'active-header');
            activeHeaders.push(headerElement);
            currentExpanded = id;
            toggleClass(domObjectTree[idIndex],'expanded');
            return;
          }
          return false;
        }
      };
    }
  }
}]);
