#**sirAccordion** for AngularJS

**VERSION 1 RELEASED!**

Awesome dynamic, recursive, customizable and multilevel **Accordion Menu** for **AngurlarJS**, that builds up from a **JSON object** and an optional configuration object.
**You can download the project for a live demo in the example folder (don't forget to bower install dependencies) and for better understanding.**

##[sir Accordion Online Demo](http://sirideas.github.io/sirAccordion/)

        bower install sir-accordion

##**Features**

*   **Dynamic content:** if the scope that contains the JSON object is update the accordion updates too.
*   **Responsive:** The item height adjust to the content and is responsive; the width of the accodion adjusts to 100% of the wrapper tag.
*   **Easy use AngularJS Directive:** you just need to add the js and css files, add the *'sir-accordion'* module to the AngularJS app and call the directive like this:

        //Code for the html directive
        <div sir-accordion collection="collection" config="accordionConfig"></div>

        //Code for the Angular module
        .module('mainModule', ['sir-accordion'])
* **JSON object**: the content of the accordion will be set by a JSON following the next structure where `subCollection` is an object of the same structure that will have more items to expand/collapse inside, `topContent` will be the content on top of that subCollection and `botomContent` will be after the subCollection items.

        //JSON object model
        $scope.collection = 
        [{"title":"Level 1 header","topContent":"","bottomContent":"","subCollection":[]}]; 
*   **Customizable:** you can customize by a config `$scope` like this:

        $scope.accordionConfig = {
            debug: false, //For developing
            animDur: 300, //Animations duration minvalue is 0
            expandFirst: false, //Auto expand first item
            autoCollapse: true, //Auto collapse item flag
            watchInternalChanges: false, //watch internal attrs of the collection (false if not needed)
            headerClass: '', //Adding extra class for the headers
            beforeHeader: '', //Adding code or text before all the headers inner content
            afterHeader: '', //Adding code or text after all the headers inner content
            topContentClass: '', //Adding extra class for topContent
            beforeTopContent: '', //Adding code or text before all the topContent if present on item
            afterTopContent: '', //Adding code or text after all the topContent if present on item
            bottomContentClass: '', //Adding extra class for topContent
            beforeBottomContent: '', //Adding code or text before all the topContent if present on item
            afterBottomContent: '' //Adding code or text before all the topContent if present on item
        };
*   **Isolated Scope:** The directive has an isolated scope but you can pass any scope you'll need to handle inside the accordion   with the 'data' attr. 
*   **MultiLevel:** the recursive algoritm allows to add as many levels to the accordion as you would like to.
*   **VelocityJS:** sirAccordion uses [VelocityJS](https://github.com/julianshapiro/velocity) for the slide up and down animations.
*   **ie8 Compatible:** please kill ie8.
*   **No jQuery** dependency.
*   **Bower installable package**. To install from bower use `bower install sir-accordion`.
*   **Events**.
    *   When the accordion is donde loading you can catch the event like this `$scope.$on('sacDoneLoading', function ($event) {})`.
    *   When an element is expanded `sacExpandStart` and `sacExpandEnd` are emitted with the coordinates of the element.
    *   When an element is collapsed `sacCollapseStart` and `sacCollapseEnd` are emitted with the coordinates of the element.
    *   For expanding any content from your AngularJs App `$scope.$broadcast('sacExpandContentById','1-1-3')` where the second parameter is the content coordinates.
    *   For collapsing any content from your AngularJs App `$scope.$broadcast('sacCollapseContentById','1-1-3')` where the second parameter is the content coordinates.
    *   For collapsing all contents `$scope.$broadcast('sacCollapseAll');`
    *   When autoCollapse is `false` you can trigger this event too `$scope.$broadcast('sacExpandAll');`.

##**Dependencies**
*   AngularJS
*   VelocityJS

##**Currently working on**
*   Saving current state of the accordion

##**Known issues**
*   No option for mantaining current state of the accordion when updating the collection.

##**Changelog**

###V1.2.2
*   New events `sacExpandStart` and `sacExpandEnd`, emitting every time a content expands.
*   New events `sacCollapseStart` and `sacCollapseEnd`, emitting every time a content collapses.

###V1.2.1
*   New `sir-accordion-leaf` class to `sir-accordion-content` if is a leaf element

###V1.2.0
*   Fixes issue when using multiple instances of sirAccordion

###V1.1.1
*   Fixed issue where animations jumped a little in Microsoft Edge

###V1.1.0
*   Updated sir-accordion.min.js
*   Fixed issue when using siraccordion on an app with jquery
*   Collapsed content no longer has `display: none`

###V1.0.0
*   Now with VelocityJS with faster and no buggy animations even on safari.
*   New event `collapseById`.
*   Code simplified (A LOT).
*   Bug fixes.
*   Autocollapse can be toggled on runtimes.
*   Improved expand and collapse single content and all contents algoritm.
*   AnimDur can be set as low as 0.
*   Suport for expandFirst.
*   **Breaking changes**
    *   Changed some accordion config object attrs (see above).

###V0.9.6
*   Added optional attr 'data' for when you want access to a scope from a parent controller in a custom module inside the accordion directive (since the accordion directive has an isolated scope)

###V0.9.5
*   Code cleaning.
*   Now when the accordion finishes loading it emits **sacDoneLoading** event for better handling postloading code. 
*   New event for expanding any content **sacExpandContentById** any given time (after sacDoneLoading event).
*   Bug fixes.
*   Code comments.
*   **Breaking changes**
    *   **Directive new name**: sirAccordion (old was sirNgAccordion).
    *   **Event new name**: sacCollapseAll (old was collapseAll).
    *   **Event new name**: sacExpandAll (old was ExpandAll).


###V0.9.4
*   Fixed bower version number.
*   Readme Updated.

###V0.9.3
*   Fixed issue where updating the collection results in watchers creating over and over again.

###V0.9.2
*   Fixed accordion not updating when changing internal attribute of the collection (now as an option 'watchInternalChanges', should be false if not needed for better performance).

###V0.9.1
*   Fixed issue when the accordion's width changes and autoCollapse is disabled, the height was not setting to auto to all the contents except the last opened.

###V0.9.0

*   Updated demo page.
*   Flag for auto collapse now working.
*   Animation now customizable (min value is 200 ms, any lower should disable animations).
*   Code optimized.
*   Core algoritm changed.

###V0.8.2

*   Readme updated.
*   Fixed issue when sir-accordion-group objects would not get 100% width.

###V0.8.1

*   Fixed bug where couldn't get event.currentTarget when header was clicked.

###V0.8.0

*   Dinamic height of the contents for responsive behavor.
*   Clicking a currently animating header has no effect, no longer results on height misscalculation
*   Code organized.
*   Fixed bug when the accordion gets a grong height from the content (overflow:auto added).

###V0.6.1

*   Work on animations.
*   Updated demo page.

###V0.5.1

*   SubCollection array empty validation.
*   Fix bug when jQuery is not present.
*   Dependencies Fix.
*   Now with demo app.

###V0.5.0

*   Current work added to github.

