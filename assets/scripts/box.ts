const { ccclass, property } = cc._decorator;

@ccclass
export default class Box extends cc.Component {

    @property(cc.Prefab)
    newObjectPrefab: cc.Prefab = null; // 用於生成的新物件的預製件

    @property(cc.AudioClip)
    collisionSound: cc.AudioClip = null; // 撞擊音效

    private had_touch: boolean = false;

    onBeginContact(contact, selfCollider, otherCollider) {
        // 確認碰撞對象是玩家
        if (otherCollider.node.group === 'player' && this.had_touch === false) {
            // 獲取世界法線
            let worldManifold = contact.getWorldManifold();
            let normal = worldManifold.normal;

            // 確認碰撞是從下往上
            if (normal.y < 0) {
                this.generateNewObject();
                this.had_touch = true;

                // 播放碰撞音效
                if (this.collisionSound) {
                    cc.audioEngine.playEffect(this.collisionSound, false);
                }
            }
        }
    }

    generateNewObject() {
        if (this.newObjectPrefab) {
            // 在當前箱子的位置上方30像素生成新物件
            let newObject = cc.instantiate(this.newObjectPrefab);
            newObject.setPosition(this.node.position.x, this.node.position.y + 30); // 調整 Y 坐標
            this.node.parent.addChild(newObject);
        }
    }
}
