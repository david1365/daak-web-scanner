;(function( daak, window, document, undefined ) {
    daak.elems.zoomTool = {
        render: '~zoom-tool',

        body: function () {
            this.mouseDown = false;
            this.r = 0;
            // this.owner.addEventListener('click', function () {
            //     alert(this.zoomTool.innerHTML)
            // })

            this.knobe.addEventListener('mousedown', function (e) {
                e.stopPropagation();
alert(this.mouseDown)
                this.mouseDown = true;
                this.r += 5;alert(this.r);
                this.owner.rotate(this.r);
            })
        }
    }
}) (daak, window, document);
