#**sirAccordion** for AngularJS
----------
Awesome dynamic, recursive, customizable and multilevel **Accordion Menu** for **AngurlarJS**, that builds up from a **JSON object** and an optional configuration object.
**You can download the project for a live demo in the example folder (don't forget to bower install dependencies) and for better understanding.**
##**Features**
----------
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
            animation: true, //Animations flag (currently always true)
            expandFirst: false, //Auto expand first item (currently not supported)
            autoCollapse: true, //Auto collapse item flag (currently always on)
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
----------
*   AngularJS
##**Know issues**
----------
##**Changelog**
----------
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

