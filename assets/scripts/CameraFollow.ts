const {ccclass, property} = cc._decorator;

@ccclass
export class CameraFollow extends cc.Component {

    @property(cc.Node)
    target: cc.Node = null;  // 跟随的目标

    @property
    offsetY: number = 100;  // 相机相对于目标的垂直偏移

    @property
    thresholdY: number = 200; // 当目标节点的 y 坐标大于该值时，相机开始跟随目标节点的 x 坐标

    @property
    max_targetx: number = 1540;

    @property
    min_targetx: number = 100;

    update (dt: number) {
        if (this.target) {
            
            if (this.target.x >= this.min_targetx && this.target.x <= this.max_targetx) {
                this.node.x = this.target.x - 100;
            }
            // 更新相机的水平位置
            else {

            }
        }
    }
}
