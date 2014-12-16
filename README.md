end2end
=======
This project was inspired by Bootstrap, a css framework containing grid system, bunch of components and more.

Demo page
---------
<https://rawgit.com/eight04/end2end/master/example/demo.html>

Features
--------
* IE8 support.
* Responsive layout.
* A rich grid system built with flex and inline-block.
* Angular animation on modern browser (IE10+).
* Bootstrap's components rewrote in Angular.

Todos
-----
* Add more components.
* Refactor those messy less.
* Use margin-top only?
* Create ie polyfill or keep using css hack?
* Enter key doesn't handled properly in dialog form on IE8.
* Add table item.
* Don't focus on button if user use custom template on dialog?
* One-line vertical align issue.

Known bugs
----------
* Enter key won't be handled properly in dialog form on IE8.
* Double scrollbar issue of scrollable modal.

The standard
------------
* Use `min-width:@window-size` and `max-width:(@window-size - 1)`.
