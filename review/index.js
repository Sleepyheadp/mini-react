// v1.0.0
// 创建dom和文本节点赋值并插入到root节点中
// const dom = document.createElement("div");
// dom.id = "app";
// // append和appendChild的区别
// // getELementById和querySelector的区别
// document.getElementById("root").append(dom);
// // document.querySelector('#root').append(dom);

// const textEl = document.createTextNode("");
// textEl.nodeValue = `hello mini-react review  ${dom.id}`;
// dom.append(textEl);
// 模拟一个dom树的结构
/**
 * <div id="app">
			内容...
		</div>
		<div id="app2">
			<div id="container">
				<div id="title">标题2</div>
				<div id="content">内容2</div>
			</div>
		</div>
 */
// 引入虚拟dom
// div: type id
// text: type nodeValue
// const textEl = {
// 	type: "TEXT_ELEMENT",
// 	props: {
// 		nodeValue: "review",
// 		children: [],
// 	},
// };
// const el = {
// 	type: "div",
// 	props: {
// 		id: "app", // el的ID
// 		children: [textEl],
// 	},
// };

// const dom = document.createElement(el.type);
// dom.id = el.props.id;
// document.querySelector("#root").append(dom);

// // create textNode
// const textNode = document.createTextNode("");
// textNode.nodeValue = textEl.props.nodeValue;
// dom.append(textNode);

// 动态创建dom

function createTextNode(nodeValue) {
	return {
		type: "TEXT_ELEMENT",
		props: {
			nodeValue: nodeValue,
			children: [],
		},
	};
}
function createElement(type, props, ...children) {
	return {
		type: type,
		props: {
			id: props.id,
			children: children,
		},
	};
}

// 创建文本
const textEl = createTextNode("Hello mini-react review");
// 创建dom
const App = createElement("div", { id: "app" }, textEl);

const dom = document.createElement(App.type);
dom.id = App.props.id;
document.querySelector("#root").append(dom);
const textNode = document.createTextNode("");
textNode.nodeValue = textEl.props.nodeValue;
dom.append(textNode);
