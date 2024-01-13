// 通过函数组件的形式进行创建
import React from "./core/react.js";
// const App = React.createElement("div", { id: "app" }, "hello ", "mini-react");
// 函数式组件-jsx写法
// function App() {
// 	return <div id="app">Hello mini-react jsx</div>;
// }
const App = <div id="app">Hello mini-react jsx</div>;
console.log(App); // () => {return /* @__PURE__ */ React.createElement("div", { id: "app" }, "Hello mini-react jsx");}
export default App;
