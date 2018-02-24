;(function( daak, window, document, undefined ) {
    daak.fn.move = function (parent) {
        daak.crop = {};
        daak.crop.mouseDown = false;

        this.addEventListener('mousedown', function (e) {
            daak.crop.oldX = e.clientX;
            daak.crop.oldY = e.clientY;
            daak.crop.mouseDown = true;

            alert(this.tagName)
        })

        this.addEventListener('mousemove', function (e) {
            daak.crop.oldX = e.clientX;
            daak.crop.oldY = e.clientY;

            var target = daak(e.target);
            target.top = e.clientY;

            document.title = e.clientX + ',' + e.clientY;
        })

        this.addEventListener('mouseup', function (e) {
            daak.crop.mouseDown = false;;
        })
    }
}) (daak, window, document);
