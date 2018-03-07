;(function( daak, window, document, undefined ) {
    daak.elems.ListItem = {
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
                    item.removeClass(active);
                    item.selected = false;
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

    daak.elems.List = {
        render: '<div class="daak-list" daak-type="list">\n' +
                    '<div daak-bind="container" class="daak-list-container"></div>' +
                '</div>',

        body: function () {
            this.container.list = this.container.children;

            this.add = function (value, index) {
                var item  = daak('ListItem', [value, index]);
                this.container.append(item);
            }

            this.remove = function (item) {
                item.remove();
            }

            this.selected = function () {
                var list = this.container.list;
                for(var i = 0; i < list.length; i++) {
                    if (list[i].selected === true){
                        return list[i];
                    }
                }
            }
        }
    }
}) (daak, window, document);
