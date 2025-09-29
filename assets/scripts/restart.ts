const {ccclass, property} = cc._decorator;

@ccclass
export default class restart extends cc.Component {

    start () {
        let startbtn = new cc.Component.EventHandler();
        startbtn.target = this.node;
        startbtn.component = "restart";
        startbtn.handler = "loadGameScene";

        cc.find("Canvas/Restart Button").getComponent(cc.Button).clickEvents.push(startbtn);
    }

    loadGameScene(){
        cc.director.loadScene("stage");
    }
   
}
