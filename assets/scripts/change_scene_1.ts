const { ccclass, property } = cc._decorator;

@ccclass
export default class change_scene extends cc.Component {
    start() {
        cc.director.preloadScene("stage1", () => {
            cc.log("Next scene preloaded");
        });
        
        cc.director.getScheduler().schedule(() => {
            cc.director.loadScene("stage1");
        }, this, 3, 0, 0, false);
    }
}
