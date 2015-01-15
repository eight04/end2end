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
* Use content box on table?
* Apply style on plain list.
* Move out IE8 hack rules?
* Move CSS reset into component?
* Move theme into component?
* Drop extend? Too many bugs with it.
* Edit space between checkbox and legend.
* Corner overflow of progress bar.
* Min, max validator doesn't work in IE8.
* Number validator doesn't work in IE8.
* Firefox persist scrollbar position. This cause problem on affix.
* Need better way to seperate theme files.
* Add component set service.
* input-group button text overflow.

Known bugs
----------
* Enter key won't be handled properly in dialog form on IE8.
* Double scrollbar issue of scrollable modal.
* IE 9+ overflow, border-radius, and position bug(http://x.co/65DI4). The table-fixed-head corner issue at affix-bottom.
* Chrome bug with table-fixed. Fixed by triggering redraw manually.
* Chrome bug with flex and overflow: auto. Fixed by triggering redraw with animation.

The standard
------------
* Use `min-width:@window-size` and `max-width:(@window-size - 1)`.
