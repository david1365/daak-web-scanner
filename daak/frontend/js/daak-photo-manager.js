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
                    degree = degree == 360 ? 0 : degree + 1,
                    imageShow = this.owner.imageShow;

                this.owner.degree = degree;

                imageShow.rotate(degree);
                // imageShow.show();
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


            this.imageShow.rotate = function (degree) {document.title = degree;
                var
                    xp, yp,
                    context = this.getContext('2d'),
                    realWidth = this.owner.realWidth,
                    realHeight = this.owner.realHeight,
                    degree = degree * Math.PI / 180,
                    r = this.owner.r = 500;//Math.sqrt(Math.pow(realHeight, 2) + Math.pow(realWidth, 2));

                xp = (r * Math.cos(degree));
                yp =  (r * Math.sin(degree));

                var
                    x = r,
                    y = r;

                this.height = r;
                this.width = r;

                this.clearAll();


                context.beginPath();
                context.arc(xp, yp, 5, 0, 2 * Math.PI);
                context.fillStyle = 'green';
                context.fill();
                context.stroke();

                context.beginPath();
                context.arc(r, 0, 5, 0, 2 * Math.PI);
                context.fillStyle = 'red';
                context.fill();
                context.stroke();

                context.beginPath();
                context.arc(0, r, 5, 0, 2 * Math.PI);
                context.fillStyle = 'red';
                context.fill();
                context.stroke();

                //
                // x = (r / 2);
                // y = (r / 2);
                context.translate(realWidth / 2,  realHeight / 2);
                context.rotate(degree);
                // x = this.width / 2;
                // y = this.height / 2;
                context.translate(-realHeight / 2 , -realHeight / 2);

                this.show(0, 0);

            }

            this.imageShow.clearAll = function () {
               var context = this.getContext('2d');

                context.setTransform(1, 0, 0, 1, 0, 0);
                context.clearRect(0, 0, this.width, this.height);
                context.restore();
            }

            this.imageShow.zoom = function (zoom, type) {
                var imageShow = this;

                if (imageShow) {
                    var
                        width = type === 'in' ? imageShow.width * zoom : imageShow.width / zoom,
                        height = type === 'in' ? imageShow.height * zoom : imageShow.height / zoom,
                        step = type === 'in' ? 1 : -1;

                    imageShow.width = width;
                    imageShow.height = height;

                    this.owner.realWidth = width;
                    this.owner.realHeight = height;

                    this.show();
                }
            };

            this.imageShow.show = function (x, y) {
                var
                    imageShow = this,
                    img = new Image(),
                    width = this.owner.realWidth,
                    height = this.owner.realHeight;

                img.src = this.owner._src;

                if (imageShow) {
                    var context = imageShow.getContext('2d');

                    img.onload = function (e) {
                        context.drawImage(this, x, y, width, height);
                    }
                }
            }


            this.src(src);
        }
    }

}) (daak, window, document);
