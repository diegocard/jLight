var
// cache previous versions
_$ = win.$,
_jLight = win.jLight,

// Quick match a standalone tag
rquickSingleTag = /^<(\w+)\s*\/?>$/,

// A simple way to check for HTML strings
// Prioritize #id over <tag> to avoid XSS via location.hash
rquickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

// Alias for function
slice = [].slice,
splice = [].splice,
keys = Object.keys,

// Alias for global variables
doc = document,

isString = function(el) {
    return typeof el === "string";
},
isObject = function(el) {
    return el instanceof Object;
},
isFunction = function(el) {
    return typeof el === "function";
},
jLight = function(element, data) {
    return new jLight.fn.init(element, data);
};

// set previous values and return the instance upon calling the no-conflict mode
jLight.noConflict = function() {
    win.$ = _$;
    win.jLight = _jLight;

    return jLight;
};

jLight.fn = jLight.prototype = {
    init: function(element, data) {
        var elements, tag, wraper, fragment;

        if (isString(element)) {
            // Create single DOM element
            if (tag = rquickSingleTag.exec(element)) {
                this[0] = doc.createElement(tag[1]);
                this.length = 1;

                if (isObject(data)) {
                    this.attr(data);
                }

                return this;
            }
            // Create DOM collection
            else if ((tag = rquickExpr.exec(element)) && tag[1]) {
                fragment = doc.createDocumentFragment();
                wraper = doc.createElement("div");
                wraper.innerHTML = element;
                while (wraper.lastChild) {
                    fragment.appendChild(wraper.firstChild);
                }
                elements = slice.call(fragment.childNodes);

                return jLight.merge(this, elements);
            }
            // Find DOM elements with querySelectorAll
            else {
                if (jLight.isElement(data)) {
                    return jLight(data).find(element);
                }

                try {
                    elements = slice.call(doc.querySelectorAll(element));

                    return jLight.merge(this, elements);
                } catch (e) {
                    return this;
                }
            }
        }
        // Run function
        else if (isFunction(element)) {
            return element();
        }
        // Return jLight element as is
        else if (element instanceof jLight) {
            return element;
        }
        // Return element wrapped by jLight
        else if (element) {
            element = Array.isArray(element) ? element : [element];
            return jLight.merge(this, element);
        }

        return this;
    },

    pop: [].pop,
    push: [].push,
    reverse: [].reverse,
    shift: [].shift,
    sort: [].sort,
    splice: [].splice,
    slice: [].slice,
    indexOf: [].indexOf,
    forEach: [].forEach,
    unshift: [].unshift,
    concat: [].concat,
    join: [].join,
    every: [].every,
    some: [].some,
    filter: [].filter,
    map: [].map,
    reduce: [].reduce,
    reduceRight: [].reduceRight,
    length: 0
};

jLight.fn.constructor = jLight;

jLight.fn.init.prototype = jLight.fn;

jLight.setId = function(el) {
    var jid = el.jid;

    if (el === win) {
        jid = "window";
    } else if (el.jid === undefined) {
        el.jid = jid = ++jLight._cache.jid;
    }

    if (!jLight._cache.events[jid]) {
        jLight._cache.events[jid] = {};
    }
};

jLight.getData = function(el) {
    el = el instanceof jLight ? el[0] : el;

    var jid = el === win ? "window" : el.jid;

    return {
        jid: jid,
        events: jLight._cache.events[jid]
    };
};

jLight.isElement = function(el) {
    return el instanceof jLight || el instanceof HTMLElement || isString(el);
};

jLight._cache = {
    events: {},
    jid: 0
};
