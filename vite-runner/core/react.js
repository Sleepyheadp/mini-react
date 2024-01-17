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
	// 问题:这里就有一个问题,我们的函数组件并没有dom属性,因此页面会出现null字符
	// 解决办法:我们需要对是否存在dom属性进行判断
	let fiberParent = fiber.parent;
	// 这里还有一个小问题?只查找一层父级是不够的,可能有多个dom进行嵌套.
	// 需要层层向上查找,直到找到一个有dom属性的fiber节点
	while (!fiberParent.dom) {
		fiberParent = fiberParent.parent;
	}
	// 问题:函数组件没有dom属性,因此我们需要对其进行判断
	if (fiber.dom) {
		fiberParent.dom.append(fiber.dom);
	}
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
			if(key.startsWith('on')){
				const eventType = key.slice(2).toLowerCase();
				dom.addEventListener(eventType, props[key]); // 这里的props[key]就是我们onclike的回调函数clickMe
			}else{
				dom[key] = props[key];
			}
		}
	});
}
// 转换链表
function initChildren(fiber, children) {
	// const eventType = fiber.props
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
// 抽离创建dom节点函数
function updateFunctionComponent(fiber) {
	const children = [fiber.type(fiber.props)];
	initChildren(fiber, children);
}
// 抽离处理props函数
function updateHostComponent(fiber) {
	// 1. 创建dom节点
	if (!fiber.dom) {
		const dom = (fiber.dom = createDom(fiber.type));
		// fiber.parent.dom.append(dom); // 将创建的dom节点添加到父节点中,但是没渲染完所有dom节点就中途添加了
		// 2. 处理props
		updateProps(dom, fiber.props);
	}
	const children = fiber.props.children;
	initChildren(fiber, children);
}
const performWorkOfUnit = (fiber) => {
	// 检查一下fiber.type是否是一个函数组件
	const isFunctionComponent = typeof fiber.type === "function";
	if (isFunctionComponent) {
		updateFunctionComponent(fiber);
	} else {
		updateHostComponent(fiber);
	}
	// 因为我们的函数组件本身就自带dom,所以并不需要在对函数组件进行createDom的操作
	// if (!isFunctionComponent) {
	// 	// 在这个函数中我们要做的事情就是执行当前任务,也就是render函数所做的事情
	// 	// 1. 创建dom节点
	// 	if (!fiber.dom) {
	// 		const dom = (fiber.dom = createDom(fiber.type));
	// 		// fiber.parent.dom.append(dom); // 将创建的dom节点添加到父节点中,但是没渲染完所有dom节点就中途添加了
	// 		// 2. 处理props
	// 		updateProps(dom, fiber.props);
	// 	}
	// }

	// 3. 转换链表 设置引用/指针(指向下一个任务)
	// 在init子节点的时候把判断完的children传递过去,又因为我们的children默认是[],所以需要设置为数组类型的数据
	// const children = isFunctionComponent
	// 	? [fiber.type(fiber.props)]
	// 	: fiber.props.children;
	// initChildren(fiber, children);
	// 4. 返回下一个要执行的任务(指针指向的下一个任务)
	// 4.1 如果当前任务有子节点,则返回子节点
	if (fiber.child) {
		return fiber.child;
	}
	// 4.2 如果当前任务没有子节点,则返回兄弟节点
	// if (fiber.sibling) {
	// 	return fiber.sibling;
	// }

	let nextFiber = fiber;
	while (nextFiber) {
		if (nextFiber.sibling) return nextFiber.sibling;
		nextFiber = nextFiber.parent;
	}

	// 4.3 如果当前任务没有兄弟节点,则返回父节点的兄弟节点
	// return fiber.parent?.sibling;
};
requestIdleCallback(workLoop);

const React = {
	createElement,
	render,
};
export default React;
