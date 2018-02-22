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
