;(function( daak, window, document, undefined ) {
    daak.fn.src = function (value) {
        var canvas  = this.find('.daak-showImage')[0];
        var ctx = canvas.getContext('2d');

        var img = new Image();
        img.src = value;

        img.onload = function (e) {
            canvas.width = this.naturalWidth;
            canvas.height = this.naturalHeight;

            ctx.drawImage(this, 0, 0);
            ctx.drawImage(this, 0, 0, this.width, this.height);
        }
    }

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

            crop = daak.createCrop(this, x - rect.left , y - rect.top);
            crop.visible(false);

            this.data('mouseDown', true);
            this.data('oldX', x);
            this.data('oldY', y);
        })

        this.addEventListener('mousemove', function (e) {
            var
                rect = this.getBoundingClientRect(),
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

                    return false;
                }

                if ((oldY < y) || (oldX > x)) {
                    crop.data('oldCropLeft', oldX - rect.left);
                    crop.data('oldCropTop', oldY - rect.top);

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
