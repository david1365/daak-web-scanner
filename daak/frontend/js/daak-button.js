;(function( daak, window, document, undefined ) {
    daak.elems.DaakButton = {
        render: '<button class="daak-btn" daak-type="daak-Button">\n' +
                '</button>',
        type: daak.type.CONTENT,

        body: function (text) {
            this.selected = false;
            this.btnTypes = {
                'circle-button' : 'daak-btn-circle',
                'default-button' : 'daak-btn-default'
            }

            this.iconTypes = {
                'zoom-in' : 'daak-icon-zoom-in',
                'zoom-out' : 'daak-icon-zoom-out',
                'crop' : 'daak-icon-crop',
                'rotate' : 'daak-icon-rotate',
                'send' : 'daak-icon-send',
            }

            this.addClass('daak-btn-default');

            this.text = function (text) {
                if (text === undefined) {
                    return this.innerHTML;
                }

                this.innerHTML = text;
            }

            this.btnType = function (value) {
                if (value === undefined) {
                    return this._btnType;
                }

                this._btnType = value;

               this.removeClass('daak-btn-default');
               this.addClass(this.btnTypes[value]);
            }

            this.iconType = function (value) {
                if (value === undefined) {
                    return this._iconType;
                }

                this._iconType = value;

                this.addClass(this.iconTypes[value]);
            }

            this.text(text);
        }
    }
}) (daak, window, document);
