var url = 'http://127.0.0.1:1010'
QUnit.test( "data2url", function( assert ) {
    var url = daak.data2url({a: 123, b: 'ddd'});
    console.log(url);
    assert.ok( url == "a=123&b=ddd", "Passed!" );
});


QUnit.test( "ajax GET", function( assert ) {
    var done = assert.async();

    daak.ajax({
        url: url  + '/get',
        success: function (responseText) {
            assert.ok( responseText == "ok", "Passed!" );

            done();
        }
    })
});

QUnit.test( "ajax GET -> send data... ", function( assert ) {
    var done = assert.async();

    daak.ajax({
        data: {test1: 'ali'},
        url: url  + '/get_params',
        success: function (responseText) {
            assert.ok( responseText == "ali", "Passed!" );

            done();
        }
    })
});

QUnit.test( "ajax POST,", function( assert ) {
    var done = assert.async();

    daak.ajax({
        url: url  + '/post',
        method: 'POST',
        success: function (responseText) {
            assert.ok( responseText == "ok", "Passed!" );

            done();
        }
    })
});

QUnit.test( "ajax json ", function( assert ) {
    var done = assert.async();

    daak.ajax({
        url: url  + '/json',
        dataType: 'json',
        success: function (responseText) {
            assert.ok( responseText.a == 21, "Passed!" );

            done();
        }
    })
});


QUnit.test( "image scan throws for other tag", function( assert ) {
    assert.throws(
        function() {
            daak('#b1').scan()
        },
        "throws with just a message, not using the 'expected' argument"
    );
});


QUnit.test( "image scan throws for input without image", function( assert ) {
    assert.throws(
        function() {
            daak('#im1').scan()
        },
        "throws with just a message, not using the 'expected' argument"
    );
});

QUnit.test( "", function( assert ) {
    assert.throws(
        function() {
            daak('#im1').scan()
        },
        "throws with just a message, not using the 'expected' argument"
    );
});

QUnit.test( "string isBoolean Test", function( assert ) {
    assert.ok( 'true'.isBoolean() === true, "true...Passed!" );
    assert.ok( 'false'.isBoolean() === true, "false...Passed!" );
    assert.ok( 'ali'.isBoolean() === false, "ali...Passed!" );
    assert.ok( '123.5'.isBoolean() === false, "123.5...Passed!" );
    assert.ok( '123'.isBoolean() === false, "123...Passed!" );
});

QUnit.test( "parsBool test", function( assert ) {
    assert.ok( parseBool('true') === true, "parseBool('true')...Passed!" );
    assert.ok( parseBool('false') === false, "parseBool('false')...Passed!" );
});

QUnit.test( "isNumber test", function( assert ) {
    assert.ok( 'true'.isNumber() === false, "'true'.isNumber()...Passed!" );
    assert.ok( '123'.isNumber()  === true, "'123'.isNumber()...Passed!" );
    assert.ok( '12.5'.isNumber()  === false, "'12.5'.isNumber()...Passed!" );
});

QUnit.test( "isFloat test", function( assert ) {
    assert.ok( 'true'.isFloat() === false, "'true'.isFloat()...Passed!" );
    assert.ok( '123'.isFloat()  === true, "'123'.isFloat()...Passed!" );
    assert.ok( '12.5'.isFloat()  === true, "'12.5'.isFloat()...Passed!" );
});

QUnit.test( "cammelCase test", function( assert ) {
    assert.ok( daak.cammelCase('a-b-c') === 'aBC', "'daak.cammelCase('a-b-c') === 'aBC'...Passed!" );
    assert.ok( daak.cammelCase('aBc') === 'aBc', "'daak.cammelCase('aBc') === 'aBc'...Passed!" );
});

