// 创建文本节点
function createTextNode(text) {
	return {
		type: "TEXT_ELEMENT",
		props: {
			nodeValue: text,
			children: [],
		},
	};
}
// 创建dom节点
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

// v3:动态创建dom节点
function render(el, container) {
	// 渲染的时候我们需要将vdom转换为dom节点
	nextWorkOfUnit = {
		dom: container,
		props: {
			children: [el],
		},
	};
	rootDom = nextWorkOfUnit; // 根节点赋值
}

// 首先我们定义一个当前要执行的任务
let rootDom = null; // dom树的根节点
let nextWorkOfUnit = null;
const workLoop = (idleDeadline) => {
	let hasTimeEmpty = false; // 默认没有空闲时间
	while (!hasTimeEmpty && nextWorkOfUnit) {
		// 当有空闲时间并且有任务执行时,执行任务
		// 指向当前的任务指向下一个任务
		nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
		hasTimeEmpty = idleDeadline.timeRemaining() < 1;
	}
	if (!nextWorkOfUnit && rootDom) {
		// 说明dom树已经渲染完成,这个时候我们就可以将fiber树转换为dom树,可以append到根节点了
		commitRoot();
	}
	requestIdleCallback(workLoop);
};

function commitRoot() {
	commitWork(rootDom.child);
	rootDom = null;
}
function commitWork(fiber) {
	if (!fiber) return; // 如果后续没有任务了,则直接返回
	fiber.parent.dom.append(fiber.dom);
	commitWork(fiber.child);
	commitWork(fiber.sibling);
}
// 抽离createDom
function createDom(type) {
	return type === "TEXT_ELEMENT"
		? document.createTextNode("")
		: document.createElement(type);
}
// 抽离处理props函数
function updateProps(dom, props) {
	Object.keys(props).forEach((key) => {
		if (key !== "children") {
			dom[key] = props[key];
		}
	});
}
// 转换链表
function initChildren(fiber) {
	const children = fiber.props.children;
	let prevChild = null;
	children.forEach((child, index) => {
		// 创建一个新的fiber节点,给其设置相关的属性
		const newFiber = {
			type: child.type,
			props: child.props,
			child: null,
			parent: fiber,
			sibling: null,
			dom: null,
		};
		if (index === 0) {
			fiber.child = newFiber;
		} else {
			prevChild.sibling = newFiber;
		}
		prevChild = newFiber;
	});
}
const performWorkOfUnit = (fiber) => {
	// 在这个函数中我们要做的事情就是执行当前任务,也就是render函数所做的事情
	// 1. 创建dom节点
	if (!fiber.dom) {
		const dom = (fiber.dom = createDom(fiber.type));
		// fiber.parent.dom.append(dom); // 将创建的dom节点添加到父节点中,但是没渲染完所有dom节点就中途添加了
		// 2. 处理props
		updateProps(dom, fiber.props);
	}
	// 3. 转换链表 设置引用/指针(指向下一个任务)
	initChildren(fiber);
	// 4. 返回下一个要执行的任务(指针指向的下一个任务)
	// 4.1 如果当前任务有子节点,则返回子节点
	if (fiber.child) {
		return fiber.child;
	}
	// 4.2 如果当前任务没有子节点,则返回兄弟节点
	if (fiber.sibling) {
		return fiber.sibling;
	}
	// 4.3 如果当前任务没有兄弟节点,则返回父节点的兄弟节点
	return fiber.parent?.sibling;
};
requestIdleCallback(workLoop);

const React = {
	createElement,
	render,
};
export default React;
