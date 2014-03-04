jLight
======

Lightweight jQuery replacement compatible with Backbone.js. Current size: 7.3k minified, 1.6K gzipped.

Objectives
----------

- Provide a lightweight jQuery alternative.
- Ensure Backbone.js compatibility by running Backbone's own tests.
- Use as much native JS code as possible to make this library lightweight.

Principles
----------

- Completeness: strive to implement all or most of jQuery methods.
- Efficiency: 99% of developers only make use of 10% of jQuery's functionalities. jLight is about concentrating only that 10%.
- Lightweight: favor lightweight, performant and intuitive code. If a feature is not likely to be used, then don't add it.
- Robust and well documented: all methods must be well tested and documented.

Supported jQuery methods
------------------------

- _add_
- *append*
- *appendTo*
- *attr*
- *css*
- *data*
- *empty*
- *eq*
- *find*
- *get*
- *has*
- *html*
- *is*
- *off*
- *on*
- *one*
- *parent*
- *remove*
- *toArray*
- *trigger*
- *val*

_Currently being implemented and/or not fully tested_
*Required by Backbone.js*

Supported Backbone version
--------------------------

- In progress

TODO
----

- Add backbone tests.
- Review which methods are strictly required by Backbone.
- Implement and test remaining jQuery methods.
- Documentation.
- GitHub project page.

Credit
------

- [kupriyanenko](https://github.com/kupriyanenko/jbone) for his wonderful repo which I used as boilerplate.
- [HubSpot](https://github.com/HubSpot/YouMightNotNeedjQuery) for inspiration on how to implement jQuery methods in a concise way.