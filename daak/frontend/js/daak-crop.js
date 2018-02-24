;(function( daak, window, document, undefined ) {
    daak.fn.move = function (parent) {
        daak.crop = {};
        daak.crop.mouseDown = false;

        this.left(150);
        this.top(50);
        this.width(100);
        this.height(100);

        var
            handleTop = this.querySelectorAll('.daak-handle-top')[0],
            handleBottom = this.querySelectorAll('.daak-handle-bottom')[0],
            handleLeftTop = this.querySelectorAll('.daak-handle-left-top')[0],
            handleLeft = this.querySelectorAll('.daak-handle-left')[0],
            handleLeftBottom = this.querySelectorAll('.daak-handle-left-bottom')[0],
            handleRightTop = this.querySelectorAll('.daak-handle-right-top')[0],
            handleRight = this.querySelectorAll('.daak-handle-right')[0],
            handleRightBottom = this.querySelectorAll('.daak-handle-right-bottom')[0];

        this.addEventListener('mousedown', function (e) {
            daak.crop.mouseDown = true;
            daak.crop.diffX = e.screenX - this.left();
            daak.crop.diffY = e.screenY - this.top();
            daak.crop.crop = this;
        })

        var topBottomEvent = function (self, e) {
            e.stopPropagation();
            daak.crop.screenOldY = e.screenY;
            daak.crop.oldCropHeight = self.parent().height();
            daak.crop.oldCropTop = self.parent().top();
            daak.crop.crop = self.parent();
        }

        handleTop.addEventListener('mousedown', function (e) {
            daak.crop.topMouseDown = true;
            topBottomEvent(this, e);
        })

        handleBottom.addEventListener('mousedown', function (e) {
            daak.crop.bottomMouseDown = true;
            topBottomEvent(this, e);
        })

        var leftRightEvent = function (self, e) {
            e.stopPropagation();
            daak.crop.screenOldX = e.screenX;
            daak.crop.oldCropWidth = self.parent().width();
            daak.crop.oldCropLeft = self.parent().left();
            daak.crop.crop = self.parent();
        }

        handleLeft.addEventListener('mousedown', function (e) {
            daak.crop.leftMouseDown = true;
            leftRightEvent(this, e);
        })

        handleRight.addEventListener('mousedown', function (e) {
            daak.crop.rightMouseDown = true;
            leftRightEvent(this, e);
        })

        var leftRightTopBottomEvent = function (self, e) {
            leftRightEvent(self, e);
            topBottomEvent(self, e);
        }

        handleRightBottom.addEventListener('mousedown', function (e) {
            daak.crop.rightBottomMouseDown = true;
            leftRightTopBottomEvent(this, e);
        })

        handleLeftBottom.addEventListener('mousedown', function (e) {
            daak.crop.leftBottomMouseDown = true;
            leftRightTopBottomEvent(this, e);
        })

        handleLeftTop.addEventListener('mousedown', function (e) {
            daak.crop.leftTopMouseDown = true;
            leftRightTopBottomEvent(this, e);
        })

        handleRightTop.addEventListener('mousedown', function (e) {
            daak.crop.rightTopMouseDown = true;
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

        this.parent().addEventListener('mousemove', function (e) {
            e.stopPropagation();
            var
                x = e.screenX,
                y = e.screenY,
                screenOldY = daak.crop.screenOldY,
                screenOldX = daak.crop.screenOldX,
                oldCropHeight = daak.crop.oldCropHeight,
                oldCropWidth = daak.crop.oldCropWidth,
                oldCropTop =  daak.crop.oldCropTop,
                oldCropLeft = daak.crop.oldCropLeft,
                crop = daak.crop.crop,
            //----------------------
                bottomMouseDown = daak.crop.bottomMouseDown,
            //----------------------
                topMouseDown = daak.crop.topMouseDown,
            //----------------------
                rightMouseDown = daak.crop.rightMouseDown,
            //----------------------
                leftMouseDown = daak.crop.leftMouseDown,
            //----------------------
                rightBottomMouseDown = daak.crop.rightBottomMouseDown,
            //----------------------
                leftBottomMouseDown = daak.crop.leftBottomMouseDown,
            //----------------------
                leftTopMouseDown = daak.crop.leftTopMouseDown,
            //----------------------
                rightTopMouseDown = daak.crop.rightTopMouseDown,
            //----------------------
                mouseDown = daak.crop.mouseDown;

            if (mouseDown){
                crop.left(x - daak.crop.diffX);
                crop.top(y - daak.crop.diffY);

                return false;
            }

            if (bottomMouseDown){
                return bottomMouseDownExecution(crop, y, screenOldY, oldCropHeight);
            }

            if (topMouseDown){
                return topMouseDownExecution(crop, y, screenOldY, oldCropHeight, oldCropTop);
            }

            if (rightMouseDown){
                return rightMouseDownExecution(crop, x, screenOldX, oldCropWidth);
            }

            if (leftMouseDown){
                return leftMouseDownExecution(crop, x, screenOldX, oldCropWidth, oldCropLeft);
            }

            if (rightBottomMouseDown){
                return (rightMouseDownExecution(crop, x, screenOldX, oldCropWidth) || bottomMouseDownExecution(crop, y, screenOldY, oldCropHeight));
            }

            if (leftBottomMouseDown){
                return (leftMouseDownExecution(crop, x, screenOldX, oldCropWidth, oldCropLeft) || bottomMouseDownExecution(crop, y, screenOldY, oldCropHeight));
            }

            if (leftTopMouseDown) {
                return (topMouseDownExecution(crop, y, screenOldY, oldCropHeight, oldCropTop) || leftMouseDownExecution(crop, x, screenOldX, oldCropWidth, oldCropLeft));
            }

            if (rightTopMouseDown) {
                return (topMouseDownExecution(crop, y, screenOldY, oldCropHeight, oldCropTop) || rightMouseDownExecution(crop, x, screenOldX, oldCropWidth));
            }
        })

        this.parent().addEventListener('mouseup', function (e) {
            e.stopPropagation();
            daak.crop.bottomMouseDown = false;
            daak.crop.topMouseDown = false;
            daak.crop.rightMouseDown = false,
            daak.crop.leftMouseDown = false;
            daak.crop.rightBottomMouseDown = false;
            daak.crop.leftBottomMouseDown = false;
            daak.crop.leftTopMouseDown = false;
            daak.crop.rightTopMouseDown = false;
            daak.crop.mouseDown = false;
        })
    }
}) (daak, window, document);
