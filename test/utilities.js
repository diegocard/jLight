describe('jLight Unilities', function() {

    it('Initialized', function() {
        expect(jLight.merge).to.be.a('function');
        expect(jLight.contains).to.be.a('function');
        expect(jLight.extend).to.be.a('function');
    });

    it('merge(first, second)', function() {
        var a = [1], b = [2, {}];

        jLight.merge(a, b);

        expect(a.length).eql(3);
        expect(a[2]).eql(b[1]);
    });

    it('contains(container, contained)', function() {
        var a = jLight('<div><span><input /></span></div>'),
            b = jLight('<span>'),
            c = a.find('input')[0];

        expect(jLight.contains(a, c)).ok();
        expect(jLight.contains(a.find('span'), c)).eql(a.find('span')[0]);
        expect(jLight.contains(a, b)).not.ok();
    });

    it('extend(target, element)', function() {
        var a = {
            x: 1
        }, b = {
            y: 2,
            z: {}
        }, c, d;

        a = jLight.extend(a, b);

        expect(a).eql(a);
        expect(a).have.property('y').and.property('y').eql(b.y);
        expect(a.z).eql(b.z);

        c = jLight.extend({}, a, b);

        expect(c).have.property('z').and.property('z').eql(a.z);

        d = jLight.extend(c, undefined);

        expect(d).eql(c);
    });

});