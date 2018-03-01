;(function( daak, window, document, undefined ) {
    daak.elems.PhotoManager = {
        render: '~photo-manager',

        body: function (src) {
            this.mouseDown = false;
            this.zoomNumber = 1.1;

            this.src = function (value) {
                this._src = value;

                var self = this,
                    imageShow = this.imageShow,
                    context = imageShow.getContext('2d'),
                    img = new Image();

                img.src = value;
                img.onload = function (e) {
                    var
                        naturalWidth = this.naturalWidth,
                        naturalHeight = this.naturalHeight;

                    imageShow.width = naturalWidth;
                    imageShow.height = naturalHeight;

                    self.realWidth = self.naturalWidth = naturalWidth;
                    self.realHeight = self.naturalHeight = naturalHeight;
                    self.degree = 0;

                    context.drawImage(this, 0, 0);
                    context.drawImage(this, 0, 0, this.width, this.height);
                }

            }

            this.tools.addEventListener('mousedown', function (e) {
                e.stopPropagation();
            });

            this.zoomIn.addEventListener('click', function (e) {
                e.stopPropagation();
                this.owner.imageShow.zoom(this.owner.zoomNumber, 'in');
            });

            this.zoomOut.addEventListener('click', function (e) {
                e.stopPropagation();
                this.owner.imageShow.zoom(this.owner.zoomNumber, 'out');
            });

            this.rotate.addEventListener('click', function (e) {
                e.stopPropagation();

                var
                    degree = this.owner.degree,
                    degree = degree == 270 ? 0 : degree + 90;

                this.owner.imageShow.rotate(degree);
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

                crop = this.crop = daak('Crop', [this, x, y, 'ali']);
                crop.visible(false);

                this.mouseDown = true;
                this.oldX = x;
                this.oldY = y;
            });

            this.addEventListener('mousemove', function (e) {
                var
                    rect = this.getBoundingClientRect(),
                    x = e.clientX,
                    y = e.clientY,
                    oldX = this.oldX,
                    oldY = this.oldY,
                    mouseDown = this.mouseDown;

                if (mouseDown) {
                    var
                        crop = this.crop;

                    crop.visible(true);
                    crop.screenOldX = oldX;
                    crop.screenOldY = oldY;
                    crop.oldCropLeft = oldX;
                    crop.oldCropTop = oldY;
                    crop.oldCropHeight = 5;
                    crop.oldCropWidth = 5;

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


            this.imageShow.rotate = function (degree) {
                var
                    x, y,
                    self = this,
                    owner = this.owner,
                    context = this.getContext('2d'),

                    changeCoordinates = function () {
                        var
                            realWidth = owner.realWidth,
                            realHeight = owner.realHeight;

                        if ((degree / 90) % 2 !== 0) {// change width and height
                            if (realWidth > realHeight) {
                                var tmp = realWidth;
                                realWidth = realHeight;
                                realHeight = tmp;
                            }
                        }

                        self.width = realWidth;
                        self.height = realHeight;
                    };

                switch (degree) {
                    case 0:
                        owner.degree = 0;
                        changeCoordinates();
                        break;
                    case 90:
                        owner.degree = 90;

                        x = 0;
                        y = -this.height;

                        changeCoordinates();
                        break;

                    case 180:
                        owner.degree = 180;
                        changeCoordinates();

                        x = -this.width;
                        y = -this.height;
                        break;

                    case 270:
                        owner.degree = 270;
                        changeCoordinates();

                        x = -this.height;
                        y = 0;
                        break;
                }

                context.rotate(degree * Math.PI / 180);
                context.translate(x, y);

                this.show(this.owner.realWidth, this.owner.realHeight);
            }

            this.imageShow.zoom = function (zoom, type) {
                var imageShow = this;

                if (imageShow) {
                    var
                        width = type === 'in' ? imageShow.width * zoom : imageShow.width / zoom,
                        height = type === 'in' ? imageShow.height * zoom : imageShow.height / zoom,
                        context = imageShow.getContext('2d'),
                        owner = imageShow.owner,
                        zoomCount = owner.zoomCount,
                        step = type === 'in' ? 1 : -1;

                    zoomCount = zoomCount + step;
                    owner.zoomCount = zoomCount;

                    imageShow.width = width;
                    imageShow.height = height;

                    this.owner.realWidth = width;
                    this.owner.realHeight = height;

                    this.rotate(this.owner.degree);
                }
            };

            this.imageShow.show = function (width, height) {
                var
                    imageShow = this,
                    img = new Image();

                img.src = this.owner._src;

                if (imageShow) {
                    var context = imageShow.getContext('2d');

                    img.onload = function (e) {
                        context.drawImage(this, 0, 0, width, height);
                    }
                }
            }


            this.src(src);
        }
    }

}) (daak, window, document);
