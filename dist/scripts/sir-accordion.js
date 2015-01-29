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
        uniqueIndex = '';
        accordionHTML = '';
        domObjectTree = [];
        currentExpanded = '0';
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

      var chainSetHeight = function(auxObject,parent,height){
        while (getLevel(auxObject.id) >= 2){
          setContentHeight(parent,height);
          auxObject = parent;
          parent = domObjectTree[getDomObjectTreeIndex(getParentId(auxObject.id))];
        }
      };

      var toggleClass = function (domObject,toggleClass){
        var classes = domObject.className;
        classes = classes.split(' ');
        for (var i = classes.length - 1; i >= 0; i--) {
          if (classes[i] == toggleClass){
            domObject.className = domObject.className.replace(toggleClass,'');
            if (scope.config.debug) console.log('removing class ' + domObject.id);
            if (toggleClass == "expanded"){
              var height = domObject.firstElementChild.offsetHeight || domObject.firstChild.offsetHeight;
              setContentHeight(domObject,0);
              var auxObject = domObject;
              var parent = domObjectTree[getDomObjectTreeIndex(getParentId(auxObject.id))];
            }
            return;
          }
        };
        domObject.className = domObject.className.trim() + ' ' + toggleClass;
        if (scope.config.debug) console.log('adding class ' + domObject.id);
        if (toggleClass == "expanded"){
          var height = domObject.firstElementChild.offsetHeight || domObject.firstChild.offsetHeight;
          setContentHeight(domObject,height);
          var auxObject = domObject;
          var parent = domObjectTree[getDomObjectTreeIndex(getParentId(auxObject.id))];
        }
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
      };

      var setContentHeight = function(domObject,height){
        //console.log(domObject.id);
        //console.log(height);
        //domObject.setAttribute('style','height:' + height + 'px');
        domObject.style.height= height + 'px';
      };

      var getDomObjectTreeIndex = function(id){
        for (var i = domObjectTree.length - 1; i >= 0; i--) {
          if (domObjectTree[i].id == ('sac' + id) || domObjectTree[i].id == (id))
            return i;
        }
        return -1;
      };

      scope.expandCollapse = function(event,id){
        var idIndex = getDomObjectTreeIndex(id);
        var currentExpandedIndex = getDomObjectTreeIndex(currentExpanded);
        var domObject = domObjectTree[idIndex];
        var height = domObject.firstElementChild.offsetHeight || domObject.firstChild.offsetHeight;
        var auxObject = domObject;
        var parent = domObjectTree[getDomObjectTreeIndex(getParentId(auxObject.id))];
        if(scope.config.autoCollapse){
          var parentIndex = '-1'; 
          if (currentExpanded == '0'){
            toggleClass(domObjectTree[idIndex],'expanded');
            currentExpanded = id;
            toggleClass(event.currentTarget, 'active-header');
            activeHeaders.push(event.currentTarget);
            if (scope.config.debug) console.log('%c Opening First',consoleHighLight);
            if (scope.config.debug) console.log('From 0 to ' + currentExpanded);
            return;
          }
          if (currentExpanded == id){
            toggleClass(domObjectTree[idIndex],'expanded');
            if (getLevel(currentExpanded) > 1){
              currentExpanded = getParentId(id);
              activeHeaders.pop();
              toggleClass(event.currentTarget,'active-header');
            }
            else{
              currentExpanded = '0';
              activeHeaders = [];
              toggleClass(event.currentTarget,'active-header');
            }
            while (getLevel(auxObject.id) >= 2){
              setContentHeight(parent,parent.offsetHeight - height);
              auxObject = parent;
              parent = domObjectTree[getDomObjectTreeIndex(getParentId(auxObject.id))];
            }
            if (scope.config.debug) console.log('%c Closing same',consoleHighLight);
            if (scope.config.debug) console.log('From current element to ' + currentExpanded);
            return;
          }
          if (currentExpanded != id){
            var type = '';
            var currentExpandedHeight = domObjectTree[currentExpandedIndex].style.height;
            currentExpandedHeight = currentExpandedHeight.substr(0,currentExpandedHeight.length - 2);
            if(getParentId(id) == currentExpanded) {
              if (scope.config.debug) console.log('%c Opening Child',consoleHighLight);
              activeHeaders.push(event.currentTarget);
              toggleClass(event.currentTarget,'active-header');
              currentExpanded = id;
              type = 'child';
            }
            else if(isParent(id,currentExpanded)){
              if (scope.config.debug) console.log('%c Closing Parent',consoleHighLight);
              chainCollapse(currentExpanded,id);
              toggleClass(event.currentTarget,'active-header');
              activeHeaders.pop();
              currentExpanded = getParentId(id);
              type = 'closing parent';
            }
            else if(getParentId(currentExpanded) == getParentId(id)) {
              if (scope.config.debug) console.log('%c Opening sibling',consoleHighLight);
              toggleClass(domObjectTree[currentExpandedIndex],'expanded');
              toggleClass(activeHeaders[activeHeaders.length-1], 'active-header');
              activeHeaders.pop();
              activeHeaders.push(event.currentTarget);
              toggleClass(event.currentTarget, 'active-header');
              currentExpanded = id;
              type = 'sibling';
            }
            else{
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
              toggleClass(event.currentTarget,'active-header');
              activeHeaders.push(event.currentTarget);
              currentExpanded = id;
            }
            toggleClass(domObjectTree[idIndex],'expanded');            
            if (type == "closing parent"){
              while (getLevel(auxObject.id) >= 2){
                setContentHeight(parent,parent.offsetHeight - height);
                auxObject = parent;
                parent = domObjectTree[getDomObjectTreeIndex(getParentId(auxObject.id))];
              }
            }
            if (type == "sibling"){
              while (getLevel(auxObject.id) >= 2){
                setContentHeight(parent,parent.offsetHeight + height - currentExpandedHeight);
                auxObject = parent;
                parent = domObjectTree[getDomObjectTreeIndex(getParentId(auxObject.id))];
              }
            }
            if (type == "child"){
              while (getLevel(auxObject.id) >= 2){
                setContentHeight(parent,parent.offsetHeight + height);
                auxObject = parent;
                parent = domObjectTree[getDomObjectTreeIndex(getParentId(auxObject.id))];
              }
            }
            if (scope.config.debug) console.log('From diferent element to ' + currentExpanded);
            return;
          }
        }
        else{
          if (scope.config.debug) console.log('Auto collapse disabled');
          toggleClass(domObjectTree[idIndex],'expanded');
        }
      };
    }
  }
}]);
