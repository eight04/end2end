end2end
=======
This project was inspired by Bootstrap, a css framework containing grid system, bunch of components and more.

Demo page
---------
<https://rawgit.com/eight04/end2end/master/example/demo.html>

Features
--------
* Responsive layout.
* A grid system built with flex and inline-block.
* Angular animation on modern browser.
* Bootstrap's components rewrote in Angular.

Dependencies
------------
* Angular 1.2.x.
* Angular Animate 1.2.x. (Optional)

Support Browsers
----------------
* IE8+.
* Firefox latest.
* Google Chrome latest.
* Opera Presto latest.
* Opera Blink latest.

Old IE Issues
-------------
* IE9- doesn't support CSS3 animation.
* IE8 doesn't support round corner.
* IE8 doesn't support media query, but you can use [repond.js][respond-js] polyfill.

[respond-js]: https://github.com/scottjehl/Respond

Todos
-----
* Add more components.
* Refactor those messy less.
* Use margin-top only?
* Create ie polyfill or keep using css hack?
* Enter key doesn't handled properly in dialog form on IE8.
* Add table item.
* Don't focus on button if user use custom template on dialog? Or make it configurable.
* One-line vertical align issue.
* Use content box on table?
* Move out IE8 hack rules?
* Move CSS reset into component?
* Move theme into component?
* Drop extend? Too many bugs with it.
* Edit space between checkbox and legend.
* Corner overflow of progress bar.
* Min, max validator doesn't work in IE8.
* Number validator doesn't work in IE8.
* Need better way to seperate theme files.
* Add ani-collapse-children?
* Double scrollbar issue of scrollable modal.
* Extra padding-left of select element.
* Support Opera 12.17?
	- Table fixed.
* Add popup.
	- Trigger by hovering?
	- How to interact with modal?
	- How to manage z-index?
* Fix table header transclude problem.
* Add `parentScope` option to dialog.

Annoying bugs note
------------------
* IE 9+ overflow, border-radius, and position bug(http://x.co/65DI4). The table-fixed-head corner issue at affix-bottom.
* Chrome bug with table-fixed. Fixed by triggering redraw manually.
* Chrome bug with flex and overflow: auto. Fixed by triggering redraw with animation.
* Flexbox in Opera is buggy. If you mix flexbox and table together, Opera might even crash.

Other notes
-----------
* Use `min-width:@window-size` and `max-width:(@window-size - 1)` to avoid flickering.
