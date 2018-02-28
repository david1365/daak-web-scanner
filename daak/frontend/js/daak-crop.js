;(function( daak, window, document, undefined ) {
    daak.createCrop = function (parent, x, y) {
        var crop = '<div daak-type="crop" class="daak-crop">\n' +
            '        <div daak-bind="handleTop" class="daak-handle-top"></div>\n' +
            '        <div daak-bind="handleLeftTop" class="daak-handle-left-top"></div>\n' +
            '        <div daak-bind="handleLeft" class="daak-handle-left"></div>\n' +
            '        <div daak-bind="handleLeftBottom" class="daak-handle-left-bottom"></div>\n' +
            '        <div daak-bind="handleRightTop" class="daak-handle-right-top"></div>\n' +
            '        <div daak-bind="handleRight" class="daak-handle-right"></div>\n' +
            '        <div daak-bind="handleRightBottom" class="daak-handle-right-bottom"></div>\n' +
            '        <div daak-bind="handleBottom" class="daak-handle-bottom"></div>\n' +
            '        <table>\n' +
            '            <tr>\n' +
            '                <td></td>\n' +
            '                <td></td>\n' +
            '                <td></td>\n' +
            '            </tr>\n' +
            '            <tr>\n' +
            '                <td></td>\n' +
            '                <td></td>\n' +
            '                <td></td>\n' +
            '            </tr>\n' +
            '            <tr>\n' +
            '                <td></td>\n' +
            '                <td></td>\n' +
            '                <td></td>\n' +
            '            </tr>\n' +
            '        </table>\n' +
            '    </div>'

        var daakCrop = daak(crop, true);

        parent.appendChild(daakCrop);

        daakCrop.left(x);
        daakCrop.top(y);

        daakCrop.aliveCrop();

        return daakCrop;
    }

    daak.fn.aliveCrop = function () {
        this.bottomMouseDown = false;
        this.topMouseDown = false;
        this.rightMouseDown = false;
        this.leftMouseDown = false;
        this.rightBottomMouseDown = false;
        this.leftBottomMouseDown = false;
        this.leftTopMouseDown = false;
        this.rightTopMouseDown = false;
        this.mouseDown = false;


        this.addEventListener('mousedown', function (e) {
            e.stopPropagation();
            this.mouseDown = true;
            this.diffX = e.clientX - this.left();
            this.diffY = e.clientY - this.top();
        })

        var topBottomEvent = function (self, e) {
            e.stopPropagation();

            var crop = self.parent();
            crop.screenOldY = e.clientY;
            crop.oldCropHeight = crop.height();
            crop.oldCropTop = crop.top();
        }

        this.handleTop.addEventListener('mousedown', function (e) {
            this.parent().topMouseDown = true;//crop
            topBottomEvent(this, e);
        })

        this.handleBottom.addEventListener('mousedown', function (e) {
            this.parent().bottomMouseDown = true;//crop
            topBottomEvent(this, e);
        })

        var leftRightEvent = function (self, e) {
            e.stopPropagation();

            var crop = self.parent();
            crop.screenOldX = e.clientX;
            crop.oldCropWidth = crop.width();
            crop.oldCropLeft = crop.left();
        }

        this.handleLeft.addEventListener('mousedown', function (e) {
            this.parent().leftMouseDown = true;//crop
            leftRightEvent(this, e);
        })

        this.handleRight.addEventListener('mousedown', function (e) {
            this.parent().rightMouseDown = true;//crop
            leftRightEvent(this, e);
        })

        var leftRightTopBottomEvent = function (self, e) {
            leftRightEvent(self, e);
            topBottomEvent(self, e);
        }

        this.handleRightBottom.addEventListener('mousedown', function (e) {
            this.parent().rightBottomMouseDown = true;//crop
            leftRightTopBottomEvent(this, e);
        })

        this.handleLeftBottom.addEventListener('mousedown', function (e) {
            this.parent().leftBottomMouseDown = true;//crop
            leftRightTopBottomEvent(this, e);
        })

        this.handleLeftTop.addEventListener('mousedown', function (e) {
            this.parent().leftTopMouseDown = true;//crop
            leftRightTopBottomEvent(this, e);
        })

        this.handleRightTop.addEventListener('mousedown', function (e) {
            this.parent().rightTopMouseDown = true;//crop
            leftRightTopBottomEvent(this, e);
        })

        var bottomMouseDownExecution = function (crop, y, screenOldY, oldCropHeight) {
            var
                value = y - (screenOldY);

            crop.height(oldCropHeight + value);

            return false;
        }

        var topMouseDownExecution = function (crop, y, screenOldY, oldCropHeight, oldCropTop) {
            var
                value = screenOldY - y;

            crop.height(oldCropHeight + value);
            crop.top(oldCropTop - value);

            return false;
        }

        var rightMouseDownExecution = function (crop, x, screenOldX, oldCropWidth) {
            var
                value = x - (screenOldX);

            crop.width(oldCropWidth + value);

            return false;
        }

        var leftMouseDownExecution = function (crop, x, screenOldX, oldCropWidth, oldCropLeft) {
            var
                value = screenOldX - x;

            crop.width(oldCropWidth + value);
            crop.left(oldCropLeft - value);

            return false;
        }

        var showSelection = function (crop) {
            var
                showImage = crop.parent().getElementsByTagName('canvas')[0],
                showImageCtx = showImage.getContext('2d'),
                rect = showImage.getBoundingClientRect(),

                selectionImage = crop.parent().getElementsByTagName('canvas')[1],
                selectionImageCtx = selectionImage.getContext('2d');

            var imgData = showImageCtx.getImageData(crop.left() - (rect.left - 10), crop.top() - (rect.top - 10), crop.width(), crop.height());

            // selectionImageCtx.clearRect(0, 0, selectionImage.width, selectionImage.height);

            selectionImage.width = crop.width();
            selectionImage.height = crop.height();

            selectionImageCtx.putImageData(imgData,0, 0);

            selectionImageCtx.restore();
            imgData = null;
        }

        this.parent().addEventListener('mousemove', function (e) {
            e.stopPropagation();
            var
                x = e.clientX,
                y = e.clientY,

                crop = this.crop;
             if ( crop ) {
                 var
                     screenOldY = crop.screenOldY,
                     screenOldX = crop.screenOldX,
                     oldCropHeight = crop.oldCropHeight,
                     oldCropWidth = crop.oldCropWidth,
                     oldCropTop = crop.oldCropTop,
                     oldCropLeft = crop.oldCropLeft;

                 if (crop.mouseDown) {
                     crop.left(x - crop.diffX);
                     crop.top(y - crop.diffY);

                     showSelection(crop);

                     return false;
                 }

                 if (crop.bottomMouseDown) {
                     return bottomMouseDownExecution(crop, y, screenOldY, oldCropHeight);
                 }

                 if (crop.topMouseDown) {
                     return topMouseDownExecution(crop, y, screenOldY, oldCropHeight, oldCropTop);
                 }

                 if (crop.rightMouseDown) {
                     return rightMouseDownExecution(crop, x, screenOldX, oldCropWidth);
                 }

                 if (crop.leftMouseDown) {
                     return leftMouseDownExecution(crop, x, screenOldX, oldCropWidth, oldCropLeft);
                 }

                 if (crop.rightBottomMouseDown) {
                     return (rightMouseDownExecution(crop, x, screenOldX, oldCropWidth) || bottomMouseDownExecution(crop, y, screenOldY, oldCropHeight));
                 }

                 if (crop.leftBottomMouseDown) {
                     return (leftMouseDownExecution(crop, x, screenOldX, oldCropWidth, oldCropLeft) || bottomMouseDownExecution(crop, y, screenOldY, oldCropHeight));
                 }

                 if (crop.leftTopMouseDown) {
                     return (topMouseDownExecution(crop, y, screenOldY, oldCropHeight, oldCropTop) || leftMouseDownExecution(crop, x, screenOldX, oldCropWidth, oldCropLeft));
                 }

                 if (crop.rightTopMouseDown) {
                     return (topMouseDownExecution(crop, y, screenOldY, oldCropHeight, oldCropTop) || rightMouseDownExecution(crop, x, screenOldX, oldCropWidth));
                 }
             }
        })

        this.parent().addEventListener('mouseup', function (e) {
            e.stopPropagation();
            var crop = this.crop;

            if ( crop ) {
                crop.bottomMouseDown = false;
                crop.topMouseDown = false;
                crop.rightMouseDown = false;
                crop.leftMouseDown = false;
                crop.rightBottomMouseDown = false;
                crop.leftBottomMouseDown = false;
                crop.leftTopMouseDown = false;
                crop.rightTopMouseDown = false;
                crop.mouseDown = false;
            }
        });
    }
}) (daak, window, document);
