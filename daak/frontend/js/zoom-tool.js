;(function( daak, window, document, undefined ) {
    daak.elems.zoomTool = {
        // render: '~zoom-tool',
        render: '<div class="daak-zoom-tool" daak-type="zoom-tool">\n' +
                '    <section daak-bind="zDegree" class="daak-zdegree">\n' +
                '        <div daak-bind="zKnobe" class="daak-zknob"></div>\n' +
                '    </section>\n' +
                '</div>',

        body: function () {
            this.mouseDown = false;
            // this.owner.degree = 0;

            this.max = function (value) {
                this._max = parseInt(value);
            }


            this.zKnobe.addEventListener('mousedown', function (e) {
                e.stopPropagation();
                this.owner.mouseDown = true;
                this.diffX = e.clientX - this.offsetLeft;
                // this.diffY = e.clientY - this.offsetTop;

                // e.stopPropagation();
                // var offsetX = e.offsetX;
                // // var offsetY = e.offsetY;
                //
                // this.oldX = e.clientX;
                // this.direction = this.oldX;
                // // this.oldY = offsetY;
                //
                // this.rotateDown = true;
            })

            this.addEventListener('mousemove', function (e) {
                e.stopPropagation();

                // var offsetX = e.offsetX;
                // var offsetY = e.offsetY;

                // if( e.target != this ){ // 'this' is our HTMLElement
                //
                //     offsetX = e.target.offsetLeft + e.offsetX;
                //     // offsetY = e.target.offsetTop + e.offsetY;
                //
                // }

                // var
                //     w = this.owner.zDegreeW,
                //     h = this.owner.zDegreeH,
                //     cw = w / 2,
                //     ch = h / 2,
                //     r = cw,
                //     x = offsetX,
                //     y = offsetY,
                //     realX = x - cw,
                //     realY = y - ch,
                //     // realR = Math.sqrt(Math.pow(-realX, 2) + (Math.pow(-realY, 2))),
                //     RT = realX > 0 && realY > 0 ? true : false,
                //     LT = realX < 0 && realY > 0 ? true : false,
                //     LB = realX < 0 && realY < 0 ? true : false,
                //     RB = realX > 0 && realY < 0 ? true : false,
                //     degree = Math.ceil(Math.degrees(Math.acos(-realX / (r - 10))));
                //     // radian = Math.radians(degree),
                //     // newX = r * Math.cos(radian) + r,
                //     // newY = r * Math.sin(radian) + r ;
                //
                //
                // // degree = LB || RB ? 120 + ((180 - degree) - 29) : degree - 29;
                //
                // daak('#inpt').value = degree + ',' +  RT + ',' + LT + ',' + LB + ',' + RB;


                // if (this.rotateDown) {
                //     var direction = this.oldX - e.clientX;
                //
                //     this.degree += this.direction > direction > 0 ? 1 : -1;
                //     if (this.degree == 360){
                //         this.degree = 0;
                //     }
                //
                //     if (this.degree == 0){
                //         this.degree = 360;
                //     }
                //     // this.zKnobe.left(newX - (this.zKnobe.offsetWidth / 2));
                //     // this.zKnobe.top(newY - (this.zKnobe.offsetHeight / 2));
                //     // this.zoomTool.zDegree.rotate(this.degree);
                //
                //     var imageShow = this.imageShow;
                //     imageShow.rotate(this.degree);
                //     imageShow.show();
                //
                //     this.direction = direction;
                //
                //     // this.ox = newX;
                //
                // }

                var
                    x = e.clientX;
                    // y = e.clientY;

                if (this.mouseDown) {
                    if ((this.zKnobe.offsetLeft >= -5) && (this.zKnobe.offsetLeft <= this.offsetWidth)) {
                        var px = x - this.zKnobe.diffX;
                        px = px < 0 ? 0 : px;
                        this.zKnobe.left(px);
                        // var py = y - this.zKnobe.diffY;
                        // py = py < 0 ? 0 : py;
                        // this.zKnobe.top(py);
                        var degree = (this.zKnobe.offsetLeft) + 2;
                        daak('#inpt').value = degree;
                        this.owner.imageShow.rotate(degree - 2);
                        this.owner.imageShow.show();
                    }
                    else{
                        this.zKnobe.left(this.offsetWidth);
                    }
                }


            })

            this.addEventListener('mouseup', function (e) {
                this.mouseDown = false;
            })

        }
    }
}) (daak, window, document);
