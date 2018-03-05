;(function( daak, window, document, undefined ) {
    daak.elems.zoomTool = {
        render: '~zoom-tool',

        body: function () {
            this.mouseDown = false;

            this.addEventListener('mousemove', function (e) {
                e.stopPropagation();
            })

            this.zKnobe.addEventListener('mousedown', function (e) {
                this.owner.mouseDown = true;
            })

            this.zDegree.addEventListener('mousemove', function (e) {

                var
                    // zKnobe = this.owner.zKnobe,
                    // zKnobeW = zKnobe.offsetWidth,
                    // zKnobeH = zKnobe.offsetHeight,
                    w = this.offsetWidth,
                    h = this.offsetHeight,
                    cw = w / 2,
                    ch = h / 2,
                    r = cw - 20,
                    x = e.offsetX,
                    y = e.offsetY,
                    realX = x - cw,
                    realY = y - ch,
                    // realR = Math.sqrt(Math.pow(-realX, 2) + (Math.pow(-realY, 2))),
                    RT = realX > 0 && realY > 0 ? true : false,
                    LT = realX < 0 && realY > 0 ? true : false,
                    LB = realX < 0 && realY < 0 ? true : false,
                    RB = realX > 0 && realY < 0 ? true : false,
                    degree = Math.ceil(Math.degrees(Math.acos(realX / r))),
                    radian = Math.radians(degree),
                    newX = r * Math.cos(radian) + r,
                    newY = r * Math.sin(radian) + r ;

                daak('#inpt').value = x + '<<<+ deg =' + degree + ',' + realX +',' + r/*+ RT + ',' + LT + ',' + LB + ',' + RB*/;


                if (this.owner.mouseDown) {
                    this.owner.zKnobe.left(newX + 3);
                    this.owner.zKnobe.top(newY);
                }
            })

            this.zKnobe.addEventListener('mouseup', function (e) {
                this.owner.mouseDown = false;
            })

        }
    }
}) (daak, window, document);
