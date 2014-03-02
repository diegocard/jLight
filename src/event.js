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
