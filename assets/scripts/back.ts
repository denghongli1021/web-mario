const { ccclass, property } = cc._decorator;

@ccclass
export default class BackButtonController extends cc.Component {

    @property(cc.String)
    targetScene: string = ''; // 目标场景的名称

    start() {
        // 绑定按钮点击事件
        const backButton = this.node.getComponent(cc.Button);
        if (backButton) {
            backButton.node.on('click', this.onBackButtonPressed, this);
        }
    }

    onBackButtonPressed() {
        if (this.targetScene && this.targetScene.trim() !== '') {
            cc.director.loadScene(this.targetScene);
        } else {
            console.error('No target scene specified for BackButtonController.');
        }
    }
}
