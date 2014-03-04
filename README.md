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

- Completeness: strive to implement all or most of jQuery methods
- Alternative: jQuery methods might not be implemented in the same way. Some edge cases might not be considered in favor of concise and intuitive coding.
- Robustness: all methods should be tested and documented.

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