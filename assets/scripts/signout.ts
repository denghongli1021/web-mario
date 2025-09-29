const {ccclass, property} = cc._decorator;

@ccclass
export default class LoginScript extends cc.Component {
    @property(cc.Button)
    signoutButton: cc.Button = null; // 添加一个注销按钮

    start() {
        this.signoutButton.node.on(cc.Node.EventType.TOUCH_END, this.onSignoutButtonClick, this); // 绑定注销按钮事件
    }

    onSignoutButtonClick() {
        firebase.auth().signOut()
            .then(() => {
                // 注销成功
                console.log('User signed out');
                cc.director.loadScene("menu");
                // 执行其他注销后逻辑，比如重定向到登录页面
            })
            .catch((error) => {
                // 注销失败
                console.error('Sign out error:', error);
                // 显示注销失败的提示给用户
            });
    }
}