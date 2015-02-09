'use strict';
angular.module('sir-accordion', [])
.directive('sirNgAccordion',['$compile','$timeout', function($compile,$timeout){
  var template='';
  return {
    restrict: 'A',
    scope: {
      collection: '=',
      config: '=?'
    },
    template: template,
    controller: ('sirNgAccordionCtrl',['$scope',function ($scope) {
      $scope.config = {
        debug: typeof $scope.config.debug != 'undefined' ? $scope.config.debug : false,
        animDur : ($scope.config.animDur >= 200 && document.body.firstElementChild) ? $scope.config.animDur : 0,
        expandFirst: typeof $scope.config.expandFirst != 'undefined' ? $scope.config.expandFirst : false,
        autoCollapse : typeof $scope.config.autoCollapse != 'undefined' ? $scope.config.autoCollapse : true,
        headerClass: $scope.config.headerClass || '',
        preHeader: $scope.config.preHeader || '<div class="sir-accordion-vertical-align"><div>',
        postHeader: $scope.config.postHeader || '</div></div>',
        topContentClass: $scope.config.topContentClass || '',
        preTopContent: $scope.config.preTopContent || '',
        postTopContent: $scope.config.postTopContent || '',
        bottomContentClass: $scope.config.bottomContentClass || '',
        preBottomContent: $scope.config.preBottomContent || '',
        postBottomContent: $scope.config.postBottomContent || ''
      };
    }]),
    link: function(scope,element) {
      var animDur = scope.config.animDur;
      var header = '';
      var topContent = '';
      var bottomContent = '';
      var item = '';
      var uniqueIndex = '';
      var accordionHTML = '';
      var domHeaders = [];
      var domContents = [];
      var animating = [];
      var currentExpanded = '0';      
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
        domHeaders = [];
        domContents = [];
        animating = [];
        currentExpanded = '0';
        accordionHTML = itemRegen(scope.collection, 0, 0, 0);
        
        $compile(accordionHTML)(scope, function(compiled, scope)   {
          element.html('');
          element.append(compiled);
        });
        setObjectTree();
      });
      
      var setObjectTree = function(){
        var element = null;
        var header = null;
        var content = null;
        for (var i = domContents.length - 1; i >= 0; i--) {
          element = document.getElementById('sac' + domContents[i]);
          header = (element.firstElementChild) ? element.firstElementChild : element.firstChild;
          content = header.nextSibling;
          domContents[i] = {id: element.id, obj: content};
          domHeaders[i] = {id: element.id, obj: header};
          if (element.firstElementChild){
            domContents[i].obj.firstElementChild.style.transition = 'all ' + (animDur - 100) + 'ms';
            domHeaders[i].obj.style.transition = 'all ' + (animDur) + 'ms';
          }
        };
      };
      
      var itemRegen = function(collection, parentIndex, currentIndex, level) {
        if (currentIndex == collection.length){
          return '';
        }
        
        uniqueIndex = level ? String(parentIndex) + '-' + String(currentIndex + 1) : String(currentIndex + 1);
        header = scope.config.preHeader + collection[currentIndex].title + scope.config.postHeader;
        topContent = setContent(scope.config.preTopContent, collection[currentIndex].topContent, scope.config.postTopContent);
        domContents.push(uniqueIndex);
        
        if (currentIndex == 0){
          if (level == 0){
            item = '<div class="sir-accordion-wrapper"> <div id="sac' + uniqueIndex + '" > <div class="sir-accordion-header ' + scope.config.headerClass + '" ng-click= "expandCollapse(\'' + uniqueIndex + '\')" class="' + scope.config.headerClass + '">' + header + '</div>' + '<div class="sir-accordion-content"> <div><div class="' + scope.config.topContentClass + '">' + topContent + '</div>';
          }
          else{
            item = '<div class="sir-accordion-group"> <div id="sac' + uniqueIndex + '" > <div class="sir-accordion-header ' + scope.config.headerClass + '" ng-click="expandCollapse(\''+ uniqueIndex + '\')" class="' + scope.config.headerClass + '">' + header + '</div>' + '<div class="sir-accordion-content"> <div><div class="' + scope.config.topContentClass + '">' + topContent + '</div>';
          }
        }
        else{
          item = '<div id="sac' + uniqueIndex + '" > <div class="sir-accordion-header ' + scope.config.headerClass + '" ng-click="expandCollapse(\'' + uniqueIndex + '\')" class="' + scope.config.headerClass + '">' + header + '</div>' + '<div class="sir-accordion-content"> <div><div class="' + scope.config.topContentClass + '">' + topContent + '</div>';
        }
        
        if (angular.isArray(collection[currentIndex].subCollection) && collection[currentIndex].subCollection.length){
          item = item + itemRegen(collection[currentIndex].subCollection, uniqueIndex, 0, level + 1);
          bottomContent = setContent(scope.config.preBottomContent, collection[currentIndex].bottomContent, scope.config.postBottomContent);
          item = item + '</div><div class="' + scope.config.bottomContentClass + '">' + bottomContent + '</div></div></div></div>';
        }
        else{
          bottomContent = setContent(scope.config.preBottomContent, collection[currentIndex].bottomContent, scope.config.postBottomContent);
          item = item + '</div><div class="' + scope.config.bottomContentClass + '">' + bottomContent + '</div></div></div>';
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
          for (var i = domContents.length - 1; i >= 0; i--) {
            if (scope.config.autoCollapse && domContents[i].id == ('sac' + toCollapse)){
              toggleClass(domContents[i],'expanded');
              toggleClass(domHeaders[i],'active-header');
            }
            else if(getParentId(domContents[i].id) == getParentId(toCollapse) && domContents[i].obj.className.indexOf('expanded') > -1){
              toggleClass(domContents[i],'expanded');
              toggleClass(domHeaders[i],'active-header');
            }
          }
          toCollapse = getParentId(toCollapse);
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
        string = string.replace('sac','');
        return string;
      };
      
      var toggleClass = function (domObject,toggleClass){
        if (domObject.obj.className.indexOf(toggleClass) > -1){
          domObject.obj.className = domObject.obj.className.replace(toggleClass,'');
          if (scope.config.debug) console.log('removing class ' + domObject.id);
          if (toggleClass == "expanded"){
            setContentHeight(domObject,0);
          }
          return false;
        }
        else{
          domObject.obj.className = trim(domObject.obj.className) + ' ' + toggleClass;
          if (scope.config.debug) console.log('adding class ' + domObject.id);
          if (toggleClass == "expanded"){
            var height = domObject.obj.firstChild.offsetHeight || domObject.obj.firstElementChild.offsetHeight;
            setContentHeight(domObject,height);
          }
          return true;
        }
      };
      
      var isParent = function (parentId,childId){
        do{
          if (getParentId(childId) == parentId)
          return true;
          childId = getParentId(childId);
        }
        while(getLevel(childId) > getLevel(parentId));
        return false;
      };
      
      var trim = function (str) {
        var str = str.replace(/^\s\s*/, ''),
        ws = /\s/,
        i = str.length;
        while (ws.test(str.charAt(--i)));
        return str.slice(0, i + 1);
      };
      
      var isAnimating = function(id){
        if (animating.length)
          return true;
        return false;
        for (var i = animating.length - 1; i >= 0; i--) {
          if (animating[i] == id){
            return true;
          }
        };
        return false;
      };
      
      var getContentStyleHeight = function(domObject){
        return domObject.style.height.substr(0,domObject.style.height.length - 2);
      };
      
      var setContentHeight = function(domContent,height){
        animating.push(domContent.id);
        $timeout(function(){
          animating = [];
          domContent.obj.style.transition = 'height 0s';
          if (domContent.obj.style.height != '0px'){
            domContent.obj.style.height = 'auto';
          }
          if (!scope.config.autoCollapse){
            setAutoHeight();  
          }
        }, animDur);
        domContent.obj.style.transition = 'height ' + animDur + 'ms';
        
        $timeout(function() {
          domContent.obj.style.height = height + 'px';
        }, 40);
      };
      
      var getDomContentsIndex = function(id){
        for (var i = domContents.length - 1; i >= 0; i--) {
          if (domContents[i].id == ('sac' + id) || domContents[i].id == (id))
          return i;
        }
        return -1;
      };
      
      var cleanAutoHeight = function(){
        for (var i = domContents.length - 1; i >= 0; i--) {
          if (domContents[i].obj.style.height == 'auto'){
            var height = domContents[i].obj.firstChild.offsetHeight || domContents[i].obj.firstElementChild.offsetHeight;
            
            domContents[i].obj.style.height = height + 'px';
            
          }
        };
      };

      var setAutoHeight = function(){
        for (var i = domContents.length - 1; i >= 0; i--) {
          if (domContents[i].obj.style.height != '0px' && domContents[i].obj.style.height){
            var height = domContents[i].obj.firstChild.offsetHeight || domContents[i].obj.firstElementChild.offsetHeight;
            
            domContents[i].obj.style.height = 'auto';
            
          }
        };
      };

      var closeOpenChilds = function(domContents, id){
        for (var i = domContents.length - 1; i >= 0; i--) {
          if (isParent(id,domContents[i].id) && domContents[i].obj.className.indexOf('expanded') > -1){
            toggleClass(domContents[i],'expanded');
            toggleClass(domHeaders[i],'active-header');
          }
        };
      };
      
      scope.expandCollapse = function(id){
        var idIndex = getDomContentsIndex(id);
        var currentExpandedIndex = getDomContentsIndex(currentExpanded);
        var domContent = domContents[idIndex];
        var domHeader = domHeaders[idIndex];
        var height = domContent.obj.firstChild.offsetHeight || domContent.obj.firstElementChild.offsetHeight;
        if (domContent.id && isAnimating(domContent.id))
        return;
        cleanAutoHeight();
        if (scope.config.autoCollapse){
          if (currentExpanded == '0'){
            toggleClass(domHeader, 'active-header');
            toggleClass(domContent,'expanded');
            currentExpanded = id;
            if (scope.config.debug) console.log('%c Opening First',consoleHighLight);
            if (scope.config.debug) console.log('From 0 to ' + currentExpanded);
            return;
          }
          if (currentExpanded == id){
            toggleClass(domContent,'expanded');
            toggleClass(domHeader,'active-header');
            currentExpanded = getParentId(id) || '0';
            while (getLevel(domContent.id) >= 2){
              domContent = domContents[getDomContentsIndex(getParentId(domContent.id))];
              setContentHeight(domContent,domContent.obj.offsetHeight - height);
            }
            if (scope.config.debug) console.log('%c Closing same',consoleHighLight);
            if (scope.config.debug) console.log('From current element to ' + currentExpanded);
            return;
          }
          if (currentExpanded != id && !animating.length){
            if(getParentId(id) == currentExpanded) {
              if (scope.config.debug) console.log('%c Opening Child',consoleHighLight);
              toggleClass(domContent,'expanded');
              toggleClass(domHeader,'active-header');
              currentExpanded = id;
              while (getLevel(domContent.id) >= 2){
                domContent = domContents[getDomContentsIndex(getParentId(domContent.id))];
                setContentHeight(domContent,domContent.obj.offsetHeight + height);
              }
              return;
            }
            else if(isParent(id,currentExpanded)){
              if (scope.config.debug) console.log('%c Closing Parent',consoleHighLight);
              chainCollapse(currentExpanded,id);
              toggleClass(domContent,'expanded');
              toggleClass(domHeader,'active-header');
              currentExpanded = getParentId(id);
              while (getLevel(domContent.id) >= 2){
                domContent = domContents[getDomContentsIndex(getParentId(domContent.id))];
                setContentHeight(domContent,domContent.obj.offsetHeight - height);
              }
              return;
            }
            else if(getParentId(currentExpanded) == getParentId(id)) {
              if (scope.config.debug) console.log('%c Opening sibling',consoleHighLight);
              var currentExpandedHeight = getContentStyleHeight(domContents[currentExpandedIndex].obj);
              toggleClass(domContents[currentExpandedIndex],'expanded');
              toggleClass(domHeaders[currentExpandedIndex], 'active-header');
              toggleClass(domHeader, 'active-header');
              toggleClass(domContent,'expanded');
              currentExpanded = id;
              while (getLevel(domContent.id) >= 2){
                domContent = domContents[getDomContentsIndex(getParentId(domContent.id))];
                setContentHeight(domContent,domContent.obj.offsetHeight + height - currentExpandedHeight);
              }
              return;
            }
            else {
              if (scope.config.debug) console.log('%c Opening other',consoleHighLight);
              if (getLevel(id) >= 2){
                var auxCurrentExpanded = domContents[getDomContentsIndex(getParentId(currentExpanded))];
                var auxDomContent = domContents[getDomContentsIndex(getParentId(domContent.id))];
                while (getLevel(auxCurrentExpanded.id) > getLevel(id)){
                  auxCurrentExpanded = domContents[getDomContentsIndex(getParentId(auxCurrentExpanded.id))];
                }
                while (auxDomContent && getLevel(auxDomContent.id) >= 1){
                  setContentHeight(auxDomContent,auxDomContent.obj.offsetHeight + height - auxCurrentExpanded.obj.offsetHeight);
                  auxDomContent = domContents[getDomContentsIndex(getParentId(auxDomContent.id))];
                }
              }
              chainCollapse(currentExpanded,getParentId(id));
              toggleClass(domHeader,'active-header');
              currentExpanded = id;
              toggleClass(domContent,'expanded');
              return;
            }
            return false;
          }
        }
        else{
          if(domContent.obj.className.indexOf('expanded') > -1){
            closeOpenChilds(domContents,id);
          }
          var expanded = toggleClass(domContent,'expanded');
          toggleClass(domHeader, 'active-header');
          while (getLevel(domContent.id) >= 2){
            domContent = domContents[getDomContentsIndex(getParentId(domContent.id))];
            if (expanded){
              setContentHeight(domContent,domContent.obj.offsetHeight + height);
            }
            else{
              setContentHeight(domContent,domContent.obj.offsetHeight - height);
            }
          }
          currentExpanded = id;
          return;
        }
      };

      scope.$on('collapseAll', function (event) {
        cleanAutoHeight();
        if (!scope.config.autoCollapse){
          for (var i = domContents.length - 1; i >= 0; i--) {
            if (domContents[i].obj.className.indexOf('expanded') > -1){
              toggleClass(domHeaders[i], 'active-header');
              toggleClass(domContents[i],'expanded');
            }
          };
        }
        event.defaultPrevented = true;
      });

      scope.$on('expandAll', function (event,data) {
        if (!scope.config.autoCollapse){
          animDur = 0;
          for (var i = domContents.length - 1; i >= 0; i--) {
            if (domContents[i].obj.className.indexOf('expanded') == -1 && getLevel(domContents[i].id) > 1){
              toggleClass(domHeaders[i], 'active-header');
              toggleClass(domContents[i],'expanded');
              domContents[i].obj.style.height = 'auto';
            }
          };
          animDur = scope.config.animDur;
          //$timeout(function() {
          for (var i = domContents.length - 1; i >= 0; i--) {
            if(domContents[i].obj.className.indexOf('expanded') == -1 && getLevel(domContents[i].id) == 1){
              toggleClass(domHeaders[i], 'active-header');
              toggleClass(domContents[i],'expanded');
            }
          }
          //}, 200);
        }
        event.defaultPrevented = true;
      });

    }
  }
}]);