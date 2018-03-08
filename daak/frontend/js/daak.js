Math.radians = function(degrees) {
    return degrees * Math.PI / 180;
};

// Converts from radians to degrees.
Math.degrees = function(radians) {
    return radians * 180 / Math.PI;
};

if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector ||
        Element.prototype.webkitMatchesSelector;
}

String.prototype.isBoolean = function () {
    var str = this.toLowerCase();
    if (str === 'true' || str === 'false') {
        return true;
    }

    return false;
}

String.prototype.isNumber = function () {
    if (this.match(daak.NUMBER_REGEX)){
        return true;
    }

    return false;
}

String.prototype.isFloat = function () {
    if (this.match(daak.FLAOT_REGEX)){
        return true;
    }

    return false;
}

window.parseBool = function (value) {
    return JSON.parse(value);
}

var daak = (function ()
{
    // Create local daak
    var daak = function (selector, versatile) {
        // The daak object is actually just the init constructor 'enhanced'
        var daakObj = new daak.fn.init(selector, versatile);
        return daakObj;
    };

    var counts = 0;
    const
        REAL ='real-',
        //TODO: resolve event from name only
        events = 'click|mouseDown|mouseMove|mouseUp';

    daak.NUMBER_REGEX = /^[0-9]+$/;
    daak.FLAOT_REGEX = /^[+-]?\d+(\.\d+)?$/;
    daak.elems = {};
    daak.type = {
        CONTENT : 'content'
    };
    // daak.oa = {};

    var isFunction = function isFunction( obj ) {
        return typeof obj === "function" && typeof obj.nodeType !== "number";
    };

    var functionName = function(fn) {
        var f = typeof fn == 'function';
        var s = f && ((fn.name && ['', fn.name]) || fn.toString().match(/function ([^\(]+)/));
        return (!f && 'not a function') || (s && s[1] || 'anonymous');
    }

    var data2url = function(data) {
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

    var initialDaak = function (elem) {
        counts++;
        var daakId = '.' + counts.toString();

        elem.data('id', daakId);
        elem.data('daak-object', true);
        daak[daakId] = elem;

        traceChild(daak[daakId]);
    }

    var stringArguments = function (args) {
        var sa = '';
        for (var i = 0; i < args.length; i++){
            sa += 'args[' + i.toString() + '],' ;
        }

        return sa.substr(0, sa.length - 1);
    }

    var createDaakElem = function (daakElem, args, prop, owner) {
        if (daakElem.render) {
           var
               elem = daak(daakElem.render),
               sa = args != undefined ? stringArguments(args) : '';

           initialDaak(elem);
           elem.body = daakElem.body;
           elem.prop = prop;
           elem.owner = owner;
           elem.type = daakElem.type;

           eval('elem.body(' + sa + ')');

           return elem;
        }
    }

    var findElem = function (tagName) {
        for(var name in daak.elems){
            if (name.toUpperCase() === tagName){
                return daak.elems[name];
            }
        }
    }

    var bindToOwner = function (elem) {
        var daakBind = elem.data('bind');

        if ( daakBind ) {
            elem.owner[daakBind] = elem;
        }
    }

    var cammelCase = function (str) {
        if (str.indexOf('-') > 0) {
            var aStr = str.split('-');
            var newStr = aStr[0];

            if (aStr[0] === 'daak') {
                return str;
            }

            for (var i = 1; i < aStr.length; i++) {
                var s = aStr[i];
                s = s.charAt(0).toUpperCase() + s.slice(1);

                newStr += s;
            }

            return newStr;
        }

        return str;
    }
    daak.cammelCase = cammelCase;

    var addAttribute = function (daakElem, attrName, attrValue) {
        var oldAttrValue =  daakElem.getAttribute(attrName);
        daakElem.setAttribute(attrName, oldAttrValue != undefined ? attrValue + ' ' + oldAttrValue : attrValue);

        var attrName = cammelCase(attrName);
        if (daakElem[attrName] != undefined) {
            daakElem[attrName](attrValue);
        }
    }

    var stringParams = function (value) {
        var
            firstParentes = value.indexOf('('),
            lastParentes = value.indexOf(')');

        return value.substr(firstParentes, lastParentes);
    }

    var addFunctionAttribute = function (daakElem, attrName, attrValue) {
        attrName = cammelCase(attrName);
        attrValue = attrValue.replace('this', 'this.owner');

        var
            params = stringParams(attrValue);

        daakElem[attrName] = eval(
            'a  = function ' + params + '{' +
                attrValue +
            ';}');
    }

    var handleAttribute = function (daakElem, attr) {
        var pName = attr.name;
        var pValue = attr.value;

        var apName = pName.split('-');
        if (apName[0] != 'df') {
            addAttribute(daakElem, pName, pValue);
        }
        else {
            addFunctionAttribute(daakElem, pName.replace('df-', '') , pValue);
        }
    }

    var placementDaak = function (elem) {
        var daakElem = findElem(elem.tagName);

        if (daakElem != undefined) {
            daakElem = createDaakElem(daakElem, undefined, elem.attributes, elem.owner);
            elem.replace(daakElem);

            for(var index = 0; index < daakElem.prop.length; index++) {
                // var pName = cammelCase(daakElem.prop[index].name);
                // var pValue = daakElem.prop[index].value;
                // var attr =  daakElem.getAttribute(pName);
                // daakElem.setAttribute(pName, attr != undefined ? pValue + ' ' + attr : pValue);
                //
                // if (daakElem[pName] != undefined) {
                //     daakElem[pName](pValue);
                // }

                handleAttribute(daakElem, daakElem.prop[index]);
            }

            if (daakElem.type === daak.type.CONTENT) {
                daakElem.innerHTML = elem.innerHTML;
            }

            bindToOwner(daakElem);
        }
    }

    var traceChild = function (elem) {
        var tags = elem.querySelectorAll('*');
        var ids = {};

        for(var i = 0; i < tags.length; i++) {
            var
                tag = daak(tags[i]),
                parentId = daak(tag.parentNode).data('id');

            tag.owner = elem;
            bindToOwner(tag);

            ids[parentId] = !ids[parentId] && ids[parentId] === undefined ? 0 : ids[parentId];
            ids[parentId]++;

            var tagId = parentId + '.' + ids[parentId].toString();
            tag.data('id', tagId);

            placementDaak(tag);
        }
    },

    clone = function (object) {
        return JSON.parse(JSON.stringify(object));
    }

    daak.ajax = ajax;
    daak.clone = clone;
    daak.data2url = data2url;
    daak.functionName = functionName;
    var isArray = daak.isArray = Array.isArray;
    daak.isFunction = isFunction;

    daak.fn = daak.prototype = {
        //Define daak’s fn prototype, specially contains init method
        init: function (selector, versatile) {
            var elem;
            if (!selector) {
                return this;
            }

            if (typeof selector === "string") {
                var daakElem = daak.elems[selector];
                if (daakElem != undefined){
                   return createDaakElem(daakElem, versatile);
                }
                else if ( selector[0] === "<" &&
                    selector[selector.length - 1] === ">" &&
                    selector.length >= 3 ) {

                    elem = daak.parseHTML(selector);
                }
                else if (selector[0] === '#') {
                    elem = document.getElementById(selector.substr(1, selector.length - 1));
                }
                else if (selector[0] + selector[1] === '->') {
                    var id = selector.substr(2, selector.length - 1);
                    elem = document.querySelectorAll("[daak-id='" + id + "']")[0];
                }
                else if (selector[0] === '~') {
                    var type = selector.substr(1, selector.length - 1);
                    elem = document.querySelectorAll("[daak-type='" + type + "']")[0];
                    versatile = true;
                }
                else {
                    elem = document.querySelectorAll(selector);
                }
            }
            else {
                elem = selector;
            }

            addFn(elem);

            if (versatile === true) {
                initialDaak(elem, versatile);
            }

            return elem;
        },

        load: function (params, loadingPlace) {
            if (params === undefined) {
                params = {}
            }

            var
                self = loadingPlace != undefined ? loadingPlace : this,
                loadElem = daak('<div class="daak-loading"></div>'),
                tmpPosition = this.style.position,
                startLoading = function () {
                    self.style.position = 'relative';
                    self.disabled = true;
                    self.append(loadElem);
                },
                stopLoading = function () {
                    self.style.position = tmpPosition;
                    self.disabled = false;
                    loadElem.remove();
                },
                errorLoading = function () {
                    loadElem.removeClass('daak-loading');
                    loadElem.addClass('daak-loading-error');

                    self.addEventListener('mouseleave', function () {
                        loadElem.remove();
                    })
                }

                newParams = clone(params);


            startLoading();
            newParams.success = function (responseText, status, readyState) {
                if (params.success) {
                    stopLoading();
                    params.success(responseText, status, readyState);
                }
            },

            newParams.error = function (xhr, status, readyState) {
                if (params.error) {
                    params.error(xhr, status, readyState);
                    errorLoading();
                }
            }


            ajax(newParams);
        },

        find: function (selector) {
            var elems = this.querySelectorAll(selector);

            for (var i = 0; i < elems.length; i++){
                elems[i] = daak(elems[i]);
            }

            return elems;
        },

        // find: function (selector) {
        //     return this.querySelectorAll(selector);
        // },

        addEventListener: function (type,listener) {
            if (document.addEventListener) {                // For all major browsers, except IE 8 and earlier
                this[REAL + 'addEventListener'](type, listener);
            } else if (document.attachEvent) {              // For IE 8 and earlier versions
                this.attachEvent("on" + type, listener);
            }
        },

        triggerEvent: function(eventName, options) {
            var event;
            if (window.CustomEvent) {
                event = new CustomEvent(eventName, options);
            } else {
                event = document.createEvent('CustomEvent');
                event.initCustomEvent(eventName, true, true, options);
            }

            this.dispatchEvent(event);
        },

        visible: function(value) {
            if(value === undefined) {
                return this.style.visibility === 'visible' ? true : false;
            }

            var visibility = value === true ? 'visible' : 'hidden';

            this.style.visibility = visibility;
        },

        remove : function () {
            var daakObject = this.data('daak-object');
            if ((daakObject != undefined) && (daakObject === true)) {
                var daakId = this.data('id');
                delete daak[daakId];
            }

            this.parent().removeChild(this);
        },

        top: function (value) {
            if (value){
                this.style.top = value + 'px';
                return false;
            }

            var top = this.style.top.replace('px', '');
            return parseFloat(top);
        },

        left: function (value) {
            if (value){
                this.style.left = value + 'px';
                return false;
            }

            var left = this.style.left.replace('px', '');
            return parseFloat(left);
        },

        width: function (value) {
            if (value){
                this.style.width = value + 'px';
                return false;
            }

            var width = this.style.width.replace('px', '');
            return parseFloat(width);
        },

        height: function (value) {
            if (value){
                this.style.height = value + 'px';
                return false;
            }

            var height = this.style.height.replace('px', '');
            return parseFloat(height);
        },

        parent: function () {
            return daak(this.parentElement);
        },

        data: function (name, value) {
            if (!value && value === undefined){
                value = this.getAttribute("daak-" + name);

                if (value) {
                    if (value.isBoolean()) {
                        return parseBool(value);
                    }

                    if (value.isNumber()) {
                        return parseInt(value);
                    }

                    if (value.isFloat()) {
                        return parseFloat(value);
                    }
                }

               return value;
            }
            else{
                this.setAttribute("daak-" + name, value);
            }
        },

        //TODO: resolve this comment lines
        // scan: function (id) {
        //     var accept = {'INPUT' : 0, 'IMG': 1};
        //     var tagName = this.tagName;
        //
        //     if (!(tagName in accept)){
        //         throw new Error('daak -> Dont work for tag "' + tagName + '"!');
        //     }
        //
        //     if(tagName === 'INPUT'){
        //         var type = this.getAttribute('type');
        //         if (type !== 'image'){
        //             throw new Error('daak -> Dont work for tag "' + tagName + '" with type "' + type + '"!');
        //         }
        //     }
        //
        //     var result = _scan(id);
        //     this.src = 'data:image/png;base64,' + result._data;
        // },

        replace: function (elem) {
            elem.owner = this.owner;
            this.parentNode.replaceChild(elem, this);
        },

        rotate: function (deg) {
            var rotate = 'rotate('+deg+'deg)';
            this.style.webkitTransform = rotate
            this.style.mozTransform    = rotate;
            this.style.msTransform     = rotate;
            this.style.oTransform      = rotate;
            this.style.transform       = rotate;

        },

        clearAll: function () {
            var context = this.getContext('2d');

            context.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(0, 0, this.width, this.height);
            context.restore();
        },

        addClass: function (value) {
            this.classList.add(value);
        },

        removeClass: function (value) {
            this.classList.remove(value);
        },

        hasClass: function (value) {
            return this.classList.contains(value);
        },

        append: function (elem) {
            elem.owner = this;
            this.appendChild(elem);
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
                // if (propertyName.indexOf('daak-') == 0){
                //     if (!daak.oa[propertyName]) {
                //         daak.oa[propertyName] = null;
                //     }
                // }

                var property = daak.fn[propertyName];

                createRealProperty(elem, propertyName);

                elem[propertyName] = property;
            }
        }
    }

    // var addProperties = function (elem, object) {
    //     for(var propertyName in object) {
    //         var property = object[propertyName];
    //
    //         elem[propertyName] = property;
    //     }
    // }

    daak.parseHTML = function(string) {
        var parser = new DOMParser(),
            content = 'text/html',
            DOM = parser.parseFromString(string, content);

        // return element
        return DOM.body.firstChild;
    }

    //TODO: resolve Polyfill for IE8 and other browser -> https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
    if (!Element.prototype.closest) {
        daak.fn.closest = function (selector) {
            var el = this;
            if (!document.documentElement.contains(el)) return null;
            do {
                if (el.matches(selector)) return el;
                el = el.parentElement || el.parentNode;
            } while (el !== null && el.nodeType === 1);
            return null;
        }
    }

    // Return "daak" to the global object
    return daak;
})();