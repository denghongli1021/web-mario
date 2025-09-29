const { ccclass, property } = cc._decorator;
import Global from './Global';

@ccclass
export class PlayerController extends cc.Component {

    @property()
    playerSpeed: number = 300;

    @property()
    playerStandSpeed: number = 50;

    score: number;

    @property(cc.Node)
    scorePoints = null;

    @property([cc.Node])
    lifeNodes: cc.Node[] = [];

    @property(cc.AudioClip)
    jumpSound: cc.AudioClip = null;

    @property(cc.AudioClip)
    lifeLossSound: cc.AudioClip = null;

    @property(cc.AudioClip)
    gameOverSound: cc.AudioClip = null;

    @property(cc.AudioClip)
    defeatEnemySound: cc.AudioClip = null;

    @property(cc.AudioClip)
    winSound: cc.AudioClip = null;

    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.Vec3)
    rebornPosition: cc.Vec3 = cc.v3(41.869, 54.798, 0);

    @property(cc.SpriteFrame)
    tag4NewSprite: cc.SpriteFrame = null;

    @property(cc.AudioClip)
    coinSound: cc.AudioClip = null;

    @property(cc.Prefab)
    newObjectPrefab: cc.Prefab = null;

    @property(cc.AudioClip)
    powerupEndSound: cc.AudioClip = null;

    private moveDir = 0;
    private leftDown: boolean = false;
    private rightDown: boolean = false;
    private physicManager: cc.PhysicsManager = null;
    private fallDown: boolean = false;
    private idleFrame: cc.SpriteFrame = null;
    private anim: cc.Animation = null;
    private lives: number = 3;
    private isInvincible: boolean = false;
    private invincibleTime: number = 2;
    private elapsedTime: number = 0;
    private isGrowUp: boolean = false;
    private isAbleToKillEnemy: boolean = true;
    private isWinSoundPlaying: boolean = false;
    private lastMoveDir = 1; // 右

    onLoad() {
        this.physicManager = cc.director.getPhysicsManager();
        this.physicManager.enabled = true;
        this.physicManager.gravity = cc.v2(0, -200);

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    start() {
        this.idleFrame = this.getComponent(cc.Sprite).spriteFrame;
        this.anim = this.getComponent(cc.Animation);
        this.score = 0;
        this.elapsedTime = 0;
    }

    update(dt: number) {
        this.elapsedTime += dt;
        this.updateTimeLabel();
    
        let velocity = this.node.getComponent(cc.RigidBody).linearVelocity;
        velocity.x = this.playerSpeed * this.moveDir;
        this.node.getComponent(cc.RigidBody).linearVelocity = velocity;
    
        if (this.moveDir === 0) {
            this.node.scaleX = this.lastMoveDir;
        }
        else {
            this.node.scaleX = this.moveDir;
        }
        this.fallDown = this.getComponent(cc.RigidBody).linearVelocity.y != 0;
    
        this.playerAnimation();
        this.checkPlayerPosition();
    }

    updateTimeLabel() {
        this.timeLabel.string = `${Math.floor(this.elapsedTime)}s`;
    }

    updateScore(number: number) {
        this.score += number;
        this.scorePoints.getComponent(cc.Label).string = this.score.toString();
    }

    updateLives() {
        if (this.lives > 0) {
            this.lives -= 1;
            cc.audioEngine.playEffect(this.lifeLossSound, false);
            this.lifeNodes[this.lives].destroy();
        }
        if (this.lives <= 0) {
            cc.audioEngine.playEffect(this.gameOverSound, false);
            cc.director.loadScene("lose");
        }
    }

    checkPlayerPosition() {
        if (this.node.y <= 0) {
            this.updateLives();
            this.reborn(this.rebornPosition);
        }
    }

    onBeginContact(contact: cc.PhysicsContact, self: cc.PhysicsCollider, other: cc.PhysicsCollider) {
        if (!this.isInvincible) {
            if (other.tag == 1 || other.tag == 100) { // [enemy] enemy which can't be defeated
                if (this.isGrowUp) {
                    this.endPowerup();
                }
                else {
                    this.updateLives();
                }
                this.becomeInvincible();
            } else if (other.tag == 3 && !this.fallDown) { // enemy
                const enemy = other.node.getComponent('EnemyController');
                if (this.isGrowUp) {
                    this.endPowerup();
                    this.becomeInvincible();
                }
                else {
                    if (enemy.getComponent(cc.PhysicsCollider).enabled == true) {
                        this.updateLives();
                        this.becomeInvincible();
                    }
                }
            } 
        }
        if (other.tag == 3 && this.fallDown && this.isAbleToKillEnemy) {
            const enemy = other.node.getComponent('EnemyController');
            if (enemy) {
                enemy.getComponent(cc.Sprite).spriteFrame = enemy.defeatedSprite;
                this.updateScore(1000);
                enemy.disableCollider();
                cc.audioEngine.playEffect(this.defeatEnemySound, false);
                this.scheduleOnce(() => {
                    if (other.node) {
                        other.node.destroy();
                    }
                }, 0.2);
                this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 400);
            }
        } else if (other.tag == 2) { // win flag
            this.updateScore(400);
            if (this.winSound && !this.isWinSoundPlaying) {
                this.isWinSoundPlaying = true;
                const audioID = cc.audioEngine.playEffect(this.winSound, false);
                const audioDuration = cc.audioEngine.getDuration(audioID);
                this.scheduleOnce(() => {
                    cc.audioEngine.setMusicVolume(1);
                    cc.director.loadScene("win");
                    this.isWinSoundPlaying = false;
                }, audioDuration);
            } else {
                cc.audioEngine.setMusicVolume(1);
                cc.director.loadScene("win");
                Global.score = this.score;
            }
        } else if (other.tag == 4) {
            const playerVelocity = this.node.getComponent(cc.RigidBody).linearVelocity;
            if (playerVelocity.y > 0) {
                const target = other.node.getComponent('TargetController');
                if (target && !target.alreadyScored) {
                    target.alreadyScored = true;
                    this.updateScore(500);
                    const otherSprite = other.node.getComponent(cc.Sprite);
                    const otherAnimation = other.node.getComponent(cc.Animation);

                    if (otherSprite && this.tag4NewSprite) {
                        otherSprite.spriteFrame = this.tag4NewSprite;
                    }

                    if (otherAnimation) {
                        otherAnimation.stop();
                    }
                }
            }
        } else if (other.tag == 5) {
            const coin = other.node.getComponent('CoinController');
            if (coin && !coin.alreadyCollected) {
                coin.collect();
                this.updateScore(100);
            }
        } else if (other.tag == 6 && this.isGrowUp) { // block can be destroyed 
            let worldManifold = contact.getWorldManifold();
            let normal = worldManifold.normal;
            this.updateScore(500);
            // 確認碰撞是從下往上
            if (normal.y > 0) {
                if (other.node) {
                    other.node.destroy();
                }
            }
        }
    }

    becomeInvincible() {
        this.isInvincible = true;
        this.node.runAction(cc.blink(this.invincibleTime, 10));
        this.scheduleOnce(() => {
            this.isInvincible = false;
        }, this.invincibleTime);
    }

    onKeyDown(event: cc.Event.EventKeyboard) {
        switch (event.keyCode) {
            case cc.macro.KEY.left:
                this.leftDown = true;
                this.playerMove(-1);
                break;
            case cc.macro.KEY.right:
                this.rightDown = true;
                this.playerMove(1);
                break;
            case cc.macro.KEY.a:
                this.reborn(this.rebornPosition);
                break;
            case cc.macro.KEY.space:
                this.playJumpSound();
                break;
        }
    }

    onKeyUp(event: cc.Event.EventKeyboard) {
        switch (event.keyCode) {
            case cc.macro.KEY.left:
                this.leftDown = false;
                if (this.rightDown)
                    this.playerMove(1);
                else
                    this.playerMove(0);
                break;
            case cc.macro.KEY.right:
                this.rightDown = false;
                if (this.leftDown)
                    this.playerMove(-1);
                else
                    this.playerMove(0);
                break;
        }
    }

    public playerMove(moveDir: number) {
        if (moveDir !== 0) {
            this.lastMoveDir = moveDir; // 记录移动方向
        }
        this.moveDir = moveDir;
    }

    public playerAnimation() {
        if (this.fallDown) {
            if (!this.anim.getAnimationState("fall_side").isPlaying) {
                this.anim.play("fall_side");
            }
        } else {
            if (this.moveDir == 0) {
                this.getComponent(cc.Sprite).spriteFrame = this.idleFrame;
                this.anim.stop();
            } else if (!this.anim.getAnimationState("walk").isPlaying) {
                this.anim.play("walk");
            }
        }
    }

    public playJumpSound() {
        if (!this.fallDown) {
            cc.audioEngine.playEffect(this.jumpSound, false);
            this.playerJump(500);
        }
    }

    public playerJump(velocity: number) {
        if (!this.fallDown) {
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, velocity);
        }
    }

    public reborn(rebornPos: cc.Vec3) {
        this.node.position = rebornPos;
        this.getComponent(cc.RigidBody).linearVelocity = cc.v2();
        this.becomeInvincible();
    }

    // 添加玩家变大方法
    public grow() {
        const currentScale = this.node.scale;
        const newScale = currentScale*2;
        this.node.scale = newScale;
        this.node.scaleX = 2;
        this.node.scaleY = 2;   
        this.isGrowUp = true;
        this.updateScore(1000);
        // const collider = this.node.getComponent(cc.PhysicsCollider);
        // if (collider instanceof cc.PhysicsBoxCollider) {
        //     collider.size.width *= 2;
        //     collider.size.height *= 2;
        //     collider.apply();
        // }
        // Schedule a function to revert the scale after ten seconds
        // this.scheduleOnce(() => {
        //     this.node.scaleX = 1;
        //     this.node.scaleY = 1; // Revert the scale back to the original
        //     this.isGrowUp = false;
        //     this.endPowerup(); // 调用 endPowerup 方法播放音效
        // }, 5);
    }

    public endPowerup() {
        // 播放 powerup 结束音效
        if (this.powerupEndSound) {
            cc.audioEngine.playEffect(this.powerupEndSound, false);
        }
        this.node.scaleX = 1;
        this.node.scaleY = 1; // Revert the scale back to the original
        this.isGrowUp = false;
        this.isAbleToKillEnemy = false;
        this.scheduleOnce(() => {
            this.isAbleToKillEnemy = true;
        }, 2);
    }
}
