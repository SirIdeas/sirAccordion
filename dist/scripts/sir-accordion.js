(function () {
  'use strict';
  
  angular.module('sir-accordion', [])
    .directive('sirAccordion', ['$compile', '$timeout', '$parse', function ($compile, $timeout, $parse) {
      return {
        restrict: 'A',
        scope: true,
        controller: ('sirAccordionCtrl', ['$scope', function ($scope) { }]),
        link: function (scope, element, attrs) {
          var domHeaders = [];
          var domContents = [];
          var currentExpanded = '0';
          var consoleHighLight = 'background: #0044CE; color: #fff';

          scope.accordionCollection = null;
          scope.accordionConfig = $parse(attrs.config)(scope);
          scope.accordionConfig.id = element.attr('id') || scope.accordionConfig.id || '';
          scope.accordionConfig.animDur = scope.accordionConfig.animDur || 0;
          scope.accordionConfig.headerClass = scope.accordionConfig.headerClass || '';
          scope.accordionConfig.beforeHeader = scope.accordionConfig.beforeHeader || '';
          scope.accordionConfig.afterHeader = scope.accordionConfig.afterHeader || '';
          scope.accordionConfig.topContentClass = scope.accordionConfig.topContentClass || '';
          scope.accordionConfig.beforeTopContent = scope.accordionConfig.beforeTopContent || '';
          scope.accordionConfig.afterTopContent = scope.accordionConfig.afterTopContent || '';
          scope.accordionConfig.bottomContentClass = scope.accordionConfig.bottomContentClass || '';
          scope.accordionConfig.beforeBottomContent = scope.accordionConfig.beforeBottomContent || '';
          scope.accordionConfig.afterBottomContent = scope.accordionConfig.afterBottomContent || '';

          /*
            * @ngdoc watch
            * @description watches changes in the Array provided to build the accordion
          */
          attrs.$observe('collection', function (newVal) {
            //console.log(newVal);
            scope.accordionCollection = $parse(newVal)(scope);

            if (!angular.isArray(scope.accordionCollection)) {
              element.html('No collection found');
              return;
            }

            if (scope.accordionConfig.id) {
              if (document.getElementById(scope.accordionConfig.id) == null) {
                element.attr('id', scope.accordionConfig.id);
              }
              else {
                if (scope.accordionConfig.debug) console.log('Id already exists');
              }
            }

            var accordionHTML = '';
            domHeaders = [];
            domContents = [];
            currentExpanded = '0';
            accordionHTML = itemRegen(scope.accordionCollection, 0, 0, 0);

            element.html('');

            if (newScope) {
              newScope.$destroy();
              newScope = null;
            }

            var newScope = scope.$new();
            var compiled = $compile(accordionHTML)(newScope);
            element.append(compiled);
            setObjectTree();

            scope.$emit('sacDoneLoading');
            if (scope.accordionConfig.expandFirst) {
              expandProgrammatically('1');
            }
          });

          /*
            * @ngdoc function
            * @name setObjectTree
            * @description set 2 Object Arrays containing all headers and contents objects and ids
          */
          var setObjectTree = function () {
            var thisElement = null;
            var header = null;
            var content = null;
            for (var i = domContents.length - 1; i >= 0; i--) {
              thisElement = element[0].querySelector('.sac' + domContents[i]);
              header = (thisElement.firstElementChild) ? thisElement.firstElementChild : thisElement.firstChild;
              content = header.nextSibling;
              domContents[i] = { id: thisElement.className, obj: content };
              domHeaders[i] = { id: thisElement.className, obj: header };
              if (thisElement.firstElementChild) {
                domHeaders[i].obj.style.transition = 'all ' + (scope.accordionConfig.animDur) + 'ms';
              }
            }
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
          var itemRegen = function (collection, parentIndex, currentIndex, level) {
            var header = null;
            var item = null;
            var uniqueIndex = '';
            if (currentIndex == collection.length) {
              return '';
            }

            uniqueIndex = level ? String(parentIndex) + '-' + String(currentIndex + 1) : String(currentIndex + 1);
            var thisUniqueIndex = uniqueIndex;
            header = scope.accordionConfig.beforeHeader + collection[currentIndex].title + scope.accordionConfig.afterHeader;
            domContents.push(uniqueIndex);

            var leafCLass = '';
            if (!angular.isArray(collection[currentIndex].subCollection) || !collection[currentIndex].subCollection.length) {
              leafCLass = 'sir-accordion-leaf';
            }

            item =
              '<div class="sac' + uniqueIndex + '" >'
              + '<div class="' + ('sir-accordion-header ' + scope.accordionConfig.headerClass).trim()
              + '" ng-click="expandCollapseProgrammatically(\'' + uniqueIndex + '\')">'
              + header
              + '</div>'
              + '<div class="sir-accordion-content ' + leafCLass + '">'
              + '<div>'
              + '<div class="' + scope.accordionConfig.topContentClass + '">'
              + setContent(scope.accordionConfig.beforeTopContent, collection[currentIndex].topContent, scope.accordionConfig.afterTopContent, 'sac-top-' + thisUniqueIndex)
              + '</div>';

            if (currentIndex == 0) {
              if (level == 0) {
                item = '<div class="sir-accordion-wrapper">' + item;
              }
              else {
                item = '<div class="sir-accordion-group">' + item;
              }
            }

            if (angular.isArray(collection[currentIndex].subCollection) && collection[currentIndex].subCollection.length) {
              item = item + itemRegen(collection[currentIndex].subCollection, uniqueIndex, 0, level + 1);
              item = item + '</div><div class="' + scope.accordionConfig.bottomContentClass + '">'
                + setContent(scope.accordionConfig.beforeBottomContent, collection[currentIndex].bottomContent, scope.accordionConfig.afterBottomContent, 'sac-bottom-' + thisUniqueIndex)
                + '</div></div></div></div>';
            }
            else {
              item = item + '<div class="' + scope.accordionConfig.bottomContentClass + '">'
                + setContent(scope.accordionConfig.beforeBottomContent, collection[currentIndex].bottomContent, scope.accordionConfig.afterBottomContent, 'sac-bottom-' + thisUniqueIndex)
                + '</div></div></div></div>';
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
          var setContent = function (pre, content, post, uniqueIndex) {
            if (!content) {
              content = '';
            }
            if (!uniqueIndex) {
              return pre + '<div>' + content + '</div>' + post;
            }
            return pre + '<div id="' + scope.accordionConfig.id + uniqueIndex + '">' + content + '</div>' + post;
          };

          /*
            * @ngdoc function
            * @name chainCollapse
            * @description Collapses an element given a starting id and its parents until a stopLevel is given
            * @param {String} toCollapse
            * @param {String} stopLevel
            * @return
          */
          var chainCollapse = function (toCollapse, stopLevel) {
            if (scope.accordionConfig.debug) console.log('Chain collapsing');
            if (getLevel(toCollapse) <= stopLevel) return;
            do {
              for (var i = domContents.length - 1; i >= 0; i--) {
                if (scope.accordionConfig.autoCollapse && domContents[i].id == ('sac' + toCollapse)) {
                  toggleClass(domContents[i], 'expanded');
                  toggleClass(domHeaders[i], 'active-header');
                }
                else if (getParentId(domContents[i].id) == getParentId(toCollapse) && domContents[i].obj.className.indexOf('expanded') > -1) {
                  toggleClass(domContents[i], 'expanded');
                  toggleClass(domHeaders[i], 'active-header');
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
          var getLevel = function (id) {
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
          var getParentId = function (id) {
            if (id.indexOf('-') == -1) {
              return '0';
            }
            var lastChar = '';
            do {
              lastChar = id.substr(id.length - 1);
              id = id.slice(0, -1);
            }
            while (lastChar != '-');
            id = id.replace('sac', '');
            return id;
          };

          /*
            * @ngdoc function
            * @name toggleClass
            * @description add or removes a class given a domObject and a class
            * @param {Object} domContent
            * @return {bool}
          */
          var toggleClass = function (domContent, toggleClass) {
            var domObjectChild = null;
            if (domContent.obj.className.indexOf(toggleClass) > -1) {
              domContent.obj.className = domContent.obj.className.replace(toggleClass, '');
              if (scope.accordionConfig.debug) console.log('removing class ' + domContent.id);
              if (toggleClass == 'expanded') {
                domObjectChild = (domContent.obj.firstElementChild) ? domContent.obj.firstElementChild : domContent.obj.firstChild;
                velocity(domObjectChild, 'finish');
                velocity(domObjectChild, 'slideUp', {
                  display: null, duration: scope.accordionConfig.animDur,
                  complete: function () {
                    domObjectChild.style.height = '0px';
                    var collapsingCoords = domContent.id.replace('sac', '');
                    if (getLevel(currentExpanded) === getLevel(collapsingCoords) - 1) {
                      scope.$emit('sacCollapseEnd', collapsingCoords);
                    }
                  }
                });
              }
              return true;
            }
            else {
              domContent.obj.className = trim(domContent.obj.className) + ' ' + toggleClass;
              if (scope.accordionConfig.debug) console.log('adding class ' + domContent.id);
              if (toggleClass == 'expanded') {
                domObjectChild = (domContent.obj.firstElementChild) ? domContent.obj.firstElementChild : domContent.obj.firstChild;
                velocity(domObjectChild, 'finish');
                velocity(domObjectChild, 'slideDown', {
                  delay: 0, duration: scope.accordionConfig.animDur,
                  progress: function () { domContent.obj.style.height = 'auto' },
                  begin: function () { domContent.obj.style.height = '0px'; domObjectChild.style.height = 'auto'; },
                  complete: function () {
                    if (domContent.id.replace('sac', '') === currentExpanded) {
                      scope.$emit('sacExpandEnd', currentExpanded);
                    }
                  }
                });
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
          var velocity = function (element, command, options) {
            if (typeof Velocity == 'undefined') {
              if (options) {
                $(element).velocity(command, options);
              }
              else {
                $(element).velocity(command);
              }
              return;
            }
            else {
              if (options) {
                Velocity(element, command, options);
              }
              else {
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
          var isParent = function (parentId, childId) {
            do {
              if (getParentId(childId) == parentId)
                return true;
              childId = getParentId(childId);
            }
            while (getLevel(childId) > getLevel(parentId));
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
          var getDomContentsIndex = function (id) {
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
          var closeOpenChilds = function (domContents, id) {
            for (var i = domContents.length - 1; i >= 0; i--) {
              if (isParent(id, domContents[i].id) && domContents[i].obj.className.indexOf('expanded') > -1) {
                toggleClass(domContents[i], 'expanded');
                toggleClass(domHeaders[i], 'active-header');
              }
            };
          };

          /*
            * @ngdoc function
            * @name expandProgrammatically
            * @description Expands an element programmatically including its parents
            * @param {String} id
          */
          var expandProgrammatically = function (id) {
            if (id == '0') {
              collapseAll();
              currentExpanded = '0';
              return;
            }
            if (id == currentExpanded) {
              return;
            }
            if (isParent(id, currentExpanded)) {
              chainCollapse(currentExpanded, getLevel(id));
              currentExpanded = id;
              return;
            }
            var ids = id.split('-');
            var currentIds = currentExpanded.split('-');
            var thisId = '';
            var levelFix = 0;
            var levelsEqual = 0;
            var levelsDif = 0;

            if (scope.accordionConfig.autoCollapse) {
              if (currentExpanded != '0') {
                for (var i = 0; (i < ids.length) || (i < currentIds.length); i++) {
                  if (ids[i] == currentIds[i] && !levelsDif) {
                    levelsEqual++;
                  }
                  else {
                    levelsDif++;
                  }
                };
                if (levelsDif > 1 && levelsEqual < getLevel(id)) {
                  var numberOfCollapses = currentIds.length - levelsEqual;
                  var tempContent = currentExpanded;
                  while (numberOfCollapses > 0) {
                    toggleClass(domContents[getDomContentsIndex(tempContent)], 'expanded');
                    toggleClass(domHeaders[getDomContentsIndex(tempContent)], 'active-header');
                    tempContent = getParentId(tempContent);
                    numberOfCollapses--;
                  }
                }
                else {
                  chainCollapse(currentExpanded, getLevel(id) - 1);
                }
              }
            }

            for (var i = 0; i < ids.length; i++) {
              for (var j = 0; j <= i; j++) {
                if (j) {
                  thisId = thisId + '-' + ids[j];
                }
                else {
                  thisId = ids[j];
                }
              }
              if (domContents[getDomContentsIndex(thisId)]) {
                if (domContents[getDomContentsIndex(thisId)].obj.className.indexOf('expanded') == -1) {
                  expandByLevel(domContents[getDomContentsIndex(thisId)], domHeaders[getDomContentsIndex(thisId)], levelFix)
                  if (i === ids.length - 1) {
                    scope.$emit('sacExpandStart', thisId);
                  }
                  currentExpanded = thisId;
                }
                else {
                  levelFix--;
                }
              }
              else {
                if (scope.accordionConfig.debug) console.log('%c Coordinate does not match an element', consoleHighLight);
              }
              thisId = '';
            }
          };

          /*
            * @ngdoc function
            * @name expandCollapseProgrammatically
            * @description Expands or collapses an element programmatically depending of its current state
            * @param {String} id
          */
          scope.expandCollapseProgrammatically = function (id) {
            if (domContents[getDomContentsIndex(id)].obj.className.indexOf('expanded') != -1) {
              collapseProgrammatically(id);
            }
            else {
              expandProgrammatically(id);
            }
          };

          /*
            * @ngdoc function
            * @name collapseProgrammatically
            * @description collapses an element programmatically including its childs
            * @param {String} id
          */
          var collapseProgrammatically = function (id) {
            if (domContents[getDomContentsIndex(id)].obj.className.indexOf('expanded') != -1) {
              closeOpenChilds(domContents, id);
              toggleClass(domContents[getDomContentsIndex(id)], 'expanded');
              toggleClass(domHeaders[getDomContentsIndex(id)], 'active-header');
              //console.log('sacCollapseStart ' + currentExpanded);
              scope.$emit('sacCollapseStart', currentExpanded);
              currentExpanded = getParentId(id);
            }
          }

          /*
            * @ngdoc function
            * @name expandByLevel
            * @description sets a timeout that expands an element by its level
            * @param {Object} domContent
            * @param {Object} domHeader
            * @param {Integer} levelFix
          */
          var expandByLevel = function (domContent, domHeader, levelFix) {
            $timeout(function () {
              toggleClass(domContent, 'expanded');
              toggleClass(domHeader, 'active-header');
            }, scope.accordionConfig.animDur * (getLevel(domContent.id) - 1 + levelFix));
          }

          /*
            * @ngdoc function
            * @name collapseAll
            * @description closes the accordion
          */
          var collapseAll = function () {
            currentExpanded = '0';
            for (var i = domContents.length - 1; i >= 0; i--) {
              if (domContents[i].obj.className.indexOf('expanded') > -1) {
                toggleClass(domContents[i], 'expanded');
                toggleClass(domHeaders[i], 'active-header');
              }
            }
          };

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
          scope.$on('sacExpandAll', function (event, data) {
            if (!scope.accordionConfig.autoCollapse) {
              for (var i = 0; i <= domContents.length - 1; i++) {
                if (domContents[i].obj.className.indexOf('expanded') == -1) {
                  expandByLevel(domContents[i], domHeaders[i], 0);
                }
              }
            }
            event.defaultPrevented = true;
          });

          /*
            * @ngdoc event
            * @name sacExpandContentById
            * @description expands a content a all its parents given its id
          */
          scope.$on('sacExpandContentById', function (event, id) {
            expandProgrammatically(id);
            event.defaultPrevented = true;
          });

          /*
            * @ngdoc event
            * @name sacCollapseContentById
            * @description collapses a content a all its children given its id
          */
          scope.$on('sacCollapseContentById', function (event, id) {
            collapseProgrammatically(id);
            event.defaultPrevented = true;
          });
        }
      };
    }]);
}());