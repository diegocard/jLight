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
