var daak = (function ()
{
    // Create local daak
    var daak = function (selector, context) {
        // The daak object is actually just the init constructor 'enhanced'
        var daakObj = new daak.fn.init(selector, context);
        return daakObj;
    };

    const REAL ='real-';
    daak.oa = {};

    const Status = {
        OK: 0,
        EROOR: 1
    }

    var prefixUrl = 'http://127.0.0.1:2020';
    var scannerUrl = prefixUrl + '/scanner';

    var isFunction = function isFunction( obj ) {
        return typeof obj === "function" && typeof obj.nodeType !== "number";
    };

    var functionName = function(fn) {
        var f = typeof fn == 'function';
        var s = f && ((fn.name && ['', fn.name]) || fn.toString().match(/function ([^\(]+)/));
        return (!f && 'not a function') || (s && s[1] || 'anonymous');
    }

    var data2url = function(data){
        var dataUrl = '';
        for(var name in data){
            dataUrl += name + '=' + data[name] + '&'
        }

        return dataUrl.substr(0, dataUrl.length - 1);
    }

    var ajax = function (params) {
        var xhttp;
        if (window.XMLHttpRequest) {
            // code for modern browsers
            xhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xhttp.onreadystatechange = function() {
            var readyState = this.readyState;
            var status = this.status;
            var responseText;

            if (status == 0){
                console.log('Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at ' + url + '. (Reason: CORS header \'Access-Control-Allow-Origin\' missing).');
                return false;
            }

            if (readyState === 4) {
                if (status === 200) {
                    switch (params.dataType) {
                        case 'json':
                            responseText = JSON.parse(this.responseText);
                            break;
                        case 'xml':
                            responseText = this.responseXML;
                            break;
                        default:
                            responseText = this.responseText
                    }

                    var success = params.success;
                    if (success){
                        success(responseText, status, readyState)
                    }
                }
                else {
                    var error = params.error;
                    if (error){
                        error(this, status, readyState)
                    }
                }
            }
        };

        var dataUrl;
        var data = params.data;
        var url = params.url;
        var method = params.method ? params.method : "GET";
        var async = params.async != undefined ? params.async : true;

        if (data){
            dataUrl = data2url(params.data);
        }

        if (method === "POST")
        {
            xhttp.open(method, url, async);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

            if(data){
                xhttp.send(dataUrl);
            }
            else {
                xhttp.send();
            }

        }
        else{
            url = data ? url + '?' + dataUrl : url;
            xhttp.open(method, url, async);
            xhttp.send();
        }
    }

    var validUrl = function (url) {
        return scannerUrl + '/' + url;
    }

    var runCommand = function (cmd) {
        var result;

        ajax({
            url: validUrl(cmd),
            dataType: 'json',
            async: false,
            success: function (data) {
                result = data;
            }
        })

        if (result._status === Status.EROOR) {
            throw new Error(result._message);
        }

        return result;
    }

    var scanners = function () {
        return runCommand('list');
    }

    var _scan = function (id) {
        return runCommand(id);
    }

    var scan = function (id) {
        var result = _scan(id);

        var image = new Image();
        image.src = 'data:image/png;base64,' + result._data;

        return image;

        //TODO: select one of them
        // var image = new Image();
        // image.src = validUrl(id) +'?daak=' + Math.random() * .23;
        //
        // return image;
    }

    daak.scanners = scanners;
    daak.scan = scan;
    daak.ajax = ajax;
    daak.data2url = data2url;
    daak.functionName = functionName;
    var isArray = daak.isArray = Array.isArray;
    daak.isFunction = isFunction;

    daak.fn = daak.prototype = {
        //Define daak’s fn prototype, specially contains init method
        init: function (selector, context) {
            var elem;
            if (!selector) {
                return this;
            }

            if (typeof selector === "string") {
                if ( selector[0] === "<" &&
                    selector[selector.length - 1] === ">" &&
                    selector.length >= 3 ) {

                    elem = daak.parseHTML(selector);
                }
                else if (selector[0] === '#') {
                    elem = document.getElementById(selector.substr(1, selector.length - 1));
                }
                else if (selector[0] === '~') {
                    var id = selector.substr(1, selector.length - 1);
                    elem = document.querySelectorAll("[daak-id='" + id + "']")[0];
                }
                else {
                    elem = document.querySelectorAll(selector);
                }
            }
            else {
                elem = selector;
            }

            addFn(elem);

            return elem;
        },

        addEventListener: function (type,listener) {
            if (document.addEventListener) {                // For all major browsers, except IE 8 and earlier
                this[REAL + 'addEventListener'](type, listener);
            } else if (document.attachEvent) {              // For IE 8 and earlier versions
                this.attachEvent("on" + type, listener);
            }
        },

        data: function (name, value) {
            if (!value && value === undefined){
               return this.getAttribute("daak-" + name);
            }
            else{
                this.setAttribute("daak-" + name, value);
            }
        },
        scan: function (id) {
            // var result = _scan(id);
            //
            // var image = new Image();
            // image.src = 'data:image/png;base64,' + result._data;
            alert(this.tagName)
        }
    }

    // Give the init function the "daak" prototype for later instantiation
    daak.fn.init.prototype = daak.fn;


    var createRealProperty = function (elem, propertyName) {
        if (!elem[REAL + propertyName] && elem[REAL + propertyName] === undefined) {
            if (elem[propertyName]) {
                elem[REAL + propertyName] = elem[propertyName];
            }
        }
    }

    var addFn = function (elem) {
        for(var propertyName in daak.fn) {
            if (propertyName !== 'init') {
                if (propertyName.indexOf('daak-') == 0){
                    if (!daak.oa[propertyName]) {
                        daak.oa[propertyName] = null;
                    }
                }

                var property = daak.fn[propertyName];

                createRealProperty(elem, propertyName);

                elem[propertyName] = property;
            }
        }
    }

    var addProperties = function (elem, object) {
        for(var propertyName in object) {
            var property = object[propertyName];

            elem[propertyName] = property;
        }
    }

    daak.parseHTML = function(string) {
        var parser = new DOMParser(),
            content = 'text/html',
            DOM = parser.parseFromString(string, content);

        // return element
        return DOM.body;
    }


    // Return "daak" to the global object
    return daak;
})();