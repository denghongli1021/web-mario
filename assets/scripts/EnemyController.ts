const { ccclass, property } = cc._decorator;

@ccclass
export class EnemyController extends cc.Component {

    @property(cc.SpriteFrame)
    defeatedSprite: cc.SpriteFrame = null;

    @property
    speed: number = 100;

    @property(cc.Node)
    player: cc.Node = null; // Reference to the player node

    private direction: cc.Vec3 = cc.v3(1, 0, 0); // Initial movement direction, to the right
    private changeDirectionInterval: number = 0.1; // Interval to change direction, 1 second
    private elapsedTime: number = 0; // Elapsed time

    onLoad() {
        // Schedule the method to flip scaleX every 0.1 second
        this.schedule(this.flipScaleX, 0.1);
    }

    disableCollider() {
        // Disable collider and animation components
        this.getComponent(cc.PhysicsBoxCollider).enabled = false;
        this.getComponent(cc.RigidBody).enabled = false;
        this.getComponent(cc.Animation).enabled = false;
    }

    flipScaleX() {
        // Toggle the scaleX value for animation effect
        this.node.scaleX *= -1;
    }

    update(dt) {
        // Accumulate elapsed time
        this.elapsedTime += dt;
    
        // If elapsed time exceeds the interval, chase the player
        if (this.elapsedTime >= this.changeDirectionInterval) {
            // Calculate the direction vector from enemy to player
            let directionToPlayer = this.player.position.sub(this.node.position);
            directionToPlayer.y = 0; // Set y component to 0 to prevent vertical movement
            directionToPlayer = directionToPlayer.normalize();
            this.direction = directionToPlayer; // Set direction to chase player
            this.elapsedTime = 0; // Reset elapsed time
        }
    
        // Move the enemy based on direction and speed
        this.node.position = this.node.position.add(this.direction.mul(this.speed * dt));
    }

    // Add other necessary properties and methods
}
