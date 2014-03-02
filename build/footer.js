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
