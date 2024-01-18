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
				const isTextNode =
					typeof child === "string" || typeof child === "number";
				return isTextNode ? createTextNode(child) : child;
			}),
		},
	};
}

// v3:动态创建dom节点
function render(el, container) {
	// 渲染的时候我们需要将vdom转换为dom节点
	wipRoot = {
		dom: container,
		props: {
			children: [el],
		},
	};
	nextWorkOfUnit = wipRoot;
}

// 首先我们定义一个当前要执行的任务
// work in progress
let wipRoot = null; // dom树的根节点
let currentRoot = null;
let nextWorkOfUnit = null;
let deletions = []; // 所有的删除节点
const workLoop = (idleDeadline) => {
	let hasTimeEmpty = false; // 默认没有空闲时间
	while (!hasTimeEmpty && nextWorkOfUnit) {
		// 当有空闲时间并且有任务执行时,执行任务
		// 指向当前的任务指向下一个任务
		nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
		hasTimeEmpty = idleDeadline.timeRemaining() < 1;
	}
	if (!nextWorkOfUnit && wipRoot) {
		// 说明dom树已经渲染完成,这个时候我们就可以将fiber树转换为dom树,可以append到根节点了
		commitRoot();
	}
	requestIdleCallback(workLoop);
};

function commitRoot() {
	// 我们在这里进行删除的统一处理
	deletions.forEach(commitDeletion);
	commitWork(wipRoot.child);
	currentRoot = wipRoot;
	wipRoot = null;
	deletions = [];
}
function commitDeletion(fiber) {
	fiber.parent.dom.removeChild(fiber.dom);
}
function commitWork(fiber) {
	if (!fiber) return; // 如果后续没有任务了,则直接返回
	let fiberParent = fiber.parent;
	while (!fiberParent.dom) {
		fiberParent = fiberParent.parent;
	}

	// 判断tag类型
	if (fiber.effectTag === "update") {
		updateProps(fiber.dom, fiber.props, fiber.alternate?.props);
	} else if (fiber.effectTag === "placement") {
		if (fiber.dom) {
			fiberParent.dom.append(fiber.dom);
		}
	}

	commitWork(fiber.child);
	commitWork(fiber.sibling);
}

function createDom(type) {
	return type === "TEXT_ELEMENT"
		? document.createTextNode("")
		: document.createElement(type);
}

function updateProps(dom, nextProps, prevProps) {
	// 分情况进行操作
	// 1. old有 new没有 删除
	Object.keys(prevProps).forEach((key) => {
		if (key !== "children") {
			if (!(key in nextProps)) {
				dom.removeAttribute(key);
			}
		}
	});
	// 2. new有 old没有 增加
	// 3. new有 old有   修改
	Object.keys(nextProps).forEach((key) => {
		if (key !== "children") {
			if (nextProps[key] !== prevProps[key]) {
				if (key.startsWith("on")) {
					const eventType = key.slice(2).toLowerCase();
					dom.removeEventListener(eventType, prevProps[key]);
					dom.addEventListener(eventType, nextProps[key]); // 这里的props[key]就是我们onclike的回调函数clickMe
				} else {
					dom[key] = nextProps[key];
				}
			}
		}
	});
}
function reconcileChildren(fiber, children) {
	let oldFiber = fiber.alternate?.child;
	let prevChild = null;
	children.forEach((child, index) => {
		const isSameType = oldFiber && oldFiber.type === child.type;
		let newFiber;
		// 判断是否是相同类型
		if (isSameType) {
			// update
			newFiber = {
				type: child.type,
				props: child.props,
				child: null,
				parent: fiber,
				sibling: null,
				dom: oldFiber.dom,
				effectTag: "update", // 更新
				alternate: oldFiber,
			};
		} else {
			newFiber = {
				type: child.type,
				props: child.props,
				child: null,
				parent: fiber,
				sibling: null,
				dom: null,
				effectTag: "placement", // 替换
			};
			// 进行删除操作
			if (oldFiber) {
				deletions.push(oldFiber);
			}
		}
		// 把旧的dom树更新为兄弟节点
		if (oldFiber) {
			oldFiber = oldFiber.sibling;
		}
		if (index === 0) {
			fiber.child = newFiber;
		} else {
			prevChild.sibling = newFiber;
		}
		prevChild = newFiber;
	});
}

function updateFunctionComponent(fiber) {
	const children = [fiber.type(fiber.props)];
	reconcileChildren(fiber, children);
}

function updateHostComponent(fiber) {
	if (!fiber.dom) {
		const dom = (fiber.dom = createDom(fiber.type));
		updateProps(dom, fiber.props, {});
	}
	const children = fiber.props.children;
	reconcileChildren(fiber, children);
}

const performWorkOfUnit = (fiber) => {
	const isFunctionComponent = typeof fiber.type === "function";
	if (isFunctionComponent) {
		updateFunctionComponent(fiber);
	} else {
		updateHostComponent(fiber);
	}
	if (fiber.child) {
		return fiber.child;
	}

	let nextFiber = fiber;
	while (nextFiber) {
		if (nextFiber.sibling) return nextFiber.sibling;
		nextFiber = nextFiber.parent;
	}
};
requestIdleCallback(workLoop);

function update() {
	wipRoot = {
		dom: currentRoot.dom,
		props: currentRoot.props,
		alternate: currentRoot, // 把新dom树指向老的dom树
	};
	nextWorkOfUnit = wipRoot;
}

const React = {
	createElement,
	render,
	update,
};
export default React;
