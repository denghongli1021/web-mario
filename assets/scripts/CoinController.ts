const { ccclass, property } = cc._decorator;

@ccclass
export class CoinController extends cc.Component {

    @property(cc.AudioClip)
    collectSound: cc.AudioClip = null;

    @property(cc.AnimationClip)
    collectAnimation: cc.AnimationClip = null;

    alreadyCollected: boolean = false;

    onLoad() {
        this.node.getComponent(cc.PhysicsCollider).tag = 5; // 设置碰撞 tag
        this.node.getComponent(cc.PhysicsCollider).sensor = true; // 设置为触发器
    }

    collect() {
        if (this.alreadyCollected) {
            return;
        }

        this.alreadyCollected = true;

        // 播放音效
        if (this.collectSound) {
            cc.audioEngine.playEffect(this.collectSound, false);
        }

        // 播放动画
        const animation = this.node.getComponent(cc.Animation);
        if (animation && this.collectAnimation) {
            animation.play(this.collectAnimation.name);
            animation.on('finished', this.onAnimationFinished, this);
        } else {
            if (this.node) {
                this.node.destroy();
            }
        }
    }

    onAnimationFinished() {
        if (this.node) {
            this.node.destroy();
        }
    }
}
