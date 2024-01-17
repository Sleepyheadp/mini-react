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
			children: children.map((child) => {
				return typeof child === "string" ? createTextNode(child) : child;
			}),
		},
	};
}

// 我们整个过程分三步走: 1. 创建元素 2. 给属性赋值 3. append添加到父组件
function render(el, container) {
	// 1. create dom
	const dom =
		el.type === "TEXT_ELEMENT"
			? document.createTextNode("")
			: document.createElement(el.type);
	// 2. 给DOM赋值

	Object.keys(el.props).forEach((key) => {
		if (key !== "children") {
			// 为什么这里是dom[key]不是很理解,dom下面不是只有type和props吗,dom[id] dom[nodeValue]能取到对应的属性吗?
			dom[key] = el.props[key];
		}
	});
	// 2-2 处理children的情况(children的结构跟el的结构其实是一样的所以我们通过递归的方式处理就可以了)
	el.props.children.forEach((child) => {
		render(child, dom);
	});
	// 3. 将dom添加到父级元素
	container.append(dom);
}
const react = {
	render,
	createElement,
};
export default react;
