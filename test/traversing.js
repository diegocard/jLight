describe('jLight Traversing', function() {

    it('Initialized', function() {
        expect(jLight().find).to.be.a("function");
        expect(jLight().get).to.be.a("function");
        expect(jLight().eq).to.be.a("function");
        expect(jLight().parent).to.be.a("function");
        expect(jLight().toArray).to.be.a("function");
    });

    it('find(selector)', function() {
        var a = jLight('<div><span></span><p><span></span></p></div>');

        expect(a.find('span')).to.have.length(2);
        expect(a.find('p')).to.have.length(1);
        expect(a.find('div')).to.have.length(0);
    });

    it('get(index)', function() {
        var a = jLight('<div></div><span></span>');

        expect(a.get(1).tagName.toLowerCase()).to.be('span');
        expect(a.get(1)).to.be.an(HTMLElement);
    });

    it('eq(index)', function() {
        var a = jLight('<div></div><span><a></a></span>');

        expect(a.eq(1)).to.be.an(jLight);
        expect(a.eq(1).get(0).childNodes).to.have.length(1);
    });

    it('parent()', function() {
        var a = jLight('<div><p><span></span></p></div>'),
            span = a.find('span');

        expect(span.parent()[0].tagName.toLowerCase()).to.be.eql('p');
        expect(span.parent()).to.have.length(1);
    });

    it('parent() with multiple elements', function() {
        var span = $('<span><span><span><a/><a/></span></span></span>'),
            a = span.find('a');

        expect(a.parent()).to.have.length(1);
    });

    it('parent() with multiple parents', function() {
        var span = $('<span><span><span><a/><a/></span></span></span>'),
            a = span.find('a, span');

        expect(a.parent()).to.have.length(3);
    });
});
