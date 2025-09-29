const {ccclass, property} = cc._decorator;

@ccclass
export default class LoginScript extends cc.Component {
    @property(cc.EditBox)
    emailEditBox: cc.EditBox = null;

    @property(cc.EditBox)
    passwordEditBox: cc.EditBox = null;

    @property(cc.Button)
    signinButton: cc.Button = null;

    start() {
        // 绑定按钮点击事件
        this.signinButton.node.on(cc.Node.EventType.TOUCH_END, this.onLoginButtonClick, this);
    }

    onLoginButtonClick() {
        const email = this.emailEditBox.string;
        const password = this.passwordEditBox.string;

        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // 登录成功
                const user = userCredential.user;
                console.log('User signed in:', user);
                cc.director.loadScene("stage");
                // 登录成功后执行其他逻辑，比如场景跳转等
            })
            .catch((error) => {
                // 登录失败
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Sign in error:', errorCode, errorMessage);
                // 显示登录失败的提示给用户
            });
    }

}