describe('jLight Event', function() {

    after(function() {
        $('#app').empty();
    });

    it('Initialized', function() {
        expect(jLight().trigger).to.be.a('function');
        expect(jLight().off).to.be.a('function');
        expect(jLight().on).to.be.a('function');
        expect(jLight().one).to.be.a('function');
    });

    it('on() off() trigger() initialized', function() {
        var a = jLight('<a>'),
            w = jLight(window),
            fn = function() {};

        a.on('click.test', fn);
        w.on('click.w', fn);

        expect(jLight.getData(a).events.click).to.have.length(1);
        expect(jLight.getData(a).events.click[0]).to.have.property('namespace', 'test');
        expect(jLight.getData(a).events.click[0]).to.have.property('originfn', fn);
        expect(jLight.getData(a).events.click[0].fn).to.be.a('function');

        expect(jLight.getData(w)).to.have.property('jid', 'window');
        expect(jLight.getData(w).events.click.length).be.above(0);
    });

    it('null or undefined handler', function() {
        jLight('<a>').on('click', null);
        jLight('<a>').on('click', undefined);
    });

    it('on(event.namespace, callback) and namespaces works correctly', function() {
        var div = jLight('<div>'),
            counter = 0;

        div.on('focusout.b', function(e) {
            counter++;
            expect(e).to.have.property('type', 'focusout');
        }).on('focusin.a', function(e) {
            counter++;
            expect(e).to.have.property('namespace', 'a');
            expect(e).to.have.property('type', 'focusin');
        });

        div.trigger('focusin.a').trigger('focusout.b');
        div.trigger('').trigger().trigger('.b').trigger('focusout.c'); // no event
        div.trigger('focusout');

        expect(counter).be.eql(3);
    });

    it('on(event, callback) with same function', function() {
        var div = jLight('<div>'), counter = 0, func = function() {
            counter++;
        };

        div.on('foo.bar', func).on('foo.zar', func);
        div.trigger('foo.bar');

        expect(counter).be.eql(1, 'Verify binding function with multiple namespaces.');

        div.off('foo.bar', func).off('foo.zar', func);
        div.trigger('foo.bar');

        expect(counter).be.eql(1, 'Verify that removing events still work.');
    });

    it('on(multiple event, callback)', function() {
        var div = jLight('<div>'), counter = 0;

        div.on('foo bar', function() {
            counter++;
        });

        div.trigger('foo');
        expect(counter).be.eql(1);

        div.trigger('bar');
        expect(counter).be.eql(2);
    });

    it('on(event, target, callback)', function() {
        var a = jLight('<div><span></span></div>'),
            counter = 0;

        jLight('#app').html(a);

        a.on('click', 'span', function() {
            counter++;
        });

        a.trigger('click');
        expect(counter).be.eql(0);

        a.find('span').trigger('click');
        expect(counter).be.eql(1);

        a.find('span').off('click').trigger('click');
        expect(counter).be.eql(2);

        a.off('click').trigger('click');
        expect(counter).be.eql(2);
    });

    it('on(event, target, callback) with deep nesting', function() {
        var a = jLight('<div><span class="target"><input type="text" /></span><span class="target"><input type="text" /></span></div>'),
            counter = 0;

        jLight('#app').html(a);

        a.on('click', '.target', function() {
            counter++;
        });

        a.trigger('click');
        expect(counter).be.eql(0);

        a.find('input').eq(1).trigger('click');
        expect(counter).be.eql(1);

        a.find('input').trigger('click');
        expect(counter).be.eql(3);
    });

    it('on(event, target, callback) test right target and currentTarget', function() {
        var a = jLight('<div><span class="target"><input type="text" /></span><span class="target"></span><span class="target"></span></div>'),
            expectedTartget, expectedCurrentTartget;

        a.appendTo('#app');

        a.on('click', '.target', function(e) {
            expect(e.target).be.eql(expectedTartget);
            expect(e.currentTarget).be.eql(expectedCurrentTartget);
        });

        expectedCurrentTartget = a.find('.target')[0];

        expectedTartget = a.find('input')[0];
        a.find('input').trigger('click');

        expectedTartget = a.find('.target')[0];
        a.find('.target').eq(0).trigger('click');
    });

    it('on(event, target, callback) preventDefault', function() {
        var a = jLight('<div><span></span></div>'),
            counter = 0;

        jLight('#app').html(a);

        a.on('click', 'span', function(e) {
            expect(e.defaultPrevented).be.eql(false);
            e.preventDefault();

            expect(e.defaultPrevented).be.eql(true);
        });

        a.find('span').trigger('click');
    });

    it('one(event, callback)', function() {
        var div = jLight('<div>'), counter = 0, fn = function() {
            counter++;
        };

        div.one('click', fn);

        div.trigger('click').trigger('click');

        expect(counter).be.eql(1);

        var divs = jLight('<input><input>');

        divs.one('foo', fn);

        divs.eq(0).trigger('foo');
        divs.eq(1).trigger('foo');

        expect(counter).be.eql(3);
    });

    it('one(event, callback) with recursive call', function() {
        var a = jLight('<div>'), counter = 0;

        a.one('click', function() {
            counter++;
            a.one('click', function() {
                counter++;
            }).trigger('click');
        });
        a.trigger('click');

        expect(counter).be.eql(2);
    });

    it('one(event, target, callback)', function() {
        var a = jLight('<div><span></span></div>'),
            counter = 0;

        jLight('#app').html(a);

        a.one('click', 'span', function() {
            counter++;
        });

        a.trigger('click');
        expect(counter).be.eql(0);

        a.find('span').trigger('click');
        expect(counter).be.eql(1);

        a.trigger('click').find('span').trigger('click');
        expect(counter).be.eql(1);
    });

    it('one(event.namespace, callback)', function() {
        var div = jLight('<div>'),
            counter = 0;

        div.one('click.test', function(e) {
            counter++;
        });

        div.off('click.test');

        div.trigger('click');

        expect(counter).be.eql(0);
    });

    it('one(multiple event, callback)', function() {
        var div = jLight('<div>'), counter = 0;

        div.one('foo bar', function() {
            counter++;
        });

        div.trigger('foo').trigger('foo');
        expect(counter).be.eql(1);

        div.trigger('bar').trigger('bar');
        expect(counter).be.eql(2);
    });

    it('trigger() order', function() {
        var markup = jLight('<div><div><p><span><b>b</b></span></p></div></div>'),
            path = '';

        jLight('#app').append(markup);

        jLight('#app').find('*').on('click', function() {
            path += this.nodeName.toLowerCase() + ' ';
        });
        jLight('#app').find('b').on('click', function(e) {
            if (e.target === this) {
                jLight(this.parentNode).remove();
            }
        });

        markup.find('b').trigger('click');

        expect(path).be.eql('b span p div div ');
    });

    it('trigger() on element without handlers', function() {
        var div = jLight('<div>');

        div.trigger('click');
    });

    it('trigger(multiple event)', function() {
        var div = jLight('<div>'), counter = 0,
            fn = function() {
                counter++;
            };

        div.on('foo bar', function() {
            counter++;
        });

        div.trigger('foo bar false');
        expect(counter).be.eql(2);
    });

    it('off(event, fn) undeligate current function', function() {
        var a = jLight('<a>'), counter = 0,
            fn = function() {
                counter++;
            };

        a.on('click', fn);

        a.trigger('click');
        expect(counter).be.eql(1);

        a.off('click', function() {}).trigger('click');
        expect(counter).be.eql(2);

        a.off('click', fn).trigger('click');
        expect(counter).be.eql(2);
    });

    it('off(event.namespace) namespaces works correctly', function() {
        var a = jLight('<a>'),
            counter = 0;

        a.on('click', function() {
            counter++;
        }).on('click.test', function() {
            counter++;
        });

        a.trigger('click').trigger('click');
        expect(counter).be.eql(4);

        a.off('.test');
        a.trigger('click');
        expect(counter).be.eql(5);

        a.off('click');
        a.trigger('click');
        expect(counter).be.eql(5);
    });

    it('off(event) with element without handlers', function() {
        var div = jLight('<div>');

        div.off('foo');
    });

    it('off(multiple event)', function() {
        var div = jLight('<div>'), counter = 0,
            fn = function() {
                counter++;
            };

        div.on('foo.bar bar.test test', fn);

        div.trigger('foo').trigger('bar test');
        expect(counter).be.eql(3);

        div.off('foo.bar .test test');
        div.trigger('foo').trigger('bar').trigger('test');
        expect(counter).be.eql(3);

        div.one('foo bar', fn);
        div.off('foo bar');
        div.trigger('foo bar');
        expect(counter).be.eql(3);
    });

    it('off should remove event handlers from cache', function() {
        var div = jLight('<div>'),
            fn = function() {};

        div.on('click', fn);

        expect(jLight._cache.events[jLight.getData(div).jid].click[0].originfn).be.eql(fn);

        div.off('click');

        expect(jLight._cache.events[jLight.getData(div).jid].click[0]).be.eql(undefined);

        div.on('click.test', fn);
        div.off('click', function() {});
        div.off('click.test', function() {});
        div.off('.test', function() {});
        div.off('.namespace');

        expect(jLight._cache.events[jLight.getData(div).jid].click[1]).to.be.an('object');

        div.off('.test');

        expect(jLight._cache.events[jLight.getData(div).jid].click[1]).be.eql(undefined);
    });

});
