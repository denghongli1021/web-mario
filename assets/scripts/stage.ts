const { ccclass, property } = cc._decorator;

@ccclass
export default class Stage extends cc.Component {

    @property(cc.Label)
    emailLabel: cc.Label = null;

    start() {
        let startbtn = new cc.Component.EventHandler();
        startbtn.target = this.node;
        startbtn.component = "stage";
        startbtn.handler = "loadGameScene";

        let startbtn2 = new cc.Component.EventHandler();
        startbtn2.target = this.node;
        startbtn2.component = "stage";
        startbtn2.handler = "loadGameScene2";
        cc.audioEngine.setMusicVolume(1);
        cc.find("Canvas/stage1btn").getComponent(cc.Button).clickEvents.push(startbtn);
        cc.find("Canvas/stage2btn").getComponent(cc.Button).clickEvents.push(startbtn2);

        // 显示用户的电子邮件地址
        this.displayUserEmail();
        const level2Btn = cc.find('Canvas/stage2btn');
        level2Btn.active = false;
        // 获取当前用户的已解锁关卡信息
        this.checkUnlockedLevels();
    }

    displayUserEmail() {
        const user = firebase.auth().currentUser;
        if (user) {
            this.showUserEmail(user.email);
        } else {
            this.showUserEmail('User is not logged in');
        }
    }

    showUserEmail(email: string) {
        if (this.emailLabel) {
            this.emailLabel.string = email;
        }
    }

    async checkUnlockedLevels() {
        const uid = firebase.auth().currentUser.uid;

        // 获取对应用户的数据库引用
        const userRef = firebase.database().ref('users/' + uid);

        // 读取布尔值
        userRef.child('clearStage1').once('value')
        .then((snapshot) => {
            const clearStage1 = snapshot.val(); // 获取布尔值
            console.log('clearStage1 value:', clearStage1);

            // 在这里处理布尔值 clearStage1，根据需要执行其他操作
            if (clearStage1 === true) {
                this.displayLevel2Buttons();
            } else {
            // 布尔值为 false 或未定义的处理逻辑
            }
        })
        .catch((error) => {
            console.error('Error fetching clearStage1 value:', error);
        });
    }

    displayLevel2Buttons() {
        const level2Btn = cc.find('Canvas/stage2btn');
        if (level2Btn) {
            level2Btn.active = true;
        }
    }

    loadGameScene() {
        cc.director.loadScene("start_scene_1");
        cc.audioEngine.setMusicVolume(1);
        cc.audioEngine.setEffectsVolume(2);
    }

    loadGameScene2() {
        cc.director.loadScene("start_scene_2");
        cc.audioEngine.setMusicVolume(1);
        cc.audioEngine.setEffectsVolume(2);
    }
}
