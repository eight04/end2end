end2end
=======
Rollback to inline-block's css framework!

Goal
----
* IE8 support.
* Responsive layout.
* Only use animation on modern nrowser. (CSS3)
* Every clickable widget should have hover, focus, active style.
* inline-form.

Known Issue
-----------
* Input[type="text"] in IE8 (Wrong line height) and Chrome (Wrong caret position).
* Fixed navbar overflow issue?
* Breaking point issue. (Some widget use min-width, some widget use max-width). To avoid this, use `widow-size - 1px` on `max-width`

Todos
-----
* Add common components.
* <del>Add fixed navbar.</del> Done.
* Angular support.
* <del>Add push/pull.</del> Done.
* <del>Add sidebar component.</del> Done.
* Add link-pool component.
* Add affix component.
* Split default style from tag selector.

Naming convention
-----------------
* Reusable mixins always prefixed with `.make-`.
* Extendable always suffixed with `-base`.
* Use extend to style.
* Use mixin to layout.

Note
----
If you want to manupolate DOM, write main function in directive controller, and port main functions to Service object.

There is a width bug in bootstrap Affix, any idea use css to fix it without giving sidebar a fix width?

It's a mess if you use mixins and extend all together. They will generate bunch of selector every where.

Before using extend(), think twice. If this class will be write more than one time, use mixin instead.

Do not extend with...

* Never extend a &lt;tag>, since you will write them everywhere.
* Never extend a .component, since you will write them often to style them.
* Never extend a .mixin().
* Never extend a @media-base class. You want to write them in different condition.

Do extend with...

+ Extend a normalizing-class, like margin: 0; padding: 0;.
+ Extend a base type. Eg, extend .animal to .animal-bear.
+ Extend a base-component,