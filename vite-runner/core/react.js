// v1:新建一个dom节点(#app)插入到body(#root)中,并且将其内容设置为hello mini-react
// const dom = document.createElement('div')
// dom.id = 'app'
// document.querySelector('#root').append(dom)
// // 创建一个文本节点赋值并插入
// const textNode = document.createTextNode('')
// textNode.nodeValue = 'hello mini-react v1'
// dom.append(textNode)

// v2: 动态创建vdom
// const textDom = {
// 	type: "text",
// 	props: {
// 		nodeValue: "hello mini-react v2",
// 		children: [],
// 	},
// };
// const vDom = {
// 	type: "div",
// 	props: {
// 		id: "app",
// 		children: [textDom],
// 	},
// };
// 通过函数组件的形式进行创建
function createTextNode(text) {
	return {
		type: "TEXT_ELEMENT",
		props: {
			nodeValue: text,
			children: [],
		},
	};
}
function createElement(type, props, ...children) {
	return {
		type: type,
		props: {
			...props,
			children: children.map((child) => {
				// children可能是一个字符串,也可能是一个dom节点,如果是字符串则需要创建一个文本节点
				return typeof child === "string" ? createTextNode(child) : child;
			}),
		},
	};
}

// const dom = document.createElement(App.type);
// dom.id = App.props.id;
// document.querySelector("#root").append(dom);
// // 创建一个文本节点赋值并插入
// const textNode = document.createTextNode("");
// textNode.nodeValue = textDom.props.nodeValue;
// dom.append(textNode);

// v3:动态创建dom节点
function render(el, container) {
	// 第一步:创建dom节点
	const dom =
		el.type === "TEXT_ELEMENT"
			? document.createTextNode("")
			: document.createElement(el.type);
	// 第二步:设置dom节点的属性值
	Object.keys(el.props).forEach((key) => {
		if (key !== "children") {
			dom[key] = el.props[key];
		}
	});
	// 第三步:将dom节点插入到container父节点中
	const children = el.props.children;
	// textEL append to divEl
	children.forEach((child) => {
		render(child, dom);
	});
	// #app El apped to #root El
	container.append(dom);
}
const React = {
	createElement,
	render,
};
export default React;
