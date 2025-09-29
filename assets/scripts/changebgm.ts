const { ccclass, property } = cc._decorator;

@ccclass
export default class change_scene extends cc.Component {

    @property(cc.AudioClip)
    bgm: cc.AudioClip = null;

    start() {
        this.playBGM();
    }

    playBGM() {
        if (this.bgm) {
            // 播放背景音乐
            cc.audioEngine.playMusic(this.bgm, true);
            // cc.audioEngine.setMusicVolume(0.2);
        }
    }
}
