// 小鸟类
(function () {
    window.Bird = Class.extend({
        init : function () {
            // 1.宽高
            this.width = 85;
            this.height = 60;
            // 2.坐标
            this.x = (game.canvas.width - this.width) * 0.5;
            this.y = 100;
            // 3.翅膀的状态
            // 合法值 : 0 ,1, 2
            this.wing = 0;
            // 4.下落的增量
            this.dy = 0;
            // 5.下落时的帧数
            this.dropFrame = game.frameUtil.currentFrame;
            // 6.下落的角度
            this.rotateAngle = 0;
            // 7.小鸟的状态 0:下落 1 : 上升
            this.state = 0;
            // 8.绑定事件
            this.bindClick();
            // 9.空气的阻力
            this.deleteY = 1;
            // 10.小鸟是否死亡
            this.die = false;
            // 11.动画的索引
            this.dieAnimationIndex = 0;

        },
        // 绘制
        render :function () {
            // 判断小鸟死亡,洒热血
            if(this.die == true){
                //  裁剪的宽高
                var sWidth = 325,sHeight = 138;
                // 总列数
                var maxCol = 5;
                // 计算行号和列号
                var row = parseInt(this.dieAnimationIndex / maxCol);
                var col =  this.dieAnimationIndex % maxCol;
                // 绘制热血
                game.ctx.drawImage(game.allImageObj['blood'],col * sWidth,row * sHeight,sWidth,sHeight,this.x - 100,this.y,sWidth,sHeight);

                // 绘制游戏结束
                var gameOverX = (game.canvas.width - 626) * 0.5;
                var gameOverY = (game.canvas.height - 144) * 0.5;
                game.ctx.drawImage(game.allImageObj['gameover'],gameOverX,gameOverY);
                return;
            }
            // 保存状态
            game.ctx.save();
            // 位移到鸟的中心点
            game.ctx.translate(this.x + this.width * 0.5,this.y + this.height * 0.5);
            // 旋转
            game.ctx.rotate(this.rotateAngle * Math.PI / 180);

            // 还原坐标系(复位)
            game.ctx.translate(-(this.x + this.width * 0.5),-(this.y + this.height * 0.5));
            // 绘制
            game.ctx.drawImage(game.allImageObj['bird'],this.wing * this.width,0,this.width,this.height,this.x,this.y,this.width,this.height);
            // 还原状态
            game.ctx.restore();
        },
        // 更新
        update : function () {
            // 更新死亡动画索引
            if(this.die == true){

                this.dieAnimationIndex++;
                if(this.dieAnimationIndex >= 30){
                    // 暂停游戏
                    game.pause();
                }
                return;
            }
            // 1.每隔5帧挥动一次翅膀
            if(game.frameUtil.currentFrame % 5 == 0){
                this.wing ++;
                if(this.wing > 2){
                    this.wing = 0;
                }
            }
            // 2.根据小鸟的状态判断小鸟是下落还是上升
            if(this.state == 0){ // 下落
                // 自由落体
                // h = 1/2*g*t^2 Math.pow(2,3) 2^3
                this.dy = 0.01 * Math.pow(game.frameUtil.currentFrame - this.dropFrame,2);
                // 更新下落的角度
                this.rotateAngle += 1;

            } else if(this.state == 1){ // 上升
                this.deleteY++;
                // 默认向上冲14
                this.dy = -15 + this.deleteY;

                if(this.dy >= 0){ // 小鸟下落
                    // 更新小鸟的状态
                    this.state = 0;
                    // 更新下落的帧数
                    this.dropFrame = game.frameUtil.currentFrame;
                }
            }
            // 更新位置
            this.y += this.dy;
            // 封锁上空
            if(this.y <= 0){
                this.y = 0;
            }
            // 碰到地板,游戏结束
            if(this.y >= game.canvas.height - this.height - 48){
                // 游戏结束
                game.gameOver();
            }
        },

        // 绑定事件
        bindClick : function () {
            // 备份this
            var self = this;
            game.canvas.onmousedown = function () {
                // 更新小鸟的状态
                self.state = 1;
                //  添加仰角
                self.rotateAngle = -25;
                // 复位空气的阻力
                self.deleteY = 1;
            }
        }
    });
})();