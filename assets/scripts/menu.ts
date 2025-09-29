const { ccclass, property } = cc._decorator;

@ccclass
export default class Menu extends cc.Component {

    @property(cc.AudioClip)
    bgm: cc.AudioClip = null; // 添加属性来引用背景音乐文件

    start() {
        this.playBGM();

        let startBtn = new cc.Component.EventHandler();
        startBtn.target = this.node;
        startBtn.component = "menu";
        startBtn.handler = "loadGameScene";

        let signinBtn = new cc.Component.EventHandler();
        signinBtn.target = this.node;
        signinBtn.component = "menu";
        signinBtn.handler = "loadGameScene2";

        let signupBtn = new cc.Component.EventHandler();
        signupBtn.target = this.node;
        signupBtn.component = "menu";
        signupBtn.handler = "loadGameScene3";

        cc.find("Canvas/Start Button").getComponent(cc.Button).clickEvents.push(startBtn);
        cc.find("Signin_btn").getComponent(cc.Button).clickEvents.push(signinBtn);
        cc.find("Signup_btn").getComponent(cc.Button).clickEvents.push(signupBtn);
        cc.audioEngine.setMusicVolume(1);
    }

    playBGM() {
        if (this.bgm) {
            // 播放背景音乐
            cc.audioEngine.playMusic(this.bgm, true);
            // cc.audioEngine.setMusicVolume(0.2);
        }
    }

    loadGameScene() {
        cc.director.loadScene("stage");
        //cc.audioEngine.setMusicVolume(0.3);
    }
    loadGameScene2() {
        cc.director.loadScene("signin");
        //cc.audioEngine.setMusicVolume(0.3);
    }
    loadGameScene3() {
        cc.director.loadScene("signup");
        //cc.audioEngine.setMusicVolume(0.3);
    }
}
