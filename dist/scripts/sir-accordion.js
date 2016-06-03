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
          debugger;
          $scope.config = {
            debug: typeof $scope.config.debug != 'undefined' ? $scope.config.debug : false,
            animDur : ($scope.config.animDur >= 0 && document.body.firstElementChild) ? $scope.config.animDur : 0,
            expandFirst: typeof $scope.config.expandFirst != 'undefined' ? $scope.config.expandFirst : false,
            autoCollapse : typeof $scope.config.autoCollapse != 'undefined' ? $scope.config.autoCollapse : true,
            watchInternalChanges : typeof $scope.config.watchInternalChanges != 'undefined' ? $scope.config.watchInternalChanges : false,
            headerClass: $scope.config.headerClass || '',
            beforeHeader: $scope.config.beforeHeader || '<div class="sir-accordion-vertical-align"><div>',
            afterHeader: $scope.config.afterHeader || '</div></div>',
            topContentClass: $scope.config.topContentClass || '',
            beforeTopContent: $scope.config.beforeTopContent || '',
            afterTopContent: $scope.config.afterTopContent || '',
            bottomContentClass: $scope.config.bottomContentClass || '',
            beforeBottomContent: $scope.config.beforeBottomContent || '',
            afterBottomContent: $scope.config.afterBottomContent || '',
            iconMenu: ((typeof $scope.config.iconMenu != 'undefined') && (typeof $scope.config.iconMenu === 'boolean')) ? $scope.config.iconMenu : false,
            fontAwesomeIcon: ((typeof $scope.config.fontAwesomeIcon !== 'undefined') && (typeof $scope.config.fontAwesomeIcon === 'string')) ? $scope.config.fontAwesomeIcon : 'fa-angle-down'
          };
        }]),
        link: function(scope,element) {
          var animDur = scope.config.animDur;
          var header = '';
          var item = '';
          var uniqueIndex = '';
          var accordionHTML = '';
          var domHeaders = [];
          var domContents = [];
          var animating = false;
          var currentExpanded = '0';
          var consoleHighLight = 'background: #0044CE; color: #fff';
          var newScope = null;
          var iconMenu = scope.config.iconMenu;
          var iconMenuDom = '';
          var fontAwesomeIcon = scope.config.fontAwesomeIcon;

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
            item = '';
            uniqueIndex = '';
            accordionHTML = '';
            domHeaders = [];
            domContents = [];
            animating = false;
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
            if (scope.config.expandFirst){
              expandProgrammatically('1');
            }
          },scope.config.watchInternalChanges);


          /*
           * @ngdoc function
           * @name setObjectTree
           * @description set 2 Object Arrays containing all headers and contents objects and ids
           */
          var setObjectTree = function(){
            var thisElement = null;
            var header = null;
            var content = null;
            for (var i = domContents.length - 1; i >= 0; i--) {
              thisElement = element[0].querySelector('.sac' + domContents[i]);
              header = (thisElement.firstElementChild) ? thisElement.firstElementChild : thisElement.firstChild;
              content = header.nextSibling;
              domContents[i] = {id: thisElement.className, obj: content};
              domHeaders[i] = {id: thisElement.className, obj: header};
              if (thisElement.firstElementChild){
                domHeaders[i].obj.style.transition = 'all ' + (animDur) + 'ms';
              }
            };

            //console.log('Click 1');
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

            debugger;

            uniqueIndex = level ? String(parentIndex) + '-' + String(currentIndex + 1) : String(currentIndex + 1);

            iconMenuDom = iconMenu ? "<i class='fa " + fontAwesomeIcon + " sir-accordion-header-icon-down' icon-index='" + uniqueIndex + "' ng-hide='" + (collection[currentIndex].subCollection === undefined) + "' aria-hidden='true'></i>" : '';

            // console.log(collection[currentIndex]);
            header = scope.config.beforeHeader + collection[currentIndex].title + iconMenuDom + scope.config.afterHeader;
            // header = scope.config.beforeHeader + collection[currentIndex].title + "<i class='fa fa-angle-down sir-accordion-header-icon-down' icon-index='" + uniqueIndex + "' ng-hide='collection[currentIndex].subCollection === undefined' aria-hidden='true'></i>" + scope.config.afterHeader;
            domContents.push(uniqueIndex);

            item =
                '<div class="sac' + uniqueIndex + '" >'
                + '<div class="sir-accordion-header ' + scope.config.headerClass
                + '" ng-click="expandCollapseProgrammatically(\''+ uniqueIndex+ '\')">'
                + header
                + '</div>'
                + '<div class="sir-accordion-content">'
                + '<div>'
                + '<div class="' + scope.config.topContentClass + '">'
                + setContent(scope.config.beforeTopContent, collection[currentIndex].topContent, scope.config.afterTopContent)
                + '</div>';

            if (currentIndex == 0){
              if (level == 0){
                item = '<div class="sir-accordion-wrapper">' + item;
              }
              else{
                item = '<div class="sir-accordion-group">' + item;
              }
            }

            if (angular.isArray(collection[currentIndex].subCollection) && collection[currentIndex].subCollection.length){
              item = item + itemRegen(collection[currentIndex].subCollection, uniqueIndex, 0, level + 1);
              item = item + '</div><div class="' + scope.config.bottomContentClass + '">'
                  + setContent(scope.config.beforeBottomContent, collection[currentIndex].bottomContent, scope.config.afterBottomContent)
                  + '</div></div></div></div>';
            }
            else{
              item = item + '<div class="' + scope.config.bottomContentClass + '">'
                  + setContent(scope.config.beforeBottomContent, collection[currentIndex].bottomContent, scope.config.afterBottomContent)
                  + '</div></div></div></div>';
            }

            //console.log('Click 2');

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

            //console.log('Click 3');

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
            if (getLevel(toCollapse) <= stopLevel) return;
            do {
              for (var i = domContents.length - 1; i >= 0; i--) {
                if (scope.config.autoCollapse && domContents[i].id == ('sac' + toCollapse)){
                  toggleClass(domContents[i],'expanded');
                  toggleClass(domHeaders[i],'active-header');

                  toggleMenuIconClass(domHeaders[i], 'collapse');
                }
                else if(getParentId(domContents[i].id) == getParentId(toCollapse) && domContents[i].obj.className.indexOf('expanded') > -1){
                  toggleClass(domContents[i],'expanded');
                  toggleClass(domHeaders[i],'active-header');

                  toggleMenuIconClass(domHeaders[i], 'collapse');
                }

                /*if($(domHeaders[i].obj).find('i').hasClass('sir-icon-rotate')) {
                 $(domHeaders[i].obj).find('i').removeClass('sir-icon-rotate');
                 };*/
              }
              toCollapse = getParentId(toCollapse);
            }
            while (getLevel(toCollapse) != stopLevel);

            //console.log('Click 4');

          };

          /*
           * @ngdoc function
           * @name getLevel
           * @description gets the level of an element given its id
           * @param {String} id
           * @return {String}
           */
          var getLevel = function(id) {
            //console.log('Click 5');

            if (id == '0') return 0;
            else return id.split('-').length;
          };

          var toggleMenuIconClass = function (domObject, type) {
            if(iconMenu) {
              if(type === 'extend') {

                if(!$(domObject.obj).find('i').hasClass('sir-icon-rotate')) {

                  $(domObject.obj).find('i').addClass('sir-icon-rotate');

                };

              } else {

                if($(domObject.obj).find('i').hasClass('sir-icon-rotate')) {

                  $(domObject.obj).find('i').removeClass('sir-icon-rotate');

                  // console.trace();

                };

              }
            }
          };

          /*
           * @ngdoc function
           * @name getParentId
           * @description gets the parent id given an id
           * @param {String} id
           * @return {String}
           */
          var getParentId = function(id) {
            //console.log('Click 6');

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
           * @return {bool}
           */
          var toggleClass = function (domContent,toggleClass){
            //console.log('Click 7');

            var domObjectChild = null;
            if (domContent.obj.className.indexOf(toggleClass) > -1){
              domContent.obj.className = domContent.obj.className.replace(toggleClass,'');
              if (scope.config.debug) console.log('removing class ' + domContent.id);
              if (toggleClass == 'expanded'){
                domObjectChild = (domContent.obj.firstElementChild) ? domContent.obj.firstElementChild : domContent.obj.firstChild;
                velocity(domObjectChild, 'finish');
                velocity(domObjectChild, 'slideUp', {display: null, duration: animDur
                  ,complete: function(){domObjectChild.style.height = '0px'}});
              }
              return true;
            }
            else{
              domContent.obj.className = trim(domContent.obj.className) + ' ' + toggleClass;
              if (scope.config.debug) console.log('adding class ' + domContent.id);
              if (toggleClass == 'expanded'){
                domObjectChild = (domContent.obj.firstElementChild) ? domContent.obj.firstElementChild : domContent.obj.firstChild;
                velocity(domObjectChild, 'finish');
                velocity(domObjectChild, 'slideDown', {delay: 0, duration: animDur
                  , progress: function(){domContent.obj.style.height = 'auto'}
                  , begin: function(){domContent.obj.style.height = '0px';domObjectChild.style.height = 'auto';}});
              }
              return true;
            }
            return false;
          };

          /*
           * @ngdoc function
           * @name velocity
           * @description checks whether the app is using jquery or not, to excecute the
           * velocity commands corresponding to each case
           * @param {Object} element
           * @param {String} command
           * @param {Object} options
           */
          var velocity = function (element, command, options){
            //console.log('Click 8');


            if (typeof Velocity == 'undefined'){
              if(options){
                $(element).velocity(command, options);
              }
              else{
                $(element).velocity(command);
              }
              return;
            }
            else{
              if(options){
                Velocity(element, command, options);
              }
              else{
                Velocity(element, command);
              }
              return;
            }
          };

          /*
           * @ngdoc function
           * @name isParent
           * @description Checks if a content is parent of another given 2 ids
           * @param {String} parentId
           * @param {String} childId
           * @return {Boolean}
           */
          var isParent = function (parentId,childId){
            //console.log('Click 9');

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
           * @name getDomContentsIndex
           * @description Gets an domContent index inside contents array given its id
           * @param {String} id
           * @return {Integer} i
           */
          var getDomContentsIndex = function(id){
            //console.log('Click 10');

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
            //console.log('Click 11');


            for (var i = domContents.length - 1; i >= 0; i--) {
              if (isParent(id,domContents[i].id) && domContents[i].obj.className.indexOf('expanded') > -1){
                toggleClass(domContents[i],'expanded');
                toggleClass(domHeaders[i],'active-header');

                toggleMenuIconClass(domHeaders[i], 'collapse');

                // if($(domHeaders[getDomContentsIndex(i)].obj).find('i').hasClass('sir-icon-rotate')) {
                //   $(domHeaders[getDomContentsIndex(i)].obj).find('i').removeClass('sir-icon-rotate');
                // };
              }
            };
          };

          /*
           * @ngdoc function
           * @name expandProgrammatically
           * @description Expands an element programmatically including its parents
           * @param {String} id
           */
          var expandProgrammatically = function(id){
            //console.log('Click 12');

            if (id == '0'){
              collapseAll();
              currentExpanded = '0';
              return;
            }
            if (id == currentExpanded){
              return;
            }
            if (isParent(id, currentExpanded)){
              chainCollapse(currentExpanded,getLevel(id));
              currentExpanded = id;
              return;
            }
            var ids = id.split('-');
            var currentIds = currentExpanded.split('-');
            var thisId = '';
            var levelFix = 0;
            var levelsEqual = 0;
            var levelsDif = 0;

            if (scope.config.autoCollapse){
              if(currentExpanded != '0'){
                for (var i = 0; (i < ids.length) || (i < currentIds.length) ; i++) {
                  if(ids[i] == currentIds[i] && !levelsDif){
                    levelsEqual ++;
                  }
                  else{
                    levelsDif ++;
                  }
                };
                if(levelsDif > 1 && levelsEqual < getLevel(id)){
                  var numberOfCollapses = currentIds.length - levelsEqual;
                  var tempContent = currentExpanded;
                  while(numberOfCollapses > 0){
                    toggleClass(domContents[getDomContentsIndex(tempContent)],'expanded');
                    toggleClass(domHeaders[getDomContentsIndex(tempContent)], 'active-header');

                    toggleMenuIconClass(domHeaders[getDomContentsIndex(tempContent)], 'collapse');

                    // if($(domHeaders[getDomContentsIndex(tempContent)].obj).find('i').hasClass('sir-icon-rotate')) {
                    //   $(domHeaders[getDomContentsIndex(tempContent)].obj).find('i').removeClass('sir-icon-rotate');
                    // };

                    tempContent = getParentId(tempContent);
                    numberOfCollapses --;
                  }
                }
                else{
                  chainCollapse(currentExpanded,getLevel(id) - 1);
                }
              }
            }

            for (var i = 0; i < ids.length; i++) {
              for (var j = 0; j <= i; j++) {
                if (j){
                  thisId = thisId + '-' + ids[j];
                }
                else{
                  thisId = ids[j];
                }
              };
              if (domContents[getDomContentsIndex(thisId)]){
                if(domContents[getDomContentsIndex(thisId)].obj.className.indexOf('expanded') == -1){
                  expandByLevel(domContents[getDomContentsIndex(thisId)], domHeaders[getDomContentsIndex(thisId)], levelFix);
                  currentExpanded = thisId;
                }
                else{
                  levelFix--;
                }
              }
              else{
                if (scope.config.debug) console.log('%c Coordinate does not match an element',consoleHighLight);
              }
              thisId = '';
            };

            // if() {
            //
            // }

            //debugger;

            toggleMenuIconClass(domHeaders[getDomContentsIndex(currentExpanded)], 'extend');

            // if(!$(domHeaders[getDomContentsIndex(currentExpanded)].obj).find('i').hasClass('sir-icon-rotate')) {
            //   $(domHeaders[getDomContentsIndex(currentExpanded)].obj).find('i').addClass('sir-icon-rotate');
            // };
          };

          /*
           * @ngdoc function
           * @name expandCollapseProgrammatically
           * @description Expands or collapses an element programmatically depending of its current state
           * @param {String} id
           */

          scope.expandCollapseProgrammatically = function(id){

            itemClickEvent(id);

            if (!animating){
              if(domContents[getDomContentsIndex(id)].obj.className.indexOf('expanded') != -1){
                collapseProgrammatically(id);
              }
              else{
                expandProgrammatically(id);
              }
            }
          }

          var itemClickEvent = function(id) {
            var _idString = id.split('-'),
                _idInt = [];

            for(var idIndex = 0; idIndex < _idString.length; idIndex++) {
              _idInt.push(parseInt(_idString[idIndex])-1);
            }
            //console.log(_id);
            scope.$emit('itemClick', _idInt);
          }

          /*
           * @ngdoc function
           * @name collapseProgrammatically
           * @description collapses an element programmatically including its childs
           * @param {String} id
           */
          var collapseProgrammatically = function(id){
            //console.log('Click 14');

            if(domContents[getDomContentsIndex(id)].obj.className.indexOf('expanded') != -1){
              closeOpenChilds(domContents, id);
              toggleClass(domContents[getDomContentsIndex(id)],'expanded');
              toggleClass(domHeaders[getDomContentsIndex(id)], 'active-header');
              currentExpanded = getParentId(id);
            }

            toggleMenuIconClass(domHeaders[getDomContentsIndex(id)], 'collapse');

            // if($(domHeaders[getDomContentsIndex(id)].obj).find('i').hasClass('sir-icon-rotate')) {
            //   $(domHeaders[getDomContentsIndex(id)].obj).find('i').removeClass('sir-icon-rotate');
            // };

          }

          /*
           * @ngdoc function
           * @name expandByLevel
           * @description sets a timeout that expands an element by its level
           * @param {Object} domContent
           * @param {Object} domHeader
           * @param {Integer} levelFix
           */
          var expandByLevel = function(domContent, domHeader, levelFix){
            //console.log('Click 15');


            $timeout(function(){
              toggleClass(domContent,'expanded');
              toggleClass(domHeader, 'active-header');
            }, animDur*(getLevel(domContent.id) - 1 + levelFix));
          }

          /*
           * @ngdoc function
           * @name collapseAll
           * @description closes the accordion
           */
          var collapseAll = function(){
            currentExpanded = '0';
            for (var i = domContents.length - 1; i >= 0; i--) {
              if (domContents[i].obj.className.indexOf('expanded') > -1){
                toggleClass(domContents[i],'expanded');
                toggleClass(domHeaders[i], 'active-header');

                // if($(domHeaders[getDomContentsIndex(i)].obj).find('i').hasClass('sir-icon-rotate')) {
                //   $(domHeaders[getDomContentsIndex(i)].obj).find('i').removeClass('sir-icon-rotate');
                // };

                toggleMenuIconClass(domHeaders[getDomContentsIndex(i)], 'collapse');
              }
            };
          }

          /*
           * @ngdoc event
           * @name sacCollapseAll
           * @description collapses all accordion contents
           */
          scope.$on('sacCollapseAll', function (event) {
            collapseAll();
            event.defaultPrevented = true;
          });

          /*
           * @ngdoc event
           * @name sacExpandAll
           * @description expands all accordion contents
           */
          scope.$on('sacExpandAll', function (event,data) {
            if (!scope.config.autoCollapse){
              for (var i = 0; i <= domContents.length - 1; i++) {
                if(domContents[i].obj.className.indexOf('expanded') == -1){
                  expandByLevel(domContents[i], domHeaders[i], 0);
                }
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
            expandProgrammatically(id);
            event.defaultPrevented = true;
          });

          /*
           * @ngdoc event
           * @name sacCollapseContentById
           * @description collapses a content a all its children given its id
           */
          scope.$on('sacCollapseContentById', function (event, id){
            collapseProgrammatically(id);
            event.defaultPrevented = true;
          });
        }
      }
    }]);