import { throttle } from './func'
function Drag(opts){
    this.opts={
        dragEle: '',
        maxTop: 100,
        ondrag: function (obj) {}
    };
    for (var i in opts) {
        this.opts[i] = opts[i];
    }
    // console.log(this.opts)
    setTimeout(()=>{
        this.init();
        this.setEvent();
    },100)
}

Drag.prototype =  {
    $:function (o,p) {
        return (p||document).querySelector(o);
    }
};
function offset(curEle){
            // console.log(curEle)
            var totalLeft = null,totalTop = null,par = curEle.offsetParent;
            //首先把自己本身的进行累加
            totalLeft += curEle.offsetLeft;
            totalTop += curEle.offsetTop;
            // console.log(par)
            //只要没有找到body，我们就把父级参照物的边框和偏移量累加
            while(par){
                     if(navigator.userAgent.indexOf("MSIE 8.0") === -1){
                         //不是标准的ie8浏览器，才进行边框累加
                         //累加父级参照物边框
                         totalLeft += par.clientLeft;
                         totalTop += par.clientTop;
                     }
                    //累加父级参照物本身的偏移
                    totalLeft += par.offsetLeft;
                    totalTop += par.offsetTop;
                    par = par.offsetParent;
            }
            return {left:totalLeft,top:totalTop};
}
Drag.prototype.init = function () {
    this.dragEle = typeof this.opts.dragEle=='string' ? this.$(this.opts.dragEle) : this.opts.dragEle ;//获得外层元素
    this.offset = offset(this.dragEle)
    // console.log(this.offset)
    this.offsetY = 0;
    this.offsetX = 0;
    this.bLeft = this.dragEle.offsetLeft;
    this.bTop = this.dragEle.offsetTop;
    this.left = this.bLeft;
    this.top = this.bTop;
    this.width = this.dragEle.offsetWidth || this.dragEle.clientWidth || this.dragEle.style.width;
    this.height = this.dragEle.offsetHeight || this.dragEle.clientHeight || this.dragEle.style.height;
    this.dragEle.style.cssText += 'position:absolute;-webkit-transform: translate3d(0,0,0);-webkit-backface-visibility: hidden;';
    this.dragEle.setAttribute('pos', this.left+',' + this.top);
    // console.log(this.dragEle)
};

Drag.prototype.setEvent = function(){
    var self = this;
    var startHandler = function(e){
        // e.preventDefault();
        // e.stopPropagation();
        // if(e)
        console.log(e)
        self.startY = e.touches[0].pageY;
        self.startX = e.touches[0].pageX;

        self.offsetY = 0;
        self.offsetX = 0;
    //    alert(1)
        console.log(1)
        var pos = self.dragEle.getAttribute('pos'),
            left = parseInt(pos.split(',')[0]),
            top = parseInt(pos.split(',')[1]);

        self.left = left;
        self.top = top;

    };

    var moveHandler = function(e){
        e.preventDefault();
        e.stopPropagation();
        self.offsetY = e.targetTouches[0].pageY - self.startY;
        self.offsetX = e.targetTouches[0].pageX - self.startX;

        var pos = self.dragEle.getAttribute('pos'),
            left = self.left + self.offsetX,
            top = self.top + self.offsetY;

        self.dragEle.style.cssText += '-webkit-transform: translate3d('+self.offsetX+'px,'+self.offsetY+'px,0);';
        self.dragEle.setAttribute('pos', left+',' + top);
        // return true
        
        console.log(2)
        //self.opts.ondrag.call(self, {left: left, top: top, offsetX: self.offsetX, type: 'move'});
    };

    var endHandler = function(e){
        var pos = self.dragEle.getAttribute('pos'),
            left = self.left + self.offsetX,
            top = self.top + self.offsetY;
            // console.log(self.left)
        self.dragEle.setAttribute('pos', left+',' + top);
        self.dragEle.style.cssText += '-webkit-transform: translate3d(0,0,0);left: '+ left + 'px; ' + 'top: ' + top + 'px;right:auto;bottom:auto;';
        //self.opts.ondrag.call(self, {left: left,top: top, offsetX: self.offsetX, type: 'end'});

        self.offsetX = self.offsetY = 0;
        console.log(3)
        self.left = left;
        self.top = top;
        return true
    };


    this.dragEle.addEventListener('touchstart', startHandler);
    this.dragEle.addEventListener('touchmove', throttle(moveHandler,10,30));
    this.dragEle.addEventListener('touchend', endHandler)
};


Drag.prototype.pos = function (obj) {
    this.offsetX = this.offsetY = 0;
    this.left = obj.l;
    this.top = obj.t;
    this.dragEle.setAttribute('pos', this.left+'-' + this.top);
    this.dragEle.style.cssText += '-webkit-transform: translate3d(0,0,0);left: '+ obj.l + 'px; ' + 'top: ' + obj.t + 'px;right:auto;bottom:auto;';
};

export default Drag