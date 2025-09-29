const {ccclass, property} = cc._decorator;

@ccclass
export default class Signin extends cc.Component {
    @property(cc.EditBox)
    emailEditBox: cc.EditBox = null;

    @property(cc.EditBox)
    passwordEditBox: cc.EditBox = null;

    @property(cc.Button)
    signupButton: cc.Button = null;

    start() {
        // 绑定按钮点击事件
        this.signupButton.node.on(cc.Node.EventType.TOUCH_END, this.onSignupButtonClick, this);
    }

    onSignupButtonClick() {
        const email = this.emailEditBox.string;
        const password = this.passwordEditBox.string;

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // 注册成功
                const user = userCredential.user;
                console.log('User signed up:', user);
                cc.director.loadScene("stage");
                // 注册成功后执行其他逻辑，比如场景跳转等
            })
            .catch((error) => {
                // 注册失败
                const errorCode = error.code;
                const errorMessage = error.message;
                console.error('Sign up error:', errorCode, errorMessage);
                // 显示注册失败的提示给用户
            });
    }
}