#**sirAccordion** for AngularJS

Awesome dynamic, recursive, customizable and multilevel **Accordion Menu** for **AngurlarJS**, that builds up from a **JSON object** and an optional configuration object.
**You can download the project for a live demo in the example folder (don't forget to bower install dependencies) and for better understanding.**

##[sir Accordion Online Demo](http://sirideas.github.io/sirAccordion/)

##**Features**

*   **Dynamic content:** if the scope that contains the JSON object is update the accordion updates too.
*   **Responsive:** The item height adjust to the content and is responsive; the width of the accodion adjusts to 100% of the wrapper tag.
*   **Easy use AngularJS Directive:** you just need to add the js and css files, add the *'sir-accordion'* module to the AngularJS app call the directive like this:

        //Code for the html directive
        <div sir-ng-accordion collection="collection" config="accordionConfig"></div>
* **JSON object**: the content of the accordion will be set by a JSON following the next structure where `subCollection` is an object of the same structure that will have more items to expand/collapse inside, `topContent` will be the content on top of that subCollection and `botomContent` will be after the subCollection items.

        //JSON object model
        $scope.collection = 
        [{"title":"Level 1 header","topContent":"","bottomContent":"","subCollection":[]}]; 
*   **Customizable:** you can customize by a config `$scope` like this:

        $scope.accordionConfig = {
            debug: false, //For developing
            animDur: 300, //Animations flag (**< 200 for disabling animations**)
            expandFirst: false, //Auto expand first item (currently not supported)
            autoCollapse: true, //Auto collapse item flag
            watchInternalChanges: true, //checks internal attr of the collection (false if not needed)
            headerClass: '', //Adding extra class for the headers
            preHeader: '', //Adding code or text before all the headers inner content
            postHeader: '', //Adding code or text after all the headers inner content
            topContentClass: '', //Adding extra class for topContent
            preTopContent: '', //Adding code or text before all the topContent if present on item
            postTopContent: '', //Adding code or text after all the topContent if present on item
            bottomContentClass: '', //Adding extra class for topContent
            preBottomContent: '', //Adding code or text before all the topContent if present on item
            postBottomContent: '' //Adding code or text before all the topContent if present on item
        };
*   **MultiLevel:** the recursive algoritm allows to add as many levels to the accordion as you would like to.
*   **CSS animations:** awesome css animations for collapsing and expanding items (optional).
*   **ie8 Compatible:** please kill ie8.
*   **No jQuery** dependency.
*   **Bower installable package**. To install from bower use `bower install sir-accordion`.

##**Dependencies**
*   AngularJS

##**Currently working on**
*   Animations performance.

##**Known issues**
*   No option for mantaining current state of the accordion when updating the collection.
*   In Safari, animations won't work 100%, sometimes when closing a level 1 content it won't animate.

##**Changelog**

###V0.9.2
*   Fixed accordion not updating when changing internal attribute of the collection (now as an option 'watchInternalChanges', should be false if not needed for better performance).

###V0.9.1
*   Fixed issue when the accordion's width changes and autoCollapse is disabled, the height was not setting to auto to all the contents except the last opened.

###V0.9.0

*   Updated demo page
*   Flag for auto collapse now working
*   Animation now customizable (min value is 200 ms, any lower should disable animations)
*   Code optimized
*   Core algoritm changed

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

