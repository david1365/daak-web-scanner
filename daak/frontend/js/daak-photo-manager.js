;(function( daak, window, document, undefined ) {
    daak.fn.zoom = function(zoom, type) {
        var canvas  = this.getElementsByClassName('daak-showImage')[0];

        if (canvas) {
            var
                width = type === 'in' ? canvas.width * zoom : canvas.width / zoom,
                height = type === 'in' ? canvas.height * zoom : canvas.height / zoom,
                context = canvas.getContext('2d'),
                src = this.data('src');

            var img = new Image();
            img.src = src;

            img.onload = function (e) {
                canvas.width = width;
                canvas.height = height;

                context.drawImage(this, 0, 0);
                context.drawImage(this, 0, 0, width, height);
            }
        }
    }

    daak.fn.rotate = function () {
        var
            x,y,
            canvas  = this.getElementsByClassName('daak-showImage')[0],
            parent = this,
            degree = this.data('degree'),
            degree = degree == undefined ? 90 : degree,

            changeCoordinates = function() {
                var tmp = canvas.width;
                canvas.width =  canvas.height;
                canvas.height = tmp;
            };


        if (canvas) {
            var
                context = canvas.getContext('2d'),
                src = this.data('src');

            var img = new Image();
            img.src = src;

            var tmp;
            switch(degree) {
                case 0:
                    parent.data('degree', 90);
                    changeCoordinates();
                    break;
                case 90:
                    parent.data('degree', 180);

                    x = 0;
                    y = -canvas.height;

                    changeCoordinates();
                    break;

            case 180:
                parent.data('degree', 270);
                changeCoordinates();

                x = -canvas.width;
                y = -canvas.height;
                break;

            case 270:
                parent.data('degree', 0);
                changeCoordinates();

                x = -canvas.height;
                y = 0;
                break;
            }

            img.onload = function (e) {
                if (degree == 0) {
                    context.drawImage(this, 0, 0, this.width, this.height);
                    return false;
                }

                context.rotate(degree * Math.PI/180);

                context.translate(x, y);
                context.drawImage(this, 0, 0, this.width, this.height);
            }
        }
    }

    daak.fn.src = function (value) {
        var canvas  = this.find('.daak-showImage')[0];
        var context = canvas.getContext('2d');
        this.data('src', value);

        var img = new Image();
        img.src = value;

        img.onload = function (e) {
            var
                naturalWidth = this.naturalWidth,
                naturalHeight = this.naturalHeight;

            canvas.width = naturalWidth;
            canvas.height = naturalHeight;

            context.drawImage(this, 0, 0);
            context.drawImage(this, 0, 0, this.width, this.height);
        }
    }

    daak.fn.alivePhotoManager = function () {
        this.data('mouseDown', false);


        var tools = this.find('.daak-tools')[0];
        tools.addEventListener('mousedown', function (e) {
            e.stopPropagation();
         })

        var zoomIn = this.find('.daak-icon-zoom-in')[0];
        zoomIn.addEventListener('click', function (e) {
            e.stopPropagation();

            var parent  = this.closest('.daak-photo-manager');
            var zoomCount = parent.data('zoom-count');
            zoomCount = zoomCount != undefined ? zoomCount + 1 : 2;
            parent.data('zoom-count', zoomCount);

            document.title = zoomCount;

            parent.zoom(1.1, 'in');
        })

        var zoomOut = this.find('.daak-icon-zoom-out')[0];
        zoomOut.addEventListener('click', function (e) {
            e.stopPropagation();

            var parent  = this.closest('.daak-photo-manager');
            var zoomCount = parent.data('zoom-count');
            zoomCount = zoomCount != undefined ? zoomCount - 1 : -1;
            parent.data('zoom-count', zoomCount);

            parent.zoom(1.1, 'out');
        })

        var rotate = this.find('.daak-icon-rotate')[0];
        rotate.addEventListener('click', function (e) {
            e.stopPropagation();

            var parent  = this.closest('.daak-photo-manager');

            parent.rotate();
        })

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
