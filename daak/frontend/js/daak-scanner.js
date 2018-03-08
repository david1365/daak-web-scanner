;(function( daak, window, document, undefined ) {
    const Status = {
        OK: 0,
        EROOR: 1
    }

    daak.fn.scanLoad = function (params) {
        this.load({
            url: params.cmd,
            dataType: 'json',
            // async: false,
            success: function (result) {
                if (params.success) {
                    if (result._status === Status.EROOR) {
                        console.log(Error(result._message));
                    }

                    params.success(result);
                }
            },
            error: params.error,
        }, params.loadingPlace)
    }

    daak.elems.scanner = {
        render: '<div daak-type="scanner" class="daak-scanner">\n' +
                '    <section>\n' +
                '        <list daak-bind="scannerList"></list>\n' +
                '    </section>\n' +
                '    <section>\n' +
                '        <daakButton daak-bind="scanButton" class="daak-pbutton" text="scan"></daakButton>\n' +
                '    </section>\n' +
                '</div>',

        body: function () {
            var prefixUrl = 'http://127.0.0.1:2020';
            var scannerUrl = prefixUrl + '/scanner';

            this._validUrl = function (url) {
                return scannerUrl + '/' + url;
            }


            this.scanners = function (func) {
                this.scanLoad({
                    cmd: this._validUrl('list'),
                    success: function (result) {
                    if (func){
                        func(result._data);
                    }
                }});
            }

            this._scan = function (id, func) {
                if (!id){
                    throw new Error('Please set scanner id!');
                }

                this.scanLoad({
                    cmd: this._validUrl(id),
                    success: function (result) {
                        if (func) {
                            func(result._data);
                        }
                    }
                })
            }

            this.scan = function (id, callBack) {
                 this._scan(id, callBack);
                //TODO: select one of them
                // var image = new Image();
                // image.src = validUrl(id) +'?daak=' + Math.random() * .23;
                //
                // return image;
            }

            this.base642Image = function (data) {
                var image = new Image();
                image.src = 'data:image/png;base64,' + data;

                return image;
            }

            this.scanButton.addEventListener('click', function (e) {
                e.stopPropagation();

                var
                    owner = this.owner,
                    id = owner.scannerList.selected().index();
                    owner.scan(id, function (src) {
                        owner.setSrc('data:image/png;base64,' + src);
                    });
            })



             var scannerList = this.scannerList;
             this.scanners(function (scanners) {
                for(var i = 0; i < scanners.length; i++){
                    var scanner = scanners[i];

                    scannerList.add(scanner.name, scanner.id);
                }
            });
        }
    }
}) (daak, window, document);
