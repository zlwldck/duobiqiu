
var HelloWorldLayer = cc.Layer.extend({
    player:null,
    // map1:null,
    // map2:null,
    map:null,
    isgo:false,
    timeindex:0,
    elist:[],
    index:0,
    last:null,
    gstate:0,
    iswudi:false,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;
        cc.spriteFrameCache.addSpriteFrames("res/enemys.plist");
        this.plane = new cc.Sprite.createWithSpriteFrame("#enemy1.png");
        this.plane.setPosition(150,150);
        this.addChild(this.plane);
        // 添加地图
        this.map1 = new cc.Sprite(res.bg_png);
        this.map1.x = size.width/2;
        this.map1.y = size.height/2;
        // this.addChild(this.map1, 0);

        this.map2 = new cc.Sprite(res.bg_png);
        this.map2.x = size.width/2;
        this.map2.y = size.height/2+size.height;
        // this.addChild(this.map2, 0);

        this.map = new cc.Layer();
        this.addChild(this.map);
        this.map.addChild(this.map1);
        this.map.addChild(this.map2);

        //先创建8个敌人
        for(var i=0;i<8;i++){
            var eb = Eball.createRandomType(260+i*140);
            this.addChild(eb);
            this.elist.push(eb);
        }
        this.gstate = 0;
        this.last = this.elist[7];

        //添加触摸
        if("touches" in cc.sys.capabilities){
            cc.eventManager.addListener({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                onTouchBegan: this._onTouchBegan.bind(this),
                onTouchEnded: this._onTouchEnded.bind(this)
            }, this);
        } else {
            cc.eventManager.addListener({
                event: cc.EventListener.MOUSE,
                onMouseDown: this._onMouseDown.bind(this),
                onMouseUp: this._onMouseUp.bind(this)
            }, this);
        }
        
        //创建主角
        this.player = new cc.Sprite(res.ball1_png);
        this.player.x = cc.winSize.width/2;
        this.player.y = 100;
        this.addChild(this.player);

        this.scheduleUpdate();
        return true;
    },
    _onTouchBegan: function (touch, event) {
        this.isgo = true;
        return true;
    },
    _onTouchEnded: function (touch, event) {
        this.isgo = false;
    },
    _onMouseDown: function (event) {
        this.isgo = true;
    },
    _onMouseUp: function (event) {
        this.isgo = false;
    },
    update:function(dt)
    {
        if(this.gstate==0){
            if(this.isgo){
                this.updateMap(dt);
                this.updateEball(dt);
            }
            //判断碰撞
            for(var i=0;i<this.elist.length;i++)
            {
                if(this.elist[i].isVisible&&isbong(this.elist[i].getPosition(),this.elist[i].width/2,
                    this.player.getPosition(),this.player.width/2)){
                    
                    if(this.elist[i].type == 1)
                    {
                        // this.elist[i].init(this.last.midy+140);
                        // this.last = this.elist[i];
                        this.elist[i].setVisible(false);
                        this.iswudi = true;
                        this.player.initWithFile(res.ball3_png);
                        // this.unschedule(this.endWudi);
                        // this.scheduleOnce(this.endWudi,8);
                        this.player.stopAllActions();
                        this.player.setVisible(true);
                        var action1 = cc.blink(3, 10);
                        this.player.runAction(cc.sequence(
                       cc.delayTime(6),action1,
                       cc.callFunc(this.endWudi, this))
                    );
                    }else if(!this.iswudi){
                        cc.log("游戏结束");
                        this.gstate = 1;
                        //爆炸
                        this.addboom(this.player);
                        this.addboom(this.elist[i]);
                        //
                        this.gameOver();
                    }
                }
            }
        }
    },
    endWudi(){
        this.iswudi = false;
        this.player.initWithFile(res.ball1_png);
    }, 
    gameOver(){
        for(var i=0;i<this.elist.length;i++)
        {
            this.elist[i].isstop = true;
        }
    },
    addboom(p){
        // var animation = new cc.Animation();              
        // for (var i = 1; i <= 6; i++) {  
        //     var frameName = "#bao" + i + ".png";                                
        //     cc.log("frameName = " + frameName);  
        //     var spriteFrame = cc.spriteFrameCache.getSpriteFrame(frameName); 
        //     animation.addSpriteFrame(frameName);                          
        // }  
  
        // animation.setDelayPerUnit(0.15);           //设置两个帧播放时间           
        // animation.setRestoreOriginalFrame(false);    //动画执行后还原初始状态       
  
        // var action = cc.animate(animation); 
        // p.runAction(action); 
    },
    updateEball(dt)
    {
        //运行
        for(var i=0;i<this.elist.length;i++)
        {
            if(this.elist[i].aitype==1)
            {
                this.elist[i].y = this.elist[i].y-dt*260;
                this.elist[i].midy = this.elist[i].y;
            }else{
                this.elist[i].midy = this.elist[i].midy-dt*260;
            }
            if(this.elist[i].y<-this.elist[i].height/2){
            //     this.elist[i].removeFromParent();
            //     this.elist.splice(i, 1);
                this.elist[i].setVisible(true);
                this.elist[i].init(this.last.midy+140);
                this.last = this.elist[i];
            }
        }
        // cc.log(this.elist.length);
        // this.index+=parseInt(dt*260);
        // // cc.log(this.index);
        // if(this.index>140){
        //     this.index = 0;
        // //     var eb = Eball.createRandomType(cc.winSize.height);
        // //     this.map.addChild(eb);
        // //     this.elist.push(eb);
        //     this.elist[0].init(0,this.elist[5].y+140);
        // }
    },
    updateMap(dt)
    {
        
            // var map_y1 = this.map1.y-dt*100;
            // var map_y2 = this.map2.y-dt*100;
            // cc.log(map_y1);
            // //判断
            // if(map_y1<-cc.winSize.height/2)
            // {
            //     this.map1.y = cc.winSize.height+map_y1+cc.winSize.height;
            // }else{
            //     this.map1.y = map_y1;
            // }
            // if(map_y2<-cc.winSize.height/2)
            // {
            //     this.map2.y = cc.winSize.height+map_y2+cc.winSize.height;
            // }else{
            //     this.map2.y = map_y2;
            // }

            var map_y = this.map.y-dt*260;
            if(map_y<-cc.winSize.height)
            {
                this.map.y = 0;
            }else{
                this.map.y = map_y;
            }
    },
});

// cc.rectIntersectsRect(r1,r2);
// cc.pDistance(p1, p2);

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

var isbong = function(p1,r1,p2,r2)  
{  
        //用三角型定理来计算圆心距,然后与半径和对比  
        if(Math.sqrt(Math.pow(p1.x-p2.x,2)+Math.pow(p1.y-p2.y,2))>r1+r2)  
        {  
            return false;  
        }  
        else  
        {  
            return true;  
        }  
}  

