/*!
 * jLight v0.0.1 - 2014-03-04 - Lightweight jQuery replacement compatible with Backbone.js
 *
 * https://github.com/diegocard/jLight
 *
 * Copyright 2014 Diego Cardozo
 * Released under the MIT license.
 */

(function (win) {

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

jLight.merge = function(first, second) {
    var l = second.length,
        i = first.length,
        j = 0;

    while (j < l) {
        first[i++] = second[j++];
    }

    first.length = i;

    return first;
};

jLight.contains = function(container, contained) {
    var result;

    container.reverse().some(function(el) {
        if (el.contains(contained)) {
            return result = el;
        }
    });

    return result;
};

jLight.extend = function(target) {
    var k, kl, i, tg;

    splice.call(arguments, 1).forEach(function(object) {
        if (!object) {
            return;
        }

        k = keys(object);
        kl = k.length;
        i = 0;
        tg = target; //caching target for perf improvement

        for (; i < kl; i++) {
            tg[k[i]] = object[k[i]];
        }
    });

    return target;
};

function LightEvent(e, data) {
    var key, setter;

    this.originalEvent = e;

    setter = function(key, e) {
        if (key === "preventDefault") {
            this[key] = function() {
                this.defaultPrevented = true;
                return e[key]();
            };
        } else if (isFunction(e[key])) {
            this[key] = function() {
                return e[key]();
            };
        } else {
            this[key] = e[key];
        }
    };

    for (key in e) {
        if (e.hasOwnProperty(key) || typeof e[key] === "function") {
            setter.call(this, key, e);
        }
    }

    jLight.extend(this, data);
}

jLight.Event = function(event, data) {
    var namespace, eventType;

    if (event.type && !data) {
        data = event;
        event = event.type;
    }

    namespace = event.split(".").splice(1).join(".");
    eventType = event.split(".")[0];

    event = doc.createEvent("Event");
    event.initEvent(eventType, true, true);

    return jLight.extend(event, {
        namespace: namespace,
        isDefaultPrevented: function() {
            return event.defaultPrevented;
        }
    }, data);
};

jLight.fn.on = function(event) {
    var args = arguments,
        length = this.length,
        i = 0,
        callback, target, namespace, fn, events, eventType, expectedTarget, addListener;

    if (args.length === 2) {
        callback = args[1];
    } else {
        target = args[1], callback = args[2];
    }

    addListener = function(el) {
        jLight.setId(el);
        events = jLight.getData(el).events;
        event.split(" ").forEach(function(event) {
            eventType = event.split(".")[0];
            namespace = event.split(".").splice(1).join(".");
            events[eventType] = events[eventType] || [];

            fn = function(e) {
                if (e.namespace && e.namespace !== namespace) {
                    return;
                }

                expectedTarget = null;
                if (!target) {
                    callback.call(el, e);
                } else if (~jLight(el).find(target).indexOf(e.target) || (expectedTarget = jLight.contains(jLight(el).find(target), e.target))) {
                    expectedTarget = expectedTarget || e.target;
                    e = new LightEvent(e, {
                        currentTarget: expectedTarget
                    });

                    callback.call(expectedTarget, e);
                }
            };

            events[eventType].push({
                namespace: namespace,
                fn: fn,
                originfn: callback
            });

            el.addEventListener && el.addEventListener(eventType, fn, false);
        });
    };

    for (; i < length; i++) {
        addListener(this[i]);
    }

    return this;
};

jLight.fn.one = function(event) {
    var args = arguments,
        i = 0,
        length = this.length,
        callback, target, addListener;

    if (args.length === 2) {
        callback = args[1];
    } else {
        target = args[1], callback = args[2];
    }

    addListener = function(el) {
        event.split(" ").forEach(function(event) {
            var fn = function(e) {
                jLight(el).off(event, fn);
                callback.call(el, e);
            };

            if (!target) {
                jLight(el).on(event, fn);
            } else {
                jLight(el).on(event, target, fn);
            }
        });
    };

    for (; i < length; i++) {
        addListener(this[i]);
    }

    return this;
};

jLight.fn.trigger = function(event) {
    var events = [],
        i = 0,
        length = this.length,
        dispatchEvents;

    if (!event) {
        return this;
    }

    if (isString(event)) {
        events = event.split(" ").map(function(event) {
            return jLight.Event(event);
        });
    } else {
        event = event instanceof Event ? event : $.Event(event);
        events = [event];
    }

    dispatchEvents = function(el) {
        events.forEach(function(event) {
            if (!event.type) {
                return;
            }

            el.dispatchEvent && el.dispatchEvent(event);
        });
    };

    for (; i < length; i++) {
        dispatchEvents(this[i]);
    }

    return this;
};

jLight.fn.off = function(event, fn) {
    var i = 0,
        length = this.length,
        removeListener = function(events, eventType, index, el, e) {
            var callback;

            // get callback
            if ((fn && e.originfn === fn) || !fn) {
                callback = e.fn;
            }

            if (events[eventType][index].fn === callback) {
                el.removeEventListener(eventType, callback);

                // remove handler from cache
                delete jLight._cache.events[jLight.getData(el).jid][eventType][index];
            }
        },
        events, namespace, eventType, removeListeners;

    removeListeners = function(el) {
        events = jLight.getData(el).events;

        if (!events) {
            return;
        }

        event.split(" ").forEach(function(event) {
            eventType = event.split(".")[0];
            namespace = event.split(".").splice(1).join(".");

            // remove named events
            if (events[eventType]) {
                events[eventType].forEach(function(e, index) {
                    if (!namespace || (namespace && e.namespace === namespace)) {
                        removeListener(events, eventType, index, el, e);
                    }
                });
            }
            // remove all namespaced events
            else if (namespace) {
                keys(events).forEach(function(eventType) {
                    events[eventType].forEach(function(e, index) {
                        if (e.namespace.split(".")[0] === namespace.split(".")[0]) {
                            removeListener(events, eventType, index, el, e);
                        }
                    });
                });
            }
        });
    };

    for (; i < length; i++) {
        removeListeners(this[i]);
    }

    return this;
};

jLight.fn.find = function(selector) {
    var results = [],
        i = 0,
        length = this.length,
        finder;

    finder = function(el) {
        if (isFunction(el.querySelectorAll)) {
            [].forEach.call(el.querySelectorAll(selector), function(found) {
                results.push(found);
            });
        }
    };

    for (; i < length; i++) {
        finder(this[i]);
    }

    return jLight(results);
};

jLight.fn.get = function(index) {
    return this[index];
};

jLight.fn.eq = function(index) {
    return jLight(this[index]);
};

jLight.fn.parent = function() {
    var results = [], parent;

    this.forEach(function(el) {
        if (!~results.indexOf(parent = el.parentElement) && parent) {
            results.push(parent);
        }
    });

    return jLight(results);
};

jLight.fn.toArray = function() {
    return slice.call(this);
};

jLight.fn.is = function() {
    var args = arguments;

    return this.some(function(el) {
        return el.tagName.toLowerCase() === args[0];
    });
};

jLight.fn.has = function() {
    var args = arguments;

    return this.some(function(el) {
        return el.querySelectorAll(args[0]).length;
    });
};

jLight.fn.attr = function(key, value) {
    var args = arguments,
        i = 0,
        length = this.length,
        setter;

    if (isString(key) && args.length === 1) {
        return this[0].getAttribute(key);
    }

    if (args.length === 2) {
        setter = function(el) {
            el.setAttribute(key, value);
        };
    } else if (isObject(key)) {
        setter = function(el) {
            keys(key).forEach(function(name) {
                el.setAttribute(name, key[name]);
            });
        };
    }

    for (; i < length; i++) {
        setter(this[i]);
    }

    return this;
};

jLight.fn.val = function(value) {
    var i = 0,
        length = this.length;

    if (arguments.length === 0) {
        return this[0].value;
    }

    for (; i < length; i++) {
        this[i].value = value;
    }

    return this;
};

jLight.fn.css = function(key, value) {
    var args = arguments,
        i = 0,
        length = this.length,
        setter;

    // Get attribute
    if (isString(key) && args.length === 1) {
        return win.getComputedStyle(this[0])[key];
    }

    // Set attributes
    if (args.length === 2) {
        setter = function(el) {
            el.style[key] = value;
        };
    } else if (isObject(key)) {
        setter = function(el) {
            keys(key).forEach(function(name) {
                el.style[name] = key[name];
            });
        };
    }

    for (; i < length; i++) {
        setter(this[i]);
    }

    return this;
};

jLight.fn.data = function(key, value) {
    var args = arguments, data = {},
        i = 0,
        length = this.length,
        setter,
        setValue = function(el, key, value) {
            if (isObject(value)) {
                el.jdata = el.jdata || {};
                el.jdata[key] = value;
            } else {
                el.dataset[key] = value;
            }
        },
        getValue = function(value) {
            if (value === "true") {
                return true;
            } else if (value === "false") {
                return false;
            } else {
                return value;
            }
        };

    // Get data
    if (args.length === 0) {
        this[0].jdata && (data = this[0].jdata);

        keys(this[0].dataset).forEach(function(key) {
            data[key] = getValue(this[0].dataset[key]);
        }, this);

        return data;
    } else if (args.length === 1 && isString(key)) {
        return getValue(this[0].dataset[key] || this[0].jdata && this[0].jdata[key]);
    }

    // Set data
    if (args.length === 1 && isObject(key)) {
        setter = function(el) {
            keys(key).forEach(function(name) {
                setValue(el, name, key[name]);
            });
        };
    } else if (args.length === 2) {
        setter = function(el) {
            setValue(el, key, value);
        };
    }

    for (; i < length; i++) {
        setter(this[i]);
    }

    return this;
};

jLight.fn.html = function(value) {
    var args = arguments,
        el;

    // add HTML into elements
    if (args.length === 1 && value !== undefined) {
        return this.empty().append(value);
    }
    // get HTML from element
    else if (args.length === 0 && (el = this[0])) {
        return el.innerHTML;
    }

    return this;
};

jLight.fn.add = function(selector) {
  // TODO: Review, finish, write tests
  this.concat(jLight(selector));
  return this;
};

jLight.fn.append = function(appended) {
    var i = 0,
        length = this.length,
        setter;

    if (isString(appended) && rquickExpr.exec(appended)) {
        appended = jLight(appended);
    } else if (!isObject(appended)) {
        appended = document.createTextNode(appended);
    }

    if (appended instanceof jLight) {
        setter = function(el, i) {
            appended.forEach(function(node) {
                if (i) {
                    el.appendChild(node.cloneNode());
                } else {
                    el.appendChild(node);
                }
            });
        };
    } else if (appended instanceof Node) {
        setter = function(el) {
            el.appendChild(appended);
        };
    }

    for (; i < length; i++) {
        setter(this[i], i);
    }

    return this;
};

jLight.fn.appendTo = function(to) {
    jLight(to).append(this);

    return this;
};

jLight.fn.empty = function() {
    var i = 0,
        length = this.length,
        el;

    for (; i < length; i++) {
        el = this[i];

        while (el.lastChild) {
            el.removeChild(el.lastChild);
        }
    }

    return this;
};

jLight.fn.remove = function() {
    var i = 0,
        length = this.length,
        el;

    for (; i < length; i++) {
        el = this[i];

        delete jLight._cache.events[el.jid];

        el.jdata = {};
        el.parentNode && el.parentNode.removeChild(el);
    }

    return this;
};

if (typeof module === "object" && module && typeof module.exports === "object") {
    // Expose jLight as module.exports in loaders that implement the Node
    // module pattern (including browserify). Do not create the global, since
    // the user will be storing it themselves locally, and globals are frowned
    // upon in the Node module world.
    module.exports = jLight;
}
// Register as a AMD module
else if (typeof define === "function" && define.amd) {
    define(function() {
        return jLight;
    });
}

if (typeof win === "object" && typeof win.document === "object") {
    win.jLight = win.$ = jLight;
}

}(window));
