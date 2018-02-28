;(function( daak, window, document, undefined ) {
    daak.fn.src = function (value) {
        var canvas  = this.find('.daak-showImage')[0],
            context = canvas.getContext('2d'),
            img = new Image();

        this.data('src', value);

        img.src = value;
        img.onload = function (e) {
            var
                naturalWidth = this.naturalWidth,
                naturalHeight = this.naturalHeight;

            canvas.width = naturalWidth;
            canvas.height = naturalHeight;
            canvas.parent().data('naturalWidth', naturalWidth);
            canvas.parent().data('naturalHeight', naturalHeight);
            canvas.parent().data('degree', 0);
            canvas.parent().data('zoom-count', 0);

            context.drawImage(this, 0, 0);
            context.drawImage(this, 0, 0, this.width, this.height);
        }
    };

    daak.fn.zoom = function(zoom, type) {
        var canvas  = this.getElementsByClassName('daak-showImage')[0];

        if (canvas) {
            var
                width = type === 'in' ? canvas.width * zoom : canvas.width / zoom,
                height = type === 'in' ? canvas.height * zoom : canvas.height / zoom,
                context = canvas.getContext('2d'),
                src = this.data('src'),
                parent = canvas.parent(),
                zoomCount = parent.data('zoom-count'),
                step = type === 'in' ? 1 : -1;

            zoomCount = zoomCount + step;
            parent.data('zoom-count', zoomCount);

            canvas.width = width;
            canvas.height = height;

            var img = new Image();
            img.src = src;

            img.onload = function (e) {
                context.drawImage(this, 0, 0, width, height);
            }
        }
    };

    daak.fn.rotate = function (degree) {
        var
            x,y,
            parent = this.parent(),
            context = this.getContext('2d'),

            changeCoordinates = function() {
                var
                    naturalWidth = this.parent().data('naturalWidth'),
                    naturalHeight = this.parent().data('naturalHeight');

                if ((degree  / 90) % 2 !== 0) {// change width and height
                    var tmp = naturalWidth;
                    naturalWidth = naturalHeight;
                    naturalHeight = tmp;
                }

                this.width = naturalWidth;
                this.height = naturalHeight;
            };

        switch(degree) {
            case 0:
                parent.data('degree', 0);
                changeCoordinates();
                break;
            case 90:
                parent.data('degree', 90);

                x = 0;
                y = -this.height;

                changeCoordinates();
                break;

            case 180:
                parent.data('degree', 180);
                changeCoordinates();

                x = -this.width;
                y = -this.height;
                break;

            case 270:
                parent.data('degree', 270);
                changeCoordinates();

                x = -this.height;
                y = 0;
                break;
        }

        context.rotate(degree * Math.PI/180);
        context.translate(x, y);
    }

    daak.fn.show = function (degree, zoom) {

    }

    daak.rotate = function (degree) {
        var
            canvas  = this.getElementsByClassName('daak-showImage')[0],
            src = this.data('src'),
            img = new Image();

        img.src = src;

        if (canvas) {
            var context = canvas.getContext('2d');

            img.onload = function (e) {
                context.drawImage(this, 0, 0, this.width, this.height);
            }
        }
    };

    daak.fn.alivePhotoManager = function () {
        this.mouseDown = false;


        var tools = this.find('.daak-tools')[0];
        tools.addEventListener('mousedown', function (e) {
            e.stopPropagation();
         });

        var zoomIn = this.find('.daak-icon-zoom-in')[0];
        zoomIn.addEventListener('click', function (e) {
            e.stopPropagation();

            var parent  = this.closest('.daak-photo-manager');
            parent.zoom(1.1, 'in');
        });

        var zoomOut = this.find('.daak-icon-zoom-out')[0];
        zoomOut.addEventListener('click', function (e) {
            e.stopPropagation();

            var parent  = this.closest('.daak-photo-manager');
            parent.zoom(1.1, 'out');
        });

        var rotate = this.find('.daak-icon-rotate')[0];
        rotate.addEventListener('click', function (e) {
            e.stopPropagation();

            var
                parent  = this.closest('.daak-photo-manager'),
                content  = parent.getElementsByClassName('daak-content')[0],
                degree = content.data('degree'),
                degree = degree == 270 ? 0 : degree + 90;

            parent.rotate(degree);
        })

        this.addEventListener('mousedown', function (e) {
            var
                crop = this.crop;
                rect = this.getBoundingClientRect(),
                x = e.clientX,
                y = e.clientY;

            if (crop) {
                crop.remove();
            }

            crop = this.crop = daak.createCrop(this, x - rect.left , y - rect.top);
            crop.visible(false);

            this.mouseDown = true;
            this.data('oldX', x);
            this.data('oldY', y);
        });

        this.addEventListener('mousemove', function (e) {
            var
                rect = this.getBoundingClientRect(),
                x = e.clientX,
                y = e.clientY ,
                oldX = this.data('oldX'),
                oldY = this.data('oldY'),
                mouseDown = this.mouseDown;

            if( mouseDown ){
                var
                    crop = this.crop;

                crop.visible(true);
                crop.data('screenOldX', oldX);
                crop.data('screenOldY', oldY);
                crop.data('oldCropLeft', oldX);
                crop.data('oldCropTop', oldY);
                crop.data('oldCropHeight', 5);
                crop.data('oldCropWidth', 5);

                if ((oldX < x) && (oldY < y)) {
                    crop.rightBottomMouseDown = true;

                    return false;
                }

                if ((oldY < y) || (oldX > x)) {
                    crop.oldCropLeft = oldX - rect.left;
                    crop.oldCropTop = oldY - rect.top;

                    crop.leftBottomMouseDown = true;

                    return false;
                }

                if ((oldX < x)) {
                    crop.rightBottomMouseDown = true;

                    return false;
                }

                if (oldY < y) {
                    crop.rightBottomMouseDown = true;

                    return false;
                }

            }
        });

        this.addEventListener('mouseup', function (e) {
            this.mouseDown = false;
        })
    }

}) (daak, window, document);
