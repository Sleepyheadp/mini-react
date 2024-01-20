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
		type,
		props: {
			...props,
			children: children.map((child) => {
				return typeof child === "string" ? createTextNode(child) : child;
			}),
		},
	};
}

// 我们整个过程分三步走: 1. 创建元素 2. 给属性赋值 3. append添加到父组件
let root = null;
function render(el, container) {
	// 这里的container就是根节点,el是我们创建的dom元素
	nextWorkOfUnit = {
		dom: container,
		props: {
			children: [el],
		},
	};
	root = nextWorkOfUnit;
}

// 任务调度器
let nextWorkOfUnit = null; // 每个节点 也就是任务
function workloop(idleDeadLine) {
	let shouldYield = false;
	while (!shouldYield && nextWorkOfUnit) {
		// 执行render
		nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
		shouldYield = idleDeadLine.timeRemaining() < 1;
	}

	// 我们需要在所有的任务完成后将节点append,且只执行一次
	if (!nextWorkOfUnit && root) {
		commitRoot();
	}
	requestIdleCallback(workloop);
}
function commitRoot() {
	commitWork(root.child);
	root = null;
}
function commitWork(fiber) {
	if (!fiber) return;
	fiber.parent.dom.append(fiber.dom);
	commitWork(fiber.child);
	commitWork(fiber.sibling);
}

function createDom(type) {
	return type === "TEXT_ELEMENT"
		? document.createTextNode("")
		: document.createElement(type);
}

function updateProps(dom, props) {
	Object.keys(props).forEach((key) => {
		if (key !== "children") {
			// 为什么这里是dom[key]不是很理解,dom下面不是只有type和props吗,dom[id] dom[nodeValue]能取到对应的属性吗?
			dom[key] = props[key];
		}
	});
}

function initChildren(fiber) {
	const children = fiber.props.children;
	let prevChild = null;
	children.forEach((child, index) => {
		const newFiber = {
			type: child.type,
			props: child.props,
			child: null,
			parent: fiber,
			sibling: null,
			dom: null,
		};
		if (index === 0) {
			// 说明是第一个子节点
			fiber.child = newFiber;
		} else {
			prevChild.sibling = newFiber;
		}
		prevChild = newFiber;
	});
}
function performWorkOfUnit(fiber) {
	if (!fiber.dom) {
		const dom = (fiber.dom = createDom(fiber.type));
		// 疑问:为什么是parent
		// fiber.parent.dom.append(dom);
		updateProps(dom, fiber.props);
	}
	// 转换为链表 就是去处理子节点和指向问题 fiber传参的初始值就是nextWorkOfUnit
	initChildren(fiber);
	// 这个时候第一层已经处理完了,这个时候要返回后续要处理的任务,也就是向下遍历
	if (fiber.child) {
		return fiber.child;
	}
	if (fiber.sibling) {
		return fiber.sibling;
	}
	return fiber.parent?.sibling; // 没有就返回父级的兄弟节点 如果有的话
}

requestIdleCallback(workloop);

const React = {
	render,
	createElement,
};
export default React;
