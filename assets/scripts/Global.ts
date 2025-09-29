const { ccclass, property } = cc._decorator;

@ccclass
export default class Global extends cc.Component {
    public static score: number = 0;
}
