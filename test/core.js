describe('jLight Core', function() {

    before(function() {
        var html = '<div><span><a href="#"><span><input type="text" /></span></a></span></div>';
        $('#app').html(html);
    });

    after(function() {
        $('#app').empty();
    });

    it('jLight initialized', function() {
        expect(jLight).to.be.an('function');
        expect(jLight()).to.be.an(jLight);
    });

    it('jLight imported to $', function() {
        expect(window.jLight).to.be.ok();
        expect(window.$).to.be.ok();
        expect($()).to.be.an(jLight);
    });

    it('jLight element have right id', function() {
        var a = jLight({}), b = jLight('<a>'), c = jLight(window);

        a.on('click', function() {});
        b.on('click', function() {});
        c.on('click', function() {});

        expect(a[0].jid).to.be.a('number');
        expect(jLight.getData(b).jid).to.be.a('number');
        expect(a[0].jid).not.to.eql(b[0].jid);
        expect(window.jid).to.be(undefined);
        expect(c[0].jid).to.be(undefined);
        expect(jLight.getData(c).jid).to.be.ok();
    });

    it('jLight() with invalid data', function() {
        expect(jLight('text')).to.have.length(0);
        expect(jLight(null)).to.have.length(0);
        expect(jLight(undefined)).to.have.length(0);
        expect(jLight('#')).to.have.length(0);
    });

    it('jLight(html) create new single DOM element', function() {
        var a = jLight('<a>');

        expect(a[0]).to.be.an(HTMLElement);
        expect(a).to.have.length(1);
    });

    it('jLight(html) create each DOM elements', function() {
        var a = jLight('<p></p><p></p><p></p>');

        expect(a[1].tagName.toLowerCase()).to.be('p');
        expect(a).to.have.length(3);
    });

    it('jLight(html) create nested DOM element', function() {
        var a = jLight('<p><span></span><span></span></p>');

        expect(a[0].childNodes).to.have.length(2);
    });

    it('jLight(selector) create single element from selector', function() {
        var a = jLight('#app div');

        expect(a).to.have.length(1);
        expect(a[0]).to.be.an(HTMLElement);
    });

    it('jLight(selector) create some elements from selector', function() {
        var a = jLight('#app span');

        expect(a).to.have.length(2);
        expect(a[1]).to.be.an(HTMLElement);
    });

    it('jLight(selector, context)', function() {
        expect(jLight('input', 'a span')).to.have.length(1);
        expect(jLight('input', 'ul')).to.have.length(0);

        expect(jLight('input', jLight('#app'))).to.have.length(1);
        expect(jLight('input', jLight('ul'))).to.have.length(0);
    });

    it('jLight(element) create some elements from DOMElement', function() {
        var a = jLight(document.createElement('div'));

        expect(a[0].tagName.toLowerCase()).to.be('div');
    });

    it('jLight(jLight) do not create new jLight element', function() {
        var a = jLight('<input><input>');
        var b = jLight(a);

        expect(b[0]).to.be.an(HTMLElement);
        expect(b).have.length(2);
        expect(jLight.getData(a).jid).to.be(jLight.getData(b).jid);
    });

});
