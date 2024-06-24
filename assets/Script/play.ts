// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;


@ccclass
export default class NewClass extends cc.Component {

    // @property(cc.Label)
    // label: cc.Label = null;

    // @property
    // text: string = 'hello';

    @property(cc.Prefab)
    whitePrefab:cc.Prefab=null;

    @property(cc.Prefab)
    blackPrefab:cc.Prefab=null;

    @property("boolean")
    //玩家控制权，true为黑子落子，false为白子落子
    playControl:boolean=true;

    @property("number")
    array : number[][]=[];

    @property(cc.Prefab)
    blackwinPrefab:cc.Prefab=null;

    @property(cc.Prefab)
    whitewinPrefab:cc.Prefab=null;

    @property(cc.Prefab)
    restartPrefab:cc.Prefab=null;

    @property("boolean")
    isgameover:boolean=false;

    

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.array=this.init_array(this.array);
        this.node.on("mousedown",this.creatChess,this);

    }

    start () {

    }

    update (dt) {

        if(this.isgameover==true){
            this.node.off("mousedown",this.creatChess,this);
        }
        else{
            this.node.on("mousedown",this.creatChess,this);
        }

    }

    creatChess(event){
        cc.log("调用创造棋子函数");
        let world_pos : cc.Vec2 =event.getLocation();
        let relative_pos : cc.Vec2 = this.node.convertToNodeSpaceAR(world_pos);
        let x : number = Math.round(relative_pos.x/50);
        let y : number = Math.round(relative_pos.y/50);
        let changed_pos : cc.Vec2 = cc.v2(x*50,y*50);
        let array_pos :cc.Vec2=cc.v2(x+9,y+9);
        if(this.playControl){
            let newnode : cc.Node = cc.instantiate(this.blackPrefab);
            if(this.check_chess(array_pos)){
                this.node.addChild(newnode);
                newnode.setPosition(changed_pos);
                this.array=this.set_array(array_pos);
                if(this.check_GameOver(array_pos,1)){
                   this.node.destroyAllChildren();
                   this.isgameover=true;
                   this.Restart_Game();
                }
                else{
                    this.isgameover=false;
                }
                this.playControl=false; 
            }
        }
        else{
            let newnode : cc.Node = cc.instantiate(this.whitePrefab);
            if(this.check_chess(array_pos)){
                this.node.addChild(newnode);
                newnode.setPosition(changed_pos);
                this.array=this.set_array(array_pos);
                if(this.check_GameOver(array_pos,2)){
                   this.node.destroyAllChildren();
                   this.isgameover=true;
                   this.Restart_Game();
                }
                this.playControl=true;
            }
        }
    }

    init_array(array){
        for(var i =0;i<19;i++){
            array[i]=[];
        }
        for(var i=0;i<19;i++){
            for(var j=0;j<19;j++){
                array[i][j]=0;
            }
        }
        return this.array;
    }

    set_array(pos : cc.Vec2){
        //黑子存为1，白子存为2
        if(this.playControl){
            this.array[pos.x][pos.y]=1;
        }
        else{
            this.array[pos.x][pos.y]=2;
        }
        return this.array;
    }

    check_chess(pos : cc.Vec2){
        if(this.array[pos.x][pos.y]!=0){
            return false;
        }
        else{
            return true;
        }
    }

    //检查游戏是否结束
    check_GameOver(pos : cc.Vec2,color:number){
        if(this.check_Row(pos,color) || this.check_Column(pos,color)||this.check_Positive_Diagonal(pos,color)||this.check_Negative_Diagonal(pos,color)){
            cc.log("win")
            return true;
        }
        return false;

    }

    //检查行
    check_Row(pos :cc.Vec2,color:number){
        let num :number=0
        let i=1;
        while(this.array[pos.x-i][pos.y]==color){
            num+=1;
            i+=1;
        }
        i=1;
        while(this.array[pos.x+i][pos.y]==color){
            num+=1;
            i+=1;
        }
        if(num<4){
            return false;
        }
        return true
    
    }

    //检查列
    check_Column(pos :cc.Vec2,color:number){
        let num :number=0
        let i=1;
        while(this.array[pos.x][pos.y-i]==color){
            num+=1;
            i+=1;
        }
        i=1;
        while(this.array[pos.x][pos.y+i]==color){
            num+=1;
            i+=1;
        }
        if(num<4){
            return false;
        }
        return true
    }



    //检查正向斜线
    check_Positive_Diagonal(pos :cc.Vec2,color:number){
        let num :number=0
        let i=1;
        while(this.array[pos.x+i][pos.y+i]==color){
            num+=1;
            i+=1;
        }
        i=1;
        while(this.array[pos.x-i][pos.y-i]==color){
            num+=1;
            i+=1;
        }
        if(num<4){
            return false;
        }
        return true
    }
        
        

    //检查反向斜线
    check_Negative_Diagonal(pos :cc.Vec2,color:number){
        let num :number=0
        let i=1;
        while(this.array[pos.x+i][pos.y-i]==color){
            num+=1;
            i+=1;
        }
        i=1;
        while(this.array[pos.x-i][pos.y+i]==color){
            num+=1;
            i+=1;
        }
        if(num<4){
            return false;
        }
        return true
    }  

    Restart_Game(){
        if(this.playControl){
            let labelNode :cc.Node=cc.instantiate(this.blackwinPrefab);
            this.node.addChild(labelNode);
            labelNode.setPosition(0,240);
        }
        else{
            let labelNode :cc.Node=cc.instantiate(this.whitewinPrefab);
            this.node.addChild(labelNode);
            labelNode.setPosition(0,240);
        }
        let ButtonNode:cc.Node=cc.instantiate(this.restartPrefab);
        this.node.addChild(ButtonNode);
        ButtonNode.setPosition(0,-200);
    }
}
