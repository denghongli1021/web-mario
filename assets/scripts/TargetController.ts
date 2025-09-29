const { ccclass, property } = cc._decorator;

@ccclass
export class TargetController extends cc.Component {
    alreadyScored: boolean = false; // 添加这个属性

    @property(cc.SpriteFrame)
    defeatedSprite: cc.SpriteFrame = null; // 添加新的sprite frame属性
}
