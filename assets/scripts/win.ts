const { ccclass, property } = cc._decorator;
import Global from './Global';

@ccclass
export default class win extends cc.Component {
    @property(cc.Label)
    scoreLabel: cc.Label = null;

    start() {
        let startbtn = new cc.Component.EventHandler();
        startbtn.target = this.node;
        startbtn.component = "win";
        startbtn.handler = "loadGameScene";

        cc.find("Canvas/Back Button").getComponent(cc.Button).clickEvents.push(startbtn);
        this.scoreLabel.string = Global.score.toString();
        // 更新数据库中用户解锁关卡信息
        this.updateUnlockedLevels();
        // 存储分数、邮箱和日期时间到 leaderboard
        this.updateLeaderboardScore();
    }

    loadGameScene() {
        cc.director.loadScene("stage");
    }

    updateUnlockedLevels() {
        const uid = firebase.auth().currentUser.uid;

        const userRef = firebase.database().ref('users/' + uid);

        userRef.update({
            clearStage1: true
        }).then(() => {
            console.log('Boolean value updated successfully');
        }).catch((error) => {
            console.error('Error updating boolean value:', error);
        });
    }

    updateLeaderboardScore() {
        const uid = firebase.auth().currentUser.uid;
        const email = firebase.auth().currentUser.email;
        const score = Global.score;
        const dateTime = this.getCurrentDateTime(); // 获取当前日期时间

        const leaderboardRef = firebase.database().ref('leaderboard');

        leaderboardRef.once('value', (snapshot: any) => {
            let leaderboardData: [string, { uid: string, email: string, score: number, dateTime: string }][] = Object.entries(snapshot.val() || {});
            let numEntries = leaderboardData.length;

            if (numEntries >= 5) {
                // 根据分数从高到低排序，如果分数相同则根据时间从早到晚排序
                leaderboardData.sort((a, b) => {
                    if (a[1].score !== b[1].score) {
                        return b[1].score - a[1].score;
                    } else {
                        return new Date(a[1].dateTime).getTime() - new Date(b[1].dateTime).getTime();
                    }
                });

                let lastEntryKey = leaderboardData[leaderboardData.length - 1][0];
                let lastEntryScore = leaderboardData[leaderboardData.length - 1][1].score;

                if (score > lastEntryScore) {
                    leaderboardRef.child(lastEntryKey).remove();
                    numEntries--;
                } else {
                    return;
                }
            }

            leaderboardRef.push({
                uid: uid,
                email: email,
                score: score,
                dateTime: dateTime // 添加日期时间信息
            }).then(() => {
                console.log('Score updated successfully in leaderboard');
            }).catch((error: any) => {
                console.error('Error updating score in leaderboard:', error);
            });
        });
    }

    getCurrentDateTime(): string {
        const now = new Date();
        const year = now.getFullYear();
        const month = this.formatNumber(now.getMonth() + 1);
        const day = this.formatNumber(now.getDate());
        const hours = this.formatNumber(now.getHours());
        const minutes = this.formatNumber(now.getMinutes());
        return `${year}${month}${day} ${hours}:${minutes}`;
    }

    formatNumber(num: number): string {
        return num < 10 ? '0' + num : num.toString();
    }
}
