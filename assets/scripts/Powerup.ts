const { ccclass, property } = cc._decorator;

@ccclass
export class PowerUpController extends cc.Component {
    @property(cc.AudioClip)
    powerUpSound: cc.AudioClip = null; // 播放获得道具的音效

    onBeginContact(contact: cc.PhysicsContact, self: cc.PhysicsCollider, other: cc.PhysicsCollider) {
        if (other.node.name === 'player') { // 确保是玩家接触到道具
            const playerController = other.node.getComponent('PlayerController');
            if (playerController) {
                playerController.grow(); // 调用玩家变大的方法
                if (this.powerUpSound) {
                    cc.audioEngine.playEffect(this.powerUpSound, false);
                }
                this.node.destroy(); // 销毁道具
            }
        }
    }
}
