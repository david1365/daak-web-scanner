;(function( daak, window, document, undefined ) {
    daak.fn.alivePhotoManager = function () {
        this.data('mouseDown', false);

        this.addEventListener('mousedown', function (e) {
            var
                crop = this.find('.daak-crop')[0];

            if (crop) {
                crop.remove();
            }

            this.data('mouseDown', true);
            this.data('oldX', e.clientX);
            this.data('oldY', e.clientY);
        })

        this.addEventListener('mousemove', function (e) {
            var
                x = e.clientX,
                y = e.clientY,
                oldX = this.data('oldX'),
                oldY = this.data('oldY'),
                mouseDown = this.data('mouseDown');

            if( mouseDown ){
                var
                    crop = this.find('.daak-crop')[0];
                    if( !crop ) {
                        crop = daak.createCrop(this, x, y);
                    }

                crop.data('screenOldX', oldX);
                crop.data('screenOldY', oldY);
                crop.data('oldCropLeft', oldX);
                crop.data('oldCropTop', oldY);
                crop.data('oldCropHeight', -100);
                crop.data('oldCropWidth', 5);

                if ((oldX < x) && (oldY < y)) {
                    crop.data('rightBottomMouseDown', true);

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

            }
        })

        this.addEventListener('mouseup', function (e) {
            this.data('mouseDown', false);
        })
    }

}) (daak, window, document);
