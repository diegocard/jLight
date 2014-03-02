describe('jLight Manipulation', function() {

    it('Initialized', function() {
        expect(jLight().html).to.be.a("function");
        expect(jLight().append).to.be.a("function");
        expect(jLight().appendTo).to.be.a("function");
        expect(jLight().empty).to.be.a("function");
        expect(jLight().remove).to.be.a("function");
    });

    it('html(jLight)', function() {
        var a = jLight('<div>').html(jLight('<span></span><p></p>'));

        expect(a[0].childNodes).to.have.length(2);
    });

    it('html(html)', function() {
        var a = jLight('<div>').html('<span></span><p></p>');

        expect(a[0].childNodes).to.have.length(2);
    });

    it('html(Node)', function() {
        var a = jLight('<div>').html(document.createElement('span'));

        expect(a[0].childNodes).to.have.length(1);
    });

    it('html(DocumentFragment)', function() {
        var a = jLight('<div>');
        var b = document.createDocumentFragment();

        b.appendChild(document.createElement('span'));
        b.appendChild(document.createElement('span'));

        a.html(b);

        expect(a[0].childNodes).to.have.length(2);
    });

    it('html(undefined)', function() {
        var a = jLight('<div>test</div>');

        a.html(undefined);
        expect(a.html()).eql('test');
    });

    it('html()', function() {
        var a = jLight('<div>test <span>text</span></div>');

        expect(a.html()).eql('test <span>text</span>');
    });

    it('append(html)', function() {
        var a = jLight('<div><span></span></div>').append('<span></span><p></p>');

        expect(a.find('span')).to.have.length(2);
    });

    it('append(jLight)', function() {
        var a = jLight('<div><p></p></div>').append(jLight('<p>'));

        expect(a.find('p')).to.have.length(2);
    });

    it('append(HTMLElement)', function() {
        var a = jLight('<div><p></p></div>');
        a.find('p').append(document.createElement('span'));

        expect(a.find('p, span')).to.have.length(2);
    });

    it('append(DocumentFragment)', function() {
        var a = jLight('<div><p></p></div>');
        var b = document.createDocumentFragment();

        b.appendChild(document.createElement('span'));
        b.appendChild(document.createElement('span'));

        a.append(b);

        expect(a.find('span')).to.have.length(2);
    });

    it('append(text)', function() {
        var a = jLight('<div>');

        a.append('text');
        a.append(1);

        expect(a.html()).to.eql('text1');
    });

    it('appendTo()', function() {
        var a = jLight('<div></div>');
        var b = jLight('<input><input>').appendTo(a);

        expect(a.find('input')).to.have.length(2);
        expect(b).to.have.length(2);
    });

    it('empty()', function() {
        var a = jLight('<div><input><input><div><input></div></div>');

        expect(a[0].childNodes).to.have.length(3);

        a.empty();
        expect(a[0].childNodes).to.have.length(0);
    });

    it('empty(multi elements)', function() {
        var a = jLight('<div><input><input></div><span><a></a></span>');

        expect(a).to.have.length(2);
        expect(a[0].childNodes).to.have.length(2);
        expect(a[1].childNodes).to.have.length(1);

        a.empty();
        expect(a).to.have.length(2);
        expect(a[0].childNodes).to.have.length(0);
        expect(a[1].childNodes).to.have.length(0);
    });

    it('remove() is working', function() {
        var wrap = jLight('<div><input></div>');

        expect(wrap.find('input')).to.have.length(1);

        wrap.find('input').remove();
        expect(wrap.find('input')).to.have.length(0);
    });

    it('remove() with node is not inserted in DOM', function() {
        var a = jLight('<a>');
        a.remove();

        expect(a).to.be.a(jLight);
    });
});
