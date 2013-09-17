describe('viewport setup', function() {

  it('should set up a viewport', function() {
    
    var vp = viewport([
      {
        name: 'test',
        width: [ 1 ]
      }
    ]);

    assert.equal(vp.is('test'), true);
    assert.equal(vp.current(), vp.get('test'));
    assert.equal(vp.matches('test'), true);

  });

});


describe('viewport tests', function() {

  // phantomjs defaults to width = 300, height = 400
  var width = window.innerWidth;
  var height = window.innerHeight;

  it('should return the correct viewport object based on width', function() {
    var vp = viewport([
      {
        name: 'test',
        width: [ 0, width - 1 ]
      },
      {
        name: 'test2',
        width: [ width ]
      }
    ]);

    assert.equal(vp.current(), vp.get('test2'));
    assert.equal(vp.matches('test2'), true);
    assert.equal(vp.is('test2'), true);

  });


  it('should return the correct viewport object based on height', function() {
    var vp = viewport([
      {
        name: 'test',
        height: [ 0, height - 1 ]
      },
      {
        name: 'test2',
        height: [ height ]
      }
    ]);

    assert.equal(vp.current(), vp.get('test2'));
    assert.equal(vp.matches('test2'), true);
    assert.equal(vp.is('test2'), true);

  });


  it('should return the correct viewport object based on width and height', function() {
    var vp = viewport([
      {
        name: 'test',
        height: [ 0, height - 1 ],
        width: [ 0, width - 1 ]
      },
      {
        name: 'test2',
        height: [ height ],
        width: [ width ]
      }
    ]);

    assert.equal(vp.current(), vp.get('test2'));
    assert.equal(vp.matches('test2'), true);
    assert.equal(vp.is('test2'), true);

  });


  it('should override when a condition function is provided', function() {
    var vp = viewport([
      {
        name: 'test',
        height: [ height - 1 ],
        width: [ width - 1 ],
        condition: function() { return true; }
      }
    ]);

    assert.equal(vp.current(), vp.get('test'));
    assert.equal(vp.matches('test'), true);
    assert.equal(vp.is('test'), true);

  });


  it('should return the last viewport object when multiple match', function() {
    var vp = viewport([
      {
        name: 'test',
        height: [ height ],
        width: [ width ]
      },
      {
        name: 'test2',
        height: [ height ],
        width: [ width ]
      },
      {
        name: 'last',
        height: [ height ],
        width: [ width ]
      }
    ]);

    assert.equal(vp.current(), vp.get('last'));
    assert.equal(vp.matches('last'), true);
    assert.equal(vp.is('last'), true);

  });

});
