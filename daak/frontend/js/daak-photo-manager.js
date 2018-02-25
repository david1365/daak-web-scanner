;(function( daak, window, document, undefined ) {
    daak.fn.alivePhotoManager = function () {
        this.data('mouseDown', false);

        this.addEventListener('mousedown', function (e) {
            var
                crop = this.find('.daak-crop')[0],
                rect = this.getBoundingClientRect(),
                x = e.clientX,
                y = e.clientY;

            if (crop) {
                crop.remove();
            }

            crop = daak.createCrop(this, x, y - rect.top);
            crop.visible(false);

            this.data('mouseDown', true);
            this.data('oldX', x);
            this.data('oldY', y);
        })

        this.addEventListener('mousemove', function (e) {
            var
                x = e.clientX,
                y = e.clientY ,
                oldX = this.data('oldX'),
                oldY = this.data('oldY'),
                mouseDown = this.data('mouseDown');

            if( mouseDown ){
                var
                    crop = this.find('.daak-crop')[0];

                crop.visible(true);
                crop.data('screenOldX', oldX);
                crop.data('screenOldY', oldY);
                crop.data('oldCropLeft', oldX);
                crop.data('oldCropTop', oldY);
                crop.data('oldCropHeight', 5);
                crop.data('oldCropWidth', 5);

                if ((oldX < x) && (oldY < y)) {
                    crop.data('rightBottomMouseDown', true);
                    this.style.position('relative');

                    return false;
                }

                if ((oldY < y) || (oldX > x)) {
                    crop.data('leftBottomMouseDown', true);

                    return false;
                }

                if ((oldX < x)) {
                    crop.data('rightBottomMouseDown', true);

                    return false;
                }

                if (oldY < y) {
                    crop.data('rightBottomMouseDown', true);

                    return false;
                }

            }
        })

        this.addEventListener('mouseup', function (e) {
            this.data('mouseDown', false);
        })
    }

}) (daak, window, document);
