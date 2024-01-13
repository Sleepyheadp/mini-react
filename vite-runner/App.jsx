/**@jsx YReact.createElement */
// 通过函数组件的形式进行创建
import YReact from "./core/react.js";
// const App = React.createElement("div", { id: "app" }, "hello ", "mini-react");
const App = <div id="app">Hello mini-react jsx</div>;

// 函数式组件-jsx写法
// function AppOne() {
// 	return <div id="app">Hello mini-react jsx</div>;
// }
// console.log(AppOne); // () => {return /* @__PURE__ */ React.createElement("div", { id: "app" }, "Hello mini-react jsx");}

export default App;
