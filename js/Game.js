(function () {
    window.Game = Class.extend({
        init : function (option) {
            option = option || {};
            // 0.备份this
            var self = this;
            // 1.fps
            this.fps = option.fps || 60;
            // 2.实例化帧工具类
            this.frameUtil = new FrameUtil();
            // 3.获取画布和上下文
            this.canvas = document.getElementById(option.canvasId);
            this.ctx = this.canvas.getContext('2d');
            // 4.实例化本地数据工具类
            this.staticSourceUtil = new StaticSourceUtil();
            // 5.保存加载好的数据
            this.allImageObj = {};
            // 5.加载数据
            // 所有的图片dom对象,图片的个数,已经加载好图片的个数
            this.staticSourceUtil.loadIamge('r.json',function (allImageObj,imageCount,loadImageCount) {

                if(imageCount == loadImageCount){ // 图片加载完毕
                    // 保存所有的图片数据
                    self.allImageObj = allImageObj;
                    // 运行游戏
                    self.run();
                }
            });

            // 6.记录游戏运行的状态
            this.isRun = true;

        },
        // 开始游戏
        run : function () {
            // 备份 this
            var self = this;
           this.timer = setInterval(function () {
               self.runLoop();
           },1000/self.fps); // 每一帧需要的时间  FPS:50 1s/50 (s)  -->1000/50

            // 创建房子
            this.fangzi = new Background({
                image : this.allImageObj['fangzi'],
                y : this.canvas.height - 256 - 100,
                width : 300,
                height : 256,
                speed : 2
            });

            // 创建树
            this.shu = new Background({
                image : this.allImageObj['shu'],
                y : this.canvas.height - 216 - 48,
                width : 300,
                height : 216,
                speed : 3
            });

            // 创建地板
            this.diban = new Background({
                image : this.allImageObj['diban'],
                y : this.canvas.height - 48,
                width : 48,
                height : 48,
                speed : 4
            });

            // 管道数组
            this.pipeArr = [new Pipe()];

            // 创建鸟
            this.bird = new Bird();

        },
        // 游戏运行循环-->每一帧要调用一次
        runLoop : function () {
            // 0.清屏
            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
            // 1.计算真实的fps
            this.frameUtil.countFps();
            // 2.绘制FPS /FNO
            this.ctx.fillText('FPS/'+this.frameUtil.realFps,15,15);
            this.ctx.fillText('FNO/'+this.frameUtil.currentFrame,15,30);
            // 3.更新和渲染房子
            this.fangzi.update();
            this.fangzi.render();

            // 4.更新和渲染树
            this.shu.update();
            this.shu.render();

            // 5.更新和渲染地板
            this.diban.update();
            this.diban.render();

            // 6.每隔100帧创建一个管道
            if(this.frameUtil.currentFrame % 100 == 0 && this.isRun){
                this.pipeArr.push(new Pipe());
            }

            // 7.更新和渲染管道
            // 先更新
            for (var i = 0; i < this.pipeArr.length; i++) {
                this.pipeArr[i].update();
            }
            // 后绘制
            for (var i = 0; i < this.pipeArr.length; i++) {
                this.pipeArr[i].render();
            }

            // 8.更新和渲染小鸟
            this.bird.update();
            this.bird.render();

        },
        // 暂停游戏
        pause : function () {
            clearInterval(this.timer);
        },
        // 游戏结束
        gameOver : function () {
            // 游戏结束,改变游戏的状态
            this.isRun = false;
            // 暂停背景
            this.fangzi.pause();
            this.shu.pause();
            this.diban.pause();
            // 暂停管道
            for (var i = 0; i < this.pipeArr.length; i++) {
                this.pipeArr[i].pause();
            }

            // 发出小鸟死亡的通知
            this.bird.die = true;

        }
    });
})();