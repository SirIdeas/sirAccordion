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
  var animDur = '0.3s';
  var topContent = '';
  var bottomContent = '';
  var item = '';
  var uniqueIndex = '';
  var accordionHTML = '';
  var domHeaders = [];
  var domContents = [];
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
    domHeaders = [];
    domContents = [];
    animating = [];
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
    var element = null;
    var header = null;
    var content = null;
    for (var i = domContents.length - 1; i >= 0; i--) {
      element = document.getElementById('sac' + domContents[i]);
      header = (element.firstElementChild) ? element.firstElementChild : element.firstChild;
      content = header.nextSibling;
      domContents[i] = {id: element.id, obj: content};
      domHeaders[i] = {id: element.id, obj: header};
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
      if (level == 0)
        item = '<div class="sir-accordion-wrapper"> <div id="sac' + uniqueIndex + '" > <div class="sir-accordion-header ' + scope.config.headerClass + '" ng-click="expandCollapse(\'' + uniqueIndex + '\')" class="' + scope.config.headerClass + '">' + header + '</div>' + '<div class="sir-accordion-content ' + scope.config.topContentClass + '"> <div>' + topContent;  
      else 
        item = '<div class="sir-accordion-group"> <div id="sac' + uniqueIndex + '" > <div class="sir-accordion-header ' + scope.config.headerClass + '" ng-click="expandCollapse(\'' + uniqueIndex + '\')" class="' + scope.config.headerClass + '">' + header + '</div>' + '<div class="sir-accordion-content ' + scope.config.topContentClass + '"> <div>' + topContent;  
    }
    else{
      item = '<div id="sac' + uniqueIndex + '" > <div class="sir-accordion-header ' + scope.config.headerClass + '" ng-click="expandCollapse(\'' + uniqueIndex + '\')" class="' + scope.config.headerClass + '">' + header + '</div>' + '<div class="sir-accordion-content ' + scope.config.topContentClass + '"> <div>' + topContent;
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
    do {
      for (var i = domContents.length - 1; i >= 0; i--) {
        if (scope.config.autocollapse && domContents[i].id == ('sac' + toCollapse)){
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
      //domContent.obj.style.transition = 'height 0s';
      if (domContent.obj.style.height != '0px'){
        domContent.obj.style.height = 'auto';
      }
    }, 400);

    domContent.obj.style.transition = 'height ' + animDur;

    $timeout(function() {
      domContent.obj.style.height = height + 'px';
    }, 1);
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
        activeHeaders.push(domHeader);
        if (scope.config.debug) console.log('%c Opening First',consoleHighLight);
        if (scope.config.debug) console.log('From 0 to ' + currentExpanded);
        return;
      }
      if (currentExpanded == id){
        toggleClass(domContent,'expanded');
        toggleClass(domHeader,'active-header');
        currentExpanded = getParentId(id) || '0';
        activeHeaders.pop();
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
          activeHeaders.push(domHeader);
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
          activeHeaders.pop();
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
          toggleClass(activeHeaders[activeHeaders.length-1], 'active-header');
          activeHeaders.pop();
          activeHeaders.push(domHeader);
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
          activeHeaders.push(domHeader);
          currentExpanded = id;
          toggleClass(domContent,'expanded');
          return;
        }
        return false;
      }
    }
    else{
      var expanded = toggleClass(domContents[idIndex],'expanded');
      if(isParent(id,currentExpanded)){
        chainCollapse(currentExpanded,id);
        toggleClass(domHeader, 'active-header');

      }
      else{
        toggleClass(domHeader, 'active-header');
      }
      while (getLevel(auxObject.id) >= 2){
        if (expanded){

          setContentHeight(parent,parent.obj.offsetHeight + height);
        }
        else{

          setContentHeight(parent,parent.obj.offsetHeight - height);
        }
        auxObject = parent;
        parent = domContents[getDomContentsIndex(getParentId(auxObject.id))];
      }
      if (expanded){
        activeHeaders.push(domHeader);
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
