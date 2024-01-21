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
		type: "div", // 给根节点也加一个type属性,虽然后续用不到它,加不加都行
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

	// 我们需要在所有的任务完成后将节点append
	if (!nextWorkOfUnit && root) {
		commitRoot();
	}
	requestIdleCallback(workloop);
}
// 怎么让他只提交一次呢?
// 1. 在提交之前把root赋值为null
// 2. 加判断条件,当root为null时则不进行提交
function commitRoot() {
	commitWork(root.child);
	root = null;
}
// 没看懂,还能递归这样处理子节点,而且fiber不是根节点了吗,为什么还要append到parent?
function commitWork(fiber) {
	if (!fiber) return;
	// 函数组件里并没有dom结构,所以需要一直往上找,
	// 问题:为什么要counter函数组件的上一级是#app,要把dom添加到#app上吗?
	// 答: 我们在这里是按顺序生成链表,counter下的div节点需要添加到父级的dom上
	// 又因为函数组件内部并没有dom属性,所以继续往上找有dom属性的节点
	let fiberParent = fiber.parent;
	// 问题:这个地方是不是可以优化一下,那如果父级节点还是没有dom结构呢(嵌套),这样赋值不还是报错?
	while (!fiberParent.dom) {
		// counter函数组件parent是#app,它才有dom结构
		fiberParent = fiberParent.parent;
	}
	// 当前处理节点是否有dom属性,有的话就添加到父级dom上
	// 函数组件没有dom属性不需要进行添加dom
	if (fiber.dom) {
		fiberParent.dom.append(fiber.dom);
	}
	commitWork(fiber.child);
	commitWork(fiber.sibling);
}

function createDom(type) {
	/* ƒ Counter() {
  * return  React.createElement("div", { id: "count" }, "count");
	}*/
	// console.log("111", type);
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

function initChildren(fiber, children) {
	// 因为我们的函数组件是在type()函数中返回dom,跟我们之前dom的结构并不一样所以要分开处理
	// const children = fiber.props.children;
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
	const isFounctionComponent = typeof fiber.type === "function";
	if (!isFounctionComponent) {
		if (!fiber.dom) {
			const dom = (fiber.dom = createDom(fiber.type));
			// 疑问:为什么是parent
			// fiber.parent.dom.append(dom);
			updateProps(dom, fiber.props);
		}
	}
	// 转换为链表 就是去处理子节点和指向问题 fiber传参的初始值就是nextWorkOfUnit
	const children = isFounctionComponent ? [fiber.type()] : fiber.props.children;
	initChildren(fiber, children);
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
