const { ccclass, property } = cc._decorator;

@ccclass
export default class GameController extends cc.Component {

    @property(cc.Node)
    triggerNode: cc.Node = null; // 触发节点

    @property(cc.Node)
    targetObject: cc.Node = null; // 要激活的目标物体节点

    start(): void {
        this.targetObject.active = false;
    }

    onBeginContact(contact: cc.PhysicsContact, self: cc.PhysicsCollider, other: cc.PhysicsCollider) {
        if (other.tag == 100) {
            this.targetObject.active = true;
        }
    }
}
