;(function( daak, window, document, undefined ) {
    daak.createCrop = function (parent, x, y) {
        var crop = '<div daak-type="crop" class="daak-crop">\n' +
            '        <div class="daak-handle-top"></div>\n' +
            '        <div class="daak-handle-left-top"></div>\n' +
            '        <div class="daak-handle-left"></div>\n' +
            '        <div class="daak-handle-left-bottom"></div>\n' +
            '        <div class="daak-handle-right-top"></div>\n' +
            '        <div class="daak-handle-right"></div>\n' +
            '        <div class="daak-handle-right-bottom"></div>\n' +
            '        <div class="daak-handle-bottom"></div>\n' +
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

        var daakCrop = daak(crop);
        parent.appendChild(daakCrop);

        daakCrop.left(x);
        daakCrop.top(y);

        daakCrop.aliveCrop();

        return daakCrop;
    }

    daak.fn.aliveCrop = function () {
        this.data('bottomMouseDown', false);
        this.data('topMouseDown', false);
        this.data('rightMouseDown', false);
        this.data('leftMouseDown', false);
        this.data('rightBottomMouseDown', false);
        this.data('leftBottomMouseDown', false);
        this.data('leftTopMouseDown', false);
        this.data('rightTopMouseDown', false);
        this.data('mouseDown', false);

        var
            handleTop = this.find('.daak-handle-top')[0],
            handleBottom = this.find('.daak-handle-bottom')[0],
            handleLeftTop = this.find('.daak-handle-left-top')[0],
            handleLeft = this.find('.daak-handle-left')[0],
            handleLeftBottom = this.find('.daak-handle-left-bottom')[0],
            handleRightTop = this.find('.daak-handle-right-top')[0],
            handleRight = this.find('.daak-handle-right')[0],
            handleRightBottom = this.find('.daak-handle-right-bottom')[0];

        this.addEventListener('mousedown', function (e) {
            e.stopPropagation();
            this.data('mouseDown', true);
            this.data('diffX', e.clientX - this.left());
            this.data('diffY', e.clientY - this.top());
        })

        var topBottomEvent = function (self, e) {
            e.stopPropagation();

            var crop = self.parent();
            crop.data('screenOldY', e.clientY);
            crop.data('oldCropHeight', crop.height());
            crop.data('oldCropTop', crop.top());
        }

        handleTop.addEventListener('mousedown', function (e) {
            this.parent().data('topMouseDown', true);//crop
            topBottomEvent(this, e);
        })

        handleBottom.addEventListener('mousedown', function (e) {
            this.parent().data('bottomMouseDown', true);//crop
            topBottomEvent(this, e);
        })

        var leftRightEvent = function (self, e) {
            e.stopPropagation();

            var crop = self.parent();
            crop.data('screenOldX', e.clientX);
            crop.data('oldCropWidth', crop.width());
            crop.data('oldCropLeft', crop.left());
        }

        handleLeft.addEventListener('mousedown', function (e) {
            this.parent().data('leftMouseDown', true);//crop
            leftRightEvent(this, e);
        })

        handleRight.addEventListener('mousedown', function (e) {
            this.parent().data('rightMouseDown', true);//crop
            leftRightEvent(this, e);
        })

        var leftRightTopBottomEvent = function (self, e) {
            leftRightEvent(self, e);
            topBottomEvent(self, e);
        }

        handleRightBottom.addEventListener('mousedown', function (e) {
            this.parent().data('rightBottomMouseDown', true);//crop
            leftRightTopBottomEvent(this, e);
        })

        handleLeftBottom.addEventListener('mousedown', function (e) {
            this.parent().data('leftBottomMouseDown', true);//crop
            leftRightTopBottomEvent(this, e);
        })

        handleLeftTop.addEventListener('mousedown', function (e) {
            this.parent().data('leftTopMouseDown', true);//crop
            leftRightTopBottomEvent(this, e);
        })

        handleRightTop.addEventListener('mousedown', function (e) {
            this.parent().data('rightTopMouseDown', true);//crop
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
                showImage = crop.parent().getElementsByTagName('canvas')[0];//.find('.daak-showImage')[0],
                showImageCtx = showImage.getContext('2d'),

                selectionImage = crop.parent().getElementsByTagName('canvas')[1];//.find('.daak-selectionImage')[0],
                selectionImageCtx = selectionImage.getContext('2d'),

                left = crop.left(),
                top = crop.top(),
                width =  crop.width(),
                height = crop.height();

            var imgData = showImageCtx.getImageData(left, top, width, height);

            selectionImage.width = crop.width();
            selectionImage.height = crop.height();
            selectionImageCtx.putImageData(imgData,0, 0);
        }

        this.parent().addEventListener('mousemove', function (e) {
            e.stopPropagation();
            var
                x = e.clientX,
                y = e.clientY,

                crop = this.find('.daak-crop')[0];
             if ( crop ) {
                 var
                     screenOldY = crop.data('screenOldY'),
                     screenOldX = crop.data('screenOldX'),
                     oldCropHeight = crop.data('oldCropHeight'),
                     oldCropWidth = crop.data('oldCropWidth'),
                     oldCropTop = crop.data('oldCropTop'),
                     oldCropLeft = crop.data('oldCropLeft'),

                     //----------------------
                     bottomMouseDown = crop.data('bottomMouseDown'),
                     //----------------------
                     topMouseDown = crop.data('topMouseDown'),
                     //----------------------
                     rightMouseDown = crop.data('rightMouseDown'),
                     //----------------------
                     leftMouseDown = crop.data('leftMouseDown'),
                     //----------------------
                     rightBottomMouseDown = crop.data('rightBottomMouseDown'),
                     //----------------------
                     leftBottomMouseDown = crop.data('leftBottomMouseDown'),
                     //----------------------
                     leftTopMouseDown = crop.data('leftTopMouseDown'),
                     //----------------------
                     rightTopMouseDown = crop.data('rightTopMouseDown'),
                     //----------------------
                     mouseDown = crop.data('mouseDown');

                 if (mouseDown) {
                     crop.left(x - crop.data('diffX'));
                     crop.top(y - crop.data('diffY'));

                     showSelection(crop)

                     return false;
                 }

                 if (bottomMouseDown) {
                     return bottomMouseDownExecution(crop, y, screenOldY, oldCropHeight);
                 }

                 if (topMouseDown) {
                     return topMouseDownExecution(crop, y, screenOldY, oldCropHeight, oldCropTop);
                 }

                 if (rightMouseDown) {
                     return rightMouseDownExecution(crop, x, screenOldX, oldCropWidth);
                 }

                 if (leftMouseDown) {
                     return leftMouseDownExecution(crop, x, screenOldX, oldCropWidth, oldCropLeft);
                 }

                 if (rightBottomMouseDown) {
                     return (rightMouseDownExecution(crop, x, screenOldX, oldCropWidth) || bottomMouseDownExecution(crop, y, screenOldY, oldCropHeight));
                 }

                 if (leftBottomMouseDown) {
                     return (leftMouseDownExecution(crop, x, screenOldX, oldCropWidth, oldCropLeft) || bottomMouseDownExecution(crop, y, screenOldY, oldCropHeight));
                 }

                 if (leftTopMouseDown) {
                     return (topMouseDownExecution(crop, y, screenOldY, oldCropHeight, oldCropTop) || leftMouseDownExecution(crop, x, screenOldX, oldCropWidth, oldCropLeft));
                 }

                 if (rightTopMouseDown) {
                     return (topMouseDownExecution(crop, y, screenOldY, oldCropHeight, oldCropTop) || rightMouseDownExecution(crop, x, screenOldX, oldCropWidth));
                 }
             }
        })

        this.parent().addEventListener('mouseup', function (e) {
            e.stopPropagation();
            var crop = this.find('.daak-crop')[0];

            if ( crop ) {
                crop.data('bottomMouseDown', false);
                crop.data('topMouseDown', false);
                crop.data('rightMouseDown', false);
                crop.data('leftMouseDown', false);
                crop.data('rightBottomMouseDown', false);
                crop.data('leftBottomMouseDown', false);
                crop.data('leftTopMouseDown', false);
                crop.data('rightTopMouseDown', false);
                crop.data('mouseDown', false);
            }
        })
    }
}) (daak, window, document);
