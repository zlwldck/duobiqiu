
var Eball = cc.Sprite.extend({
    type: 0,
    speed:0,
    dir:0,
    aitype:0,
    m_r:0,//每次转动的弧度
    nowmr:0,//当前到多少角度
    r:0,//半径
    midx:0,
    midy:0,
    isstop:false,
    ctor: function (y) {
        this._super();
        this.init(y);
    },

    init: function (y) {
        var num = parseInt(Math.random()*10);
        if(num<2){
            this.type = 1;//无敌
            this.initWithFile(res.ball3_png);
            this.scale = 1;
        }else if(num>8)
        {
            this.type = 2;//大球
            this.initWithFile(res.eball_png);
            this.scale = 2;
        }else{
            this.type = 3;//普通球
            this.initWithFile(res.eball_png);
            this.scale = 1;
        }
        this.y = y;
        num = parseInt(Math.random()*10);
        if(num>1){
            this.aitype = 1;//普通运动
            this.x = parseInt(Math.random()*(cc.winSize.width-this.width*2)+this.width);
            this.speed =  parseInt(Math.random()*500+100);
        }else{
            this.aitype = 2;//圆运动
            this.midx = cc.winSize.width/2;
            this.midy = this.y;
            this.x = this.midx;
            this.r = parseInt(Math.random()*40)+80;
            this.speed = Math.random()+3;
            //将每次旋转的角度转换为弧度
            // this.m_r = cc.degreesToRadians(1);
            // cc.log(this.m_r);
        }
        
        
        
        
        this.dir = parseInt(Math.random()*2);
        // cc.log(this.x);
        this.scheduleUpdate();
    },
	update: function(dt){
        if(!this.isstop){
            if(this.aitype==1){
        		if(this.dir==0){
        			this.x-=this.speed*dt;
        			if(this.x<this.width/2){
        				this.dir = 1;
        			}
        		}else{
        			this.x+=this.speed*dt;
        			if(this.x>cc.winSize.width-this.width/2){
        				this.dir = 0;
        			}
        		}
            }else if(this.aitype==2){
                var hd = cc.degreesToRadians(this.nowmr)
                var x = this.r*Math.sin(hd);
                var y = this.r*Math.cos(hd);
                // this.midy = this.y;
                this.x = this.midx+ x;
                this.y = this.midy + y;

                this.nowmr+=this.speed;
                if(this.nowmr>360){
                    this.nowmr = 0;
                }
            }
        }
	},
});

Eball.createRandomType = function (y) {
    return new Eball(y);
};