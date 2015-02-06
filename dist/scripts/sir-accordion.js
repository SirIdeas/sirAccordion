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
    controller: ('sirNgAccordionCtrl',['$scope',function ($scope){
      $scope.config = {
        debug: typeof $scope.config.debug != 'undefined' ? $scope.config.debug : false,
        animation: typeof $scope.config.animation != 'undefined' ? $scope.config.animation : true,
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
link: function(scope,element){
  var header = '';
  var topContent = '';
  var bottomContent = '';
  var item = '';
  var uniqueIndex = '';
  var accordionHTML = '';
  var domContents = [];
  var animating = [];
  var currentExpanded = '0';
  var activeHeaders = [];
  //var activeContents = [];
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
    domContents = [];
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
    for (var i = domContents.length - 1; i >= 0; i--) {
      domContents[i] = document.getElementById('sac' + domContents[i]);
    };
    console.log(domContents);
  };

  var itemRegen2 = function(collection, parentIndex, currentIndex, level) {
    if (currentIndex == collection.length){
      return '';
    }

    uniqueIndex = level ? String(parentIndex) + '-' + String(currentIndex + 1) : String(currentIndex + 1);
    header = scope.config.preHeader + collection[currentIndex].title + scope.config.postHeader;
    topContent = setContent(scope.config.preTopContent, collection[currentIndex].topContent, scope.config.postTopContent);
    domContents.push(uniqueIndex);

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

  var itemRegen = function(collection, parentIndex, currentIndex, level) {
    if (currentIndex == collection.length){
      return '';
    }

    uniqueIndex = level ? String(parentIndex) + '-' + String(currentIndex + 1) : String(currentIndex + 1);
    header = scope.config.preHeader + collection[currentIndex].title + scope.config.postHeader;
    topContent = setContent(scope.config.preTopContent, collection[currentIndex].topContent, scope.config.postTopContent);
    domContents.push(uniqueIndex);

    if (currentIndex == 0){
      if (level == 0)
        item = '<div class="sir-accordion-wrapper"> <div id="sac' + uniqueIndex + '" > <div class="sir-accordion-header ' + scope.config.headerClass + '" ng-click="expandCollapse($event,\'' + uniqueIndex + '\')" class="' + scope.config.headerClass + '">' + header + '</div>' + '<div class="sir-accordion-content ' + scope.config.topContentClass + '"> <div>' + topContent;  
      else 
        item = '<div class="sir-accordion-group"> <div id="sac' + uniqueIndex + '" > <div class="sir-accordion-header ' + scope.config.headerClass + '" ng-click="expandCollapse($event,\'' + uniqueIndex + '\')" class="' + scope.config.headerClass + '">' + header + '</div>' + '<div class="sir-accordion-content ' + scope.config.topContentClass + '"> <div>' + topContent;  
    }
    else{
      item = '<div id="sac' + uniqueIndex + '" > <div class="sir-accordion-header ' + scope.config.headerClass + '" ng-click="expandCollapse($event,\'' + uniqueIndex + '\')" class="' + scope.config.headerClass + '">' + header + '</div>' + '<div class="sir-accordion-content ' + scope.config.topContentClass + '"> <div>' + topContent;
    }

    if (angular.isArray(collection[currentIndex].subCollection) && collection[currentIndex].subCollection.length){
      item = item + itemRegen(collection[currentIndex].subCollection, uniqueIndex, 0, level + 1);
      bottomContent = setContent(scope.config.preBottomContent, collection[currentIndex].bottomContent, scope.config.postBottomContent);
      item = item + bottomContent + '</div></div></div></div>';
    }
    else{
      bottomContent = setContent(scope.config.preBottomContent, collection[currentIndex].bottomContent, scope.config.postBottomContent);
      item = item + bottomContent + '</div></div></div>';
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
    var prueba = 0;
    do {
      for (var i = domContents.length - 1; i >= 0; i--) {
        if (scope.config.autocollapse && domContents[i].id == ('sac' + toCollapse)){
          toggleClass(domContents[i],'expanded');
        }
        else if(getParentId(domContents[i].id) == getParentId(toCollapse) && domContents[i].className.indexOf('expanded') > -1){
          toggleClass(domContents[i],'expanded');
          prueba ++;
        }
      }
      toCollapse = getParentId(toCollapse);
      //
      /*if (activeHeaders[i].className.indexOf('') > -1){

      }*/
      toggleClass(activeHeaders[activeHeaders.length-1],'active-header');
      activeHeaders.pop();
      console.log(prueba);
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
    if (domObject.className.indexOf(toggleClass) > -1){
      domObject.className = domObject.className.replace(toggleClass,'');
      if (scope.config.debug) console.log('removing class ' + domObject.id);
      if (toggleClass == "expanded"){
        setContentHeight(domObject,0);
      }
      return false;
    }
    else{
      domObject.className = trim(domObject.className) + ' ' + toggleClass;
      if (scope.config.debug) console.log('adding class ' + domObject.id);
      if (toggleClass == "expanded"){
        var height = domObject.firstChild.offsetHeight || domObject.firstElementChild.offsetHeight;
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
      domObject.style.transition = 'height 0s';
      if (domObject.style.height != '0px'){
        domObject.style.height = 'auto';
      }
    }, 400);

    domObject.style.transition = 'height 0.3s';

    $timeout(function() {
      domObject.style.height = height + 'px';
    }, 1);
  };

  var getdomContentsIndex = function(id){
    for (var i = domContents.length - 1; i >= 0; i--) {
      if (domContents[i].id == ('sac' + id) || domContents[i].id == (id))
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
    for (var i = domContents.length - 1; i >= 0; i--) {
      if (domContents[i].style.height == 'auto'){
        var height = domContents[i].firstChild.offsetHeight || domContents[i].firstElementChild.offsetHeight;

        domContents[i].style.height = height + 'px';

      }
    };
  };

  scope.expandCollapse = function(event,id){
    var headerElement = (event.currentTarget) ? event.currentTarget : getCurrentTargetIE8(event.srcElement);
    var idIndex = getdomContentsIndex(id);
    var currentExpandedIndex = getdomContentsIndex(currentExpanded);
    var domObject = domContents[idIndex];
    var auxObject = domObject;
    var parent = domContents[getdomContentsIndex(getParentId(domObject.id))];
    var height = domObject.firstChild.offsetHeight || domObject.firstElementChild.offsetHeight;
    if (domObject.id && isAnimating(domObject.id))
      return;
    cleanAutoHeight();
    var parentIndex = '-1';
    if (scope.config.autoCollapse){
      if (currentExpanded == '0'){
        toggleClass(headerElement, 'active-header');
        toggleClass(domContents[idIndex],'expanded');
        currentExpanded = id;
        activeHeaders.push(headerElement);
        if (scope.config.debug) console.log('%c Opening First',consoleHighLight);
        if (scope.config.debug) console.log('From 0 to ' + currentExpanded);
        return;
      }
      if (currentExpanded == id){
        toggleClass(domContents[idIndex],'expanded');
        toggleClass(headerElement,'active-header');
        currentExpanded = getParentId(id) || '0';
        activeHeaders.pop();
        while (getLevel(auxObject.id) >= 2){
          setContentHeight(parent,parent.offsetHeight - height);
          auxObject = parent;
          parent = domContents[getdomContentsIndex(getParentId(auxObject.id))];
        }
        if (scope.config.debug) console.log('%c Closing same',consoleHighLight);
        if (scope.config.debug) console.log('From current element to ' + currentExpanded);
        return;
      }
      if (currentExpanded != id && !animating.length){
        var type = '';
        var currentExpandedHeight = domContents[currentExpandedIndex].style.height;
        currentExpandedHeight = currentExpandedHeight.substr(0,currentExpandedHeight.length - 2);
        if(getParentId(id) == currentExpanded) {
          if (scope.config.debug) console.log('%c Opening Child',consoleHighLight);
          toggleClass(domContents[idIndex],'expanded');
          toggleClass(headerElement,'active-header');
          activeHeaders.push(headerElement);
          currentExpanded = id;
          while (getLevel(auxObject.id) >= 2){
            setContentHeight(parent,parent.offsetHeight + height);
            auxObject = parent;
            parent = domContents[getdomContentsIndex(getParentId(auxObject.id))];
          }
          return;
        }
        else if(isParent(id,currentExpanded)){
          if (scope.config.debug) console.log('%c Closing Parent',consoleHighLight);
          chainCollapse(currentExpanded,id);
          toggleClass(domContents[idIndex],'expanded');
          toggleClass(headerElement,'active-header');
          activeHeaders.pop();
          currentExpanded = getParentId(id);
          while (getLevel(auxObject.id) >= 2){
            setContentHeight(parent,parent.offsetHeight - height);
            auxObject = parent;
            parent = domContents[getdomContentsIndex(getParentId(auxObject.id))];
          }
          return;
        }
        else if(getParentId(currentExpanded) == getParentId(id)) {
          if (scope.config.debug) console.log('%c Opening sibling',consoleHighLight);
          toggleClass(domContents[currentExpandedIndex],'expanded');
          toggleClass(activeHeaders[activeHeaders.length-1], 'active-header');
          activeHeaders.pop();
          activeHeaders.push(headerElement);
          toggleClass(headerElement, 'active-header');
          toggleClass(domContents[idIndex],'expanded');
          currentExpanded = id;
          while (getLevel(auxObject.id) >= 2){
            setContentHeight(parent,parent.offsetHeight + height - currentExpandedHeight);
            auxObject = parent;
            parent = domContents[getdomContentsIndex(getParentId(auxObject.id))];
          }
          return;
        }
        else {
          if (scope.config.debug) console.log('%c Opening other',consoleHighLight);
          if (getLevel(id) >= 2){
            var parentId = getParentId(currentExpanded);
            parentId = getdomContentsIndex(parentId);
            parentId = domContents[parentId];
            while (getLevel(parentId.id) > getLevel(id)){
              parentId = domContents[getdomContentsIndex(getParentId(parentId.id))];
            }
            parentId = height - parentId.offsetHeight;
            var auxParent = parent;
            while (auxParent && getLevel(auxParent.id) >= 1){
              setContentHeight(auxParent,auxParent.offsetHeight + parentId);
              auxParent = domContents[getdomContentsIndex(getParentId(auxParent.id))];
            }
          }
          chainCollapse(currentExpanded,getParentId(id));
          toggleClass(headerElement,'active-header');
          activeHeaders.push(headerElement);
          currentExpanded = id;
          toggleClass(domContents[idIndex],'expanded');
          return;
        }
        return false;
      }
    }
    else{
      var expanded = toggleClass(domContents[idIndex],'expanded');
      if(isParent(id,currentExpanded)){
        chainCollapse(currentExpanded,id);
        toggleClass(headerElement, 'active-header');

      }
      else{
        toggleClass(headerElement, 'active-header');
      }
      while (getLevel(auxObject.id) >= 2){
        if (expanded){

          setContentHeight(parent,parent.offsetHeight + height);
        }
        else{

          setContentHeight(parent,parent.offsetHeight - height);
        }
        auxObject = parent;
        parent = domContents[getdomContentsIndex(getParentId(auxObject.id))];
      }
      if (expanded){
        activeHeaders.push(headerElement);
      }
      else{
        activeHeaders.pop();
      }
      currentExpanded = id;
      //activeContents.push(domContents[idIndex]);
      console.log(activeHeaders);
      //console.log(activeContents);
      return;
    }
  };
}
}
}]);
