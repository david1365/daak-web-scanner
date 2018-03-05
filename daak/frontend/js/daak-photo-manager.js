;(function( daak, window, document, undefined ) {
    daak.elems.PhotoManager = {
        render:
            '<div class="daak-photo-manager daak-no-select" daak-type="photo-manager">\n' +
            '    <aside daak-bind="content" class="daak-content">\n' +
            '        <canvas daak-bind="imageShow" class="daak-image-show"></canvas>\n' +
            '    </aside>\n' +
            '    <aside daak-bind="toolbox" class="daak-toolbox">\n' +
            '        <section daak-bind="window" class="daak-window">\n' +
            '            <canvas daak-bind="imageSelection" class="daak-image-selection"></canvas>\n' +
            '        </section>\n' +
            '\n' +
            '        <section daak-bind="tools" class="daak-tools">\n' +
            '            <button daak-bind="zoomIn" class="daak-icon-zoom-in"></button>\n' +
            '            <button daak-bind="zoomOut" class="daak-icon-zoom-out"></button>\n' +
            '            <button daak-bind="cropButton" class="daak-icon-crop"></button>\n' +
            '            <button daak-bind="rotate" class="daak-icon-rotate"></button>\n' +
            '            <button daak-bind="send" class="daak-icon-send"></button>\n' +
            '        </section>\n' +

            // '       <section>' +
            // '         <zoomTool daak-bind="zoomTool" max="360"></zoomTool>' +
            // '       </section>' +
            '    </aside>' +
            '</div>',

        body: function (src) {
            // daak.direction = {
            //     VERTICAL: 'vertical',
            //     HORIZONTAL: 'horizontal'
            // };

            this.mouseDown = false;
            this.zoomNumber = 1.1;

            this.toolbox.addEventListener('mousemove', function (e) {
                e.stopPropagation();
            })

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

                    self.showSelection();
                }

            };

            this.tools.addEventListener('mousedown', function (e) {
                e.stopPropagation();
            });

            this.zoomIn.addEventListener('click', function (e) {
                e.stopPropagation();
                var imageShow = this.owner.imageShow;

                imageShow.zoom(this.owner.zoomNumber, 'in');
                imageShow.rotate(this.owner.degree);
                imageShow.show();
            });

            this.zoomOut.addEventListener('click', function (e) {
                e.stopPropagation();
                var imageShow = this.owner.imageShow;

                imageShow.zoom(this.owner.zoomNumber, 'out');
                imageShow.rotate(this.owner.degree);
                imageShow.show();
            });

            this.rotate.addEventListener('click', function (e) {
                e.stopPropagation();

                var
                    degree = this.owner.degree,
                    degree = degree == 360 ? 90 : degree + 90,
                    imageShow = this.owner.imageShow;

                this.owner.degree = degree;

                imageShow.rotate(degree);
                imageShow.show();
            });

            this.showSelection = function (crop) {
                var
                    showImage = this.getElementsByTagName('canvas')[0],
                    showImageCtx = showImage.getContext('2d'),
                    rect = showImage.getBoundingClientRect(),

                    selectionImage = this.getElementsByTagName('canvas')[1],
                    selectionImageCtx = selectionImage.getContext('2d');
                    selectionImage.clearAll();

                var
                    left = crop ? crop.offsetLeft - (rect.left - 10) : 0,
                    top = crop ? crop.offsetTop - (rect.top - 10) : 0,
                    width = crop ? crop.offsetWidth : showImage.width,
                    height = crop ? crop.offsetHeight : showImage.height,
                    imgData = showImageCtx.getImageData(left, top, width, height);


                selectionImage.width = crop ? crop.offsetWidth : showImage.width;
                selectionImage.height = crop ? crop.offsetHeight : showImage.height;

                selectionImageCtx.putImageData(imgData, 0, 0);

                selectionImageCtx.restore();
                imgData = null;

            }

            this.addEventListener('mousedown', function (e) {
                var
                    crop = this.crop;
                    rect = this.getBoundingClientRect(),
                    x = e.clientX,
                    y = e.clientY;

                if (crop) {
                    this.showSelection();
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
            });

            this.imageShow.rotate = function (degree) {
                var
                    context = this.getContext('2d'),
                    realWidth = this.owner.realWidth,
                    realHeight = this.owner.realHeight,
                    r = this.owner.r = Math.sqrt(Math.pow(realHeight, 2) + Math.pow(realWidth, 2)),

                    cr = r / 2,
                    cix = (realWidth / 2),
                    ciy = (realHeight / 2),
                    divided = cix > ciy ? ciy : ciy,
                    // direction = cix > ciy ? daak.direction.HORIZONTAL : daak.direction.VERTICAL,
                    basicGrade = Math.degrees(Math.asin(divided / cr)), //sin(a)
                    otherDegree = 90 - basicGrade,
                    radian = Math.radians(degree),
                    rightTopRadian = Math.radians(degree - basicGrade),
                    rightBottomRadian = Math.radians(degree + basicGrade),
                    leftBottomRadian = Math.radians(degree + basicGrade + (2 *otherDegree)),
                    leftTopRadian = Math.radians(degree + ((3 * basicGrade) + (2 * otherDegree))),

                    xRightTop = (cr * Math.cos(rightTopRadian)),
                    yRightTop = (cr * Math.sin(rightTopRadian)),

                    xRightBottom = (cr * Math.cos(rightBottomRadian)),
                    yRightBottom = (cr * Math.sin(rightBottomRadian)),

                    xLeftBottom = (cr * Math.cos(leftBottomRadian)),
                    yLeftBottom = (cr * Math.sin(leftBottomRadian)),

                    xLeftTop = (cr * Math.cos(leftTopRadian)),
                    yLeftTop = (cr * Math.sin(leftTopRadian));

                var
                    xyArr = [];
                    xyArr[0] = yLeftTopP = yLeftTop + ciy,
                    xyArr[2] = yRightTopP = yRightTop + ciy,

                    xyArr[1] = xLeftTopP = xLeftTop + cix,
                    xyArr[3] = xRightTopP = xRightTop + cix,

                    xyArr[4] = yLeftBottomP = yLeftBottom + ciy,
                    xyArr[6] = yRightBottomP = yRightBottom + ciy,

                    xyArr[5] = xLeftBottomP = xLeftBottom + cix,
                    xyArr[7] = xRightBottomP = xRightBottom + cix;

                var
                    newX = 0,
                    newY = 0,
                    countY = 0,
                    countX = 0,
                    minY = realHeight,
                    minX = realWidth;
                for( var i = 0; i < xyArr.length; i++) {
                    var tmp;
                    if (xyArr[i] < 0) {
                        if (i % 2 === 0 ){ //y
                            tmp = Math.abs(xyArr[i]) * 2;
                            newY = newY < tmp ? tmp : newY;
                        }
                        else {
                            tmp = Math.abs(xyArr[i]) * 2;
                            newX = newX < tmp ? tmp : newX;
                        }
                    }

                    if (i % 2 === 0) {
                        minY = xyArr[i] < minY ? xyArr[i] : minY;
                        if (( xyArr[i] > 0) && (xyArr[0] < realHeight)){
                            countY++; //if countY >= 4 means Height is big
                        }
                    }
                    else {
                        minX = xyArr[i] < minX ? xyArr[i] : minX;
                        if (( xyArr[i] > 0) && (xyArr[0] < realWidth)){
                            countX++; //if countX >= 4 means Width is big
                        }
                    }
                }

                // daak('#inpt').value = xyArr[0]  + ',' + xyArr[2] + ',' + xyArr[4] + ',' + xyArr[6]

                var
                    finalWidth = (realWidth + newX),
                    finalHeight = (realHeight + newY);

                if (countY >= 4) {
                    finalHeight -= (minY * 2);
                }
                else if(countX >= 4) {
                    finalWidth -= (minX * 2);
                }

                this.height = finalHeight;
                this.width = finalWidth;

                // this.height = r * 3;
                // this.width = r * 3;

                this.clearAll();

                // context.translate(cix,  ciy);
                // context.beginPath();
                // context.rect(0, 0, realWidth, realHeight);
                // context.rect(0, 0, finalWidth, finalHeight);
                // context.stroke();

                context.translate(finalWidth / 2,  finalHeight / 2);
                // context.translate(realWidth / 2,  realHeight / 2);

                // context.beginPath();
                // context.arc(xRightTop, yRightTop, 5, 0, 2 * Math.PI);
                // context.fillStyle = 'orange';
                // context.fill();
                // context.stroke();
                //
                // context.beginPath();
                // context.arc(xRightBottom, yRightBottom, 5, 0, 2 * Math.PI);
                // context.fillStyle = 'black';
                // context.fill();
                // context.stroke();
                //
                // context.beginPath();
                // context.arc(xLeftBottom, yLeftBottom, 5, 0, 2 * Math.PI);
                // context.fillStyle = 'green';
                // context.fill();
                // context.stroke();
                //
                // context.beginPath();
                // context.arc(xLeftTop, yLeftTop, 5, 0, 2 * Math.PI);
                // context.fillStyle = 'red';
                // context.fill();
                // context.stroke();

                context.rotate(radian);
                context.translate(-cix , -ciy);
                //
                // context.beginPath();
                // context.rect(0, 0, realWidth, realHeight);
                // context.stroke();
            };

            daak.fn.clearAll = function () {
               var context = this.getContext('2d');

                context.setTransform(1, 0, 0, 1, 0, 0);
                context.clearRect(0, 0, this.width, this.height);
                context.restore();
            };

            this.imageShow.zoom = function (zoom, type) {
                var imageShow = this;

                if (imageShow) {
                    var
                        width = type === 'in' ? imageShow.width * zoom : imageShow.width / zoom,
                        height = type === 'in' ? imageShow.height * zoom : imageShow.height / zoom;
                        // step = type === 'in' ? 1 : -1;

                    imageShow.width = width;
                    imageShow.height = height;

                    this.owner.realWidth = width;
                    this.owner.realHeight = height;
                }
            };

            this.imageShow.show = function () {
                var
                    imageShow = this,
                    img = new Image(),
                    width = this.owner.realWidth,
                    height = this.owner.realHeight;

                img.src = this.owner._src;

                if (imageShow) {
                    var context = imageShow.getContext('2d');

                    img.onload = function (e) {
                        context.drawImage(this, 0, 0, width, height);
                    }
                }
            };


            this.src(src);
        }
    }

}) (daak, window, document);
