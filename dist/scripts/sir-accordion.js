'use strict';
angular.module('sir-accordion', [])
.directive('sirAccordion',['$compile','$timeout', function($compile,$timeout){
  var template='';
  return {
    restrict: 'A',
    scope: {
      collection: '=',
      config: '=?',
      data: '=?'
    },
    template: template,
    controller: ('sirAccordionCtrl',['$scope',function ($scope) {
      $scope.config = {
        debug: typeof $scope.config.debug != 'undefined' ? $scope.config.debug : false,
        animDur : ($scope.config.animDur >= 200 && document.body.firstElementChild) ? $scope.config.animDur : 0,
        expandFirst: typeof $scope.config.expandFirst != 'undefined' ? $scope.config.expandFirst : false,
        autoCollapse : typeof $scope.config.autoCollapse != 'undefined' ? $scope.config.autoCollapse : true,
        watchInternalChanges : typeof $scope.config.watchInternalChanges != 'undefined' ? $scope.config.watchInternalChanges : false,
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
      var newScope = null;

      /*
        * @ngdoc watch
        * @description watches changes in the Array provided to build the accordion
      */
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

        element.html('');

        if (newScope) {
          newScope.$destroy();
          newScope = null;
        }

        newScope = scope.$new();
        var compiled = $compile(accordionHTML)(newScope);
        element.append(compiled);
        setObjectTree();

        scope.$emit('sacDoneLoading');
      },scope.config.watchInternalChanges);


      /*
        * @ngdoc function
        * @name setObjectTree
        * @description set 2 Object Arrays containing all headers and contents objects and ids
      */
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
            domHeaders[i].obj.style.transition = 'all ' + (animDur) + 'ms';
          }
        };
      };
      
      /*
        * @ngdoc function
        * @name itemRegen
        * @description Builds up the HTML code for the accordion recursively, given a JSON array
        * @param {Array} collection
        * @param {Integer} parentIndex
        * @param {Integer} currentIndex
        * @param {Integer} level
        * @return
      */
      var itemRegen = function(collection, parentIndex, currentIndex, level) {
        if (currentIndex == collection.length){
          return '';
        }
        
        uniqueIndex = level ? String(parentIndex) + '-' + String(currentIndex + 1) : String(currentIndex + 1);
        header = scope.config.preHeader + collection[currentIndex].title + scope.config.postHeader;
        topContent = setContent(scope.config.preTopContent, collection[currentIndex].topContent, scope.config.postTopContent);
        domContents.push(uniqueIndex);

        item = 
        '<div id="sac' + uniqueIndex + '" >' 
          + '<div class="sir-accordion-header ' + scope.config.headerClass
          + '" ng-click="expandCollapse(\''+ uniqueIndex+ '\')">'
            + header
          + '</div>'
          + '<div class="sir-accordion-content">'
            + '<div>'
              + '<div class="' + scope.config.topContentClass + '">'
                + topContent
              + '</div>';
        
        if (currentIndex == 0){
          if (level == 0){
            item = '<div class="sir-accordion-wrapper">' + item;
          }
          else{
            item = '<div class="sir-accordion-group">' + item;
          }
        }

        bottomContent = setContent(scope.config.preBottomContent, collection[currentIndex].bottomContent, scope.config.postBottomContent);

        if (angular.isArray(collection[currentIndex].subCollection) && collection[currentIndex].subCollection.length){
          item = item + itemRegen(collection[currentIndex].subCollection, uniqueIndex, 0, level + 1);
          item = item + '</div><div class="' + scope.config.bottomContentClass + '">' + bottomContent + '</div></div></div></div>';
        }
        else{
          item = item + '<div class="' + scope.config.bottomContentClass + '">' + bottomContent + '</div></div></div></div>';
        }
        
        return item + itemRegen(collection, parentIndex, currentIndex + 1, level);
      };

      /*
        * @ngdoc function
        * @name setContent
        * @description adds leading and traling code to a content before injecting it to the code
        * @param {String} pre
        * @param {String} content
        * @param {String} post
        * @return {String} content
      */
      var setContent = function(pre,content,post) {
        if (!content){
          content = '';
        }
        else{
          content = pre + content + post;
        }
        return content;
      };
      
      /*
        * @ngdoc function
        * @name chainCollapse
        * @description Collapses an element given a starting id and its parents until a stopLevel is given
        * @param {String} toCollapse
        * @param {String} stopLevel
        * @return
      */
      var chainCollapse = function(toCollapse,stopLevel) {
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
        while (getLevel(toCollapse) != stopLevel);
      };
      
      /*
        * @ngdoc function
        * @name getLevel
        * @description gets the level of an element given its id
        * @param {String} id
        * @return {String}
      */
      var getLevel = function(id) {
        if (id == '0') return 0;
        else return id.split('-').length;
      };
      
      /*
        * @ngdoc function
        * @name getParentId
        * @description gets the parent id given an id
        * @param {String} id
        * @return {String}
      */
      var getParentId = function(id) {
        if(id.indexOf('-') == -1){
          return '0';
        }
        var lastChar = '';
        do {
          lastChar = id.substr(id.length -1);
          id = id.slice(0,-1);
        }
        while (lastChar != '-');
        id = id.replace('sac','');
        return id;
      };
      
      /*
        * @ngdoc function
        * @name toggleClass
        * @description add or removes a class given a domObject and a class
        * @param {Object} domContent
        * @return {String} toggleClass
      */

      var toggleClass = function (domContent,toggleClass){
        var domObjectChild = (domContent.obj.firstElementChild) ? domContent.obj.firstElementChild : domContent.obj.firstChild;
        /*if(toggleClass == 'expanded' && domObjectChild.className.indexOf('velocity-animating') != -1){
          return false;
        }*/
        if (domContent.obj.className.indexOf(toggleClass) > -1){
          domContent.obj.className = domContent.obj.className.replace(toggleClass,'');
          if (scope.config.debug) console.log('removing class ' + domContent.id);
          if (toggleClass == 'expanded'){
            Velocity(domObjectChild, 'slideUp', {duration: animDur});
          }
          return true;
        }
        else{
          domContent.obj.className = trim(domContent.obj.className) + ' ' + toggleClass;
          if (scope.config.debug) console.log('adding class ' + domContent.id);
          if (toggleClass == 'expanded'){
            Velocity(domObjectChild, 'slideDown', {duration: animDur});
          }
          return true;
        }
      };
      
      /*
        * @ngdoc function
        * @name isParent
        * @description Checks if a content is parent of another given 2 ids
        * @param {parentId}
        * @param {childId}
        * @return {Boolean}
      */
      var isParent = function (parentId,childId){
        do{
          if (getParentId(childId) == parentId)
          return true;
          childId = getParentId(childId);
        }
        while(getLevel(childId) > getLevel(parentId));
        return false;
      };
      
      /*
        * @ngdoc function
        * @name trim
        * @description removes leading and trailing blank spaces out of a String
        * @param {String} str
        * @return {String}
      */
      var trim = function (str) {
        var str = str.replace(/^\s\s*/, ''),
        ws = /\s/,
        i = str.length;
        while (ws.test(str.charAt(--i)));
        return str.slice(0, i + 1);
      };
      
      /*
        * @ngdoc function
        * @name getDomContetsIndex
        * @description Gets an domContent index inside contents array given its id
        * @param {String} id
        * @return {Integer} i
      */
      var getDomContentsIndex = function(id){
        for (var i = domContents.length - 1; i >= 0; i--) {
          if (domContents[i].id == ('sac' + id) || domContents[i].id == (id))
          return i;
        }
        return -1;
      };

      /*
        * @ngdoc function
        * @name closeOpenChilds
        * @description Checks domContents and closes the child elements given an id
        * @param {Object} domContents
        * @id {String} id
      */
      var closeOpenChilds = function(domContents, id){
        for (var i = domContents.length - 1; i >= 0; i--) {
          if (isParent(id,domContents[i].id) && domContents[i].obj.className.indexOf('expanded') > -1){
            toggleClass(domContents[i],'expanded');
            toggleClass(domHeaders[i],'active-header');
          }
        };
      };

      /*
        * @ngdoc function
        * @name expandCollapse
        * @description Expands an element
        * @param {String} id
      */
      var expandCollapse = function(id){
        var idIndex = getDomContentsIndex(id);
        var currentExpandedIndex = getDomContentsIndex(currentExpanded);
        var domContent = domContents[idIndex];
        var domHeader = domHeaders[idIndex];
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
            if (scope.config.debug) console.log('%c Closing same',consoleHighLight);
            if (scope.config.debug) console.log('From current element to ' + currentExpanded);
            return;
          }
          if (currentExpanded != id){
            if(getParentId(id) == currentExpanded) {
              if (scope.config.debug) console.log('%c Opening Child',consoleHighLight);
              toggleClass(domContent,'expanded');
              toggleClass(domHeader,'active-header');
              currentExpanded = id;
              return;
            }
            else if(isParent(id,currentExpanded)){
              if (scope.config.debug) console.log('%c Closing Parent',consoleHighLight);
              chainCollapse(currentExpanded,getLevel(id));
              toggleClass(domContent,'expanded');
              toggleClass(domHeader,'active-header');
              currentExpanded = getParentId(id);
              return;
            }
            else if(getParentId(currentExpanded) == getParentId(id)) {
              if (scope.config.debug) console.log('%c Opening sibling',consoleHighLight);
              toggleClass(domContents[currentExpandedIndex],'expanded');
              toggleClass(domHeaders[currentExpandedIndex], 'active-header');
              toggleClass(domHeader, 'active-header');
              toggleClass(domContent,'expanded');
              currentExpanded = id;
              return;
            }
            else {
              if (scope.config.debug) console.log('%c Opening other',consoleHighLight);
              chainCollapse(currentExpanded,getLevel(getParentId(id)));
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
          toggleClass(domContent,'expanded');
          toggleClass(domHeader, 'active-header');
          currentExpanded = id;
          return;
        }
      }
      
      /*
        * @ngdoc function
        * @name expandCollapseWithParents
        * @description Expands an element recursively including its parents
        * @param {String} id
      */
      var expandCollapseWithParents = function(id){
        animDur = 0;
        var ids = id.split('-');
        var thisId = '';
        for (var i = 0; i < ids.length; i++) {
          for (var j = 0; j <= i; j++) {
            if (j){
              thisId = thisId + '-' + ids[j];
            }
            else{
              thisId = ids[j];
            }
          };
          if(domContents[getDomContentsIndex(thisId)].obj.className.indexOf('expanded') == -1){
            expandCollapse(thisId);
          }
          thisId = '';
        };
        $timeout(function() {
          animDur = scope.config.animDur;  
        }, scope.config.animDur);
      };

      scope.expandCollapse = function(id){
        expandCollapse(id);
      };

      /*
        * @ngdoc event
        * @name sacCollapseAll
        * @description collapses all accordion contents
      */
      scope.$on('sacCollapseAll', function (event) {
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

      /*
        * @ngdoc event
        * @name sacExpandAll
        * @description expands all accordion contents
      */
      scope.$on('sacExpandAll', function (event,data) {
        if (!scope.config.autoCollapse){
          for (var i = domContents.length - 1; i >= 0; i--) {
            toggleClass(domHeaders[i], 'active-header');
            toggleClass(domContents[i],'expanded');
          };
        }
        event.defaultPrevented = true;
      });

      /*
        * @ngdoc event
        * @name sacExpandContentById
        * @description expands a content a all its parents given its id
      */
      scope.$on('sacExpandContentById', function (event,id){
        expandCollapseWithParents(id);
        event.defaultPrevented = true;
      });

    }
  }
}]);