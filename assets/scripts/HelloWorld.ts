// // Learn TypeScript:
// //  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// // Learn Attribute:
// //  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// // Learn life-cycle callbacks:
// //  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

// const {ccclass, property} = cc._decorator;

// @ccclass
// export default class HelloWorld extends cc.Component {

//     @property(cc.Label)
//     label: cc.Label = null;

//     @property
//     text: string = 'hello';

//     @property
//     version: number = 2;

//     sayhello() {
//         cc.log(this.version + " say hello");
//     }

//     // LIFE-CYCLE CALLBACKS:
    
//     onLoad () {
//         this.sayhello();
//     }

//     start () {
//         this.sayhello();
//     }

//     update (dt) {
//         // this.sayhello();
//     }
// }
