;(function( daak, window, document, undefined ) {
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
            const Status = {
                OK: 0,
                EROOR: 1
            }

            var prefixUrl = 'http://127.0.0.1:2020';
            var scannerUrl = prefixUrl + '/scanner';

            this._validUrl = function (url) {
                return scannerUrl + '/' + url;
            }


            this._runCommand = function (cmd) {
                var result;

                daak.ajax({
                    url: this._validUrl(cmd),
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

            this.scanners = function () {
                return this._runCommand('list')._data;
            }

            this._scan = function (id) {
                if (!id){
                    throw new Error('Please set scanner id!');
                }

                return this._runCommand(id);
            }

            this.scan = function (id) {
                var result = this._scan(id);

                return result._data;
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
                    id = owner.scannerList.selected().index(),
                    src  = owner.scan(id);

                owner.setSrc('data:image/png;base64,' + src);
            })

            // var scanners = this.scanners();
            //
            // for(var i = 0; i < scanners.length; i++){
            //     var scanner = scanners[i];
            //
            //     this.scannerList.add(scanner.name, scanner.id);
            // }
        }
    }
}) (daak, window, document);
