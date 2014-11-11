end2end
=======
This project were inspired by Bootstrap, a css framework containing grid system, bunch of components and more. So I try to make my own css framework with AngularJS.

Demo page
---------
<https://rawgit.com/eight04/end2end/master/example/demo.html>

Features
--------
* IE8 support.
* Responsive layout.
* Richer layout with flex and inline-block.
* Angular animation on modern browser (IE10+).
* Bootstrap components rewrote in Angular.

Todos
-----
* Add more components.
* Refactor those messy less.
* Use margin-top only?
* Justify grid?
* Change how navs work. Use toggler instead.
* Deprecate modal directive
* Create ie polyfill or keep using css hack?
* Fix modal animate bug.
* Add disabled form control.
* Handle disabled control in modal dialog.

Components
----------
* Add dialog service.
* Scroll spy.

Refactor guide
--------------
* Use tag selector only in `reset.css`.
* Use class selector to create controls.
* Use universe selector to prevent over-specifying.
* Do not use extend.
