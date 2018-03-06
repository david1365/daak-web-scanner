;(function( daak, window, document, undefined ) {
    daak.elems.listItem = {
        render: '<div></div>',
        type: daak.type.CONTENT,

        body: function (value, index) {
            this.selected = false;

            this.value = function (value) {
                if (value === undefined) {
                    return this.innerHTML;
                }

                this.innerHTML = value;
            }

            this.index = function (index) {
                if (index === undefined) {
                    return this._index;
                }

                this._index = index;
            }

            this.active = function () {
                var active = 'daak-list-active';
                var list = this.owner.list;

                for(var i = 0; i < list.length; i++) {
                    var item = list[i];
                    if (item.hasClass(active)) {
                        item.removeClass(active);
                        item.selected = false;
                    }
                }

                this.selected = true;
                this.addClass(active);
            }

            this.addEventListener('click', function (e) {
                this.active();
            })

            this.value(value);
            this.index(index);
        }
    }

    daak.elems.list = {
        render: '<div class="daak-list" daak-type="list">\n' +
                    '<div daak-bind="container" class="daak-list-container"></div>' +
                '</div>',

        body: function () {
            this.list = this.children;

            this.add = function (value, index) {
                var item  = daak('listItem', [value, index]);
                this.container.appendChild(item)
            }

            this.remove = function (item) {
                item.remove();
            }

            this.selected = function () {
                var list = this.list;
                for(var i = 0; i < list.length; i++) {
                    if (list[i].selected === true){
                        return list[i];
                    }
                }
            }
        }
    }
}) (daak, window, document);
