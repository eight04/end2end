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
* Create ie polyfill or keep using css hack?
* Scroll spy.
* Enter key doesn't handled properly in dialog form on IE8.
* Add notify. (notify-brand, notify-content...)
* Dialog size.
* If using wrapped body?
* Support finally in dialog.
* Yes/No/Cancel dialog.
* New dialog implement? Use button, input's value to return! Remains `then()` behavior. Move keydown listener from modal to dialog. Also solve IE8 enter issue.

Refactor guide
--------------
* Use tag selector only in `reset.css`.
* Use class selector to create controls.
* Use universe selector to prevent over-specifying.
* Do not use extend.
