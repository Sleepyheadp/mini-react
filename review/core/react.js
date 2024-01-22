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
				console.log("child", child);
				const isTextNode =
					typeof child === "string" || typeof child === "number";
				return isTextNode ? createTextNode(child) : child;
			}),
		},
	};
}

// 我们整个过程分三步走: 1. 创建元素 2. 给属性赋值 3. append添加到父组件

function render(el, container) {
	// 这里的container就是根节点,el是我们创建的dom元素
	wipRoot = {
		dom: container,
		type: "div", // 给根节点也加一个type属性,虽然后续用不到它,加不加都行
		props: {
			children: [el],
		},
	};
	nextWorkOfUnit = wipRoot;
}

// 任务调度器 work in progress
let wipRoot = null;
let currentRoot = null;
let nextWorkOfUnit = null; // 每个节点 也就是任务
let deletions = [];
function workLoop(idleDeadLine) {
	let shouldYield = false;
	while (!shouldYield && nextWorkOfUnit) {
		// 执行render
		nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
		shouldYield = idleDeadLine.timeRemaining() < 1;
	}

	// 我们需要在所有的任务完成后将节点append
	if (!nextWorkOfUnit && wipRoot) {
		commitRoot();
	}
	requestIdleCallback(workLoop);
}
// 怎么让他只提交一次呢?
// 1. 在提交之前把root赋值为null
// 2. 加判断条件,当root为null时则不进行提交
function commitRoot() {
	// forEach参数里还能是函数形式 ()=>{} 本来就是一个箭头函数
	deletions.forEach(commitDeletion);
	commitWork(wipRoot.child);
	// 我们在形成新的链表结构后会把当前的链表结构赋值给新的root节点
	currentRoot = wipRoot;
	wipRoot = null;
	deletions = [];
}
function commitDeletion(fiber) {
	if (fiber.dom) {
		let fiberParent = fiber.parent;
		while (!fiberParent.dom) {
			fiberParent = fiberParent.parent;
		}
		// 把当前要删除的节点传递给它
		// removeChild和removeAttribute的区别
		fiberParent.dom.removeChild(fiber.dom);
	} else {
		commitDeletion(fiber.child);
	}
}
// 没看懂,还能递归这样处理子节点,而且fiber不是根节点了吗,为什么还要append到parent?
function commitWork(fiber) {
	// 这里的fiber是所有的子节点
	if (!fiber) return;
	// 如果是函数组件的话父节点不一定有dom属性,要继续往上找
	let fiberParent = fiber.parent;
	while (!fiberParent.dom) {
		fiberParent = fiberParent.parent;
	}
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
	// 重构updateProps 分情况处理
	// 1. old 有 new 没有 -> 删除
	// 遍历老的节点,当老的节点有但是新的没有就进行删除
	Object.keys(prevProps).forEach((key) => {
		if (key !== "children") {
			if (!(key in nextProps)) {
				dom.removeAttribute(key);
			}
		}
	});
	// 2. new 有 old 没有 -> 更新
	// 3. new 有 old 有  -> 更新
	// 老的节点和新的节点不一样
	Object.keys(nextProps).forEach((key) => {
		if (key !== "children") {
			if (nextProps[key] !== prevProps[key]) {
				if (key.startsWith("on")) {
					const eventType = key.slice(2).toLowerCase();
					dom.removeEventListener(eventType, prevProps[key]);
					dom.addEventListener(eventType, nextProps[key]);
				} else {
					dom[key] = nextProps[key];
				}
			}
		}
	});
}

// 处理根节点下的子节点 reconcile /ˈrekənsaɪl/ 使和好;使一致
function reconcileChildren(fiber, children) {
	// 因为我们的函数组件是在type()函数中返回dom,跟我们之前dom的结构并不一样所以要分开处理
	// const children = fiber.props.children;
	// 不懂啊,能直接给fiber加alternate属性吗?这里的fiber是新的还是旧的?
	let oldFiber = fiber.alternate?.child;
	let prevChild = null;
	children.forEach((child, index) => {
		// 分情况进行判断,如果对比的type相同则进行更新,不同则替换
		const isSameType = oldFiber && oldFiber.type === child.type;
		let newFiber;
		if (isSameType) {
			newFiber = {
				type: child.type,
				props: child.props,
				child: null,
				parent: fiber,
				sibling: null,
				dom: oldFiber.dom, // 更新用老的dom
				effectTag: "update",
				alternate: oldFiber,
			};
		} else {
			// isShow的值为false
			if (child) {
				newFiber = {
					type: child.type,
					props: child.props,
					child: null,
					parent: fiber,
					sibling: null,
					dom: null,
					effectTag: "placement",
				};
			}
			if (oldFiber) {
				deletions.push(oldFiber);
			}
		}
		// 不理解, 意思是当index=1时也就是处理兄弟节点时更新oldFiber
		if (oldFiber) {
			oldFiber = oldFiber.sibling;
		}
		if (index === 0) {
			// 说明是第一个子节点
			fiber.child = newFiber;
		} else {
			prevChild.sibling = newFiber;
		}
		if (newFiber) {
			prevChild = newFiber;
		}
	});
	// 在处理完子节点的时候打印一下oldFiber看一下
	// console.log(oldFiber);
	while (oldFiber) {
		deletions.push(oldFiber);
		// 对比完第一个子节点后,如果此节点后有sibling兄弟节点,则让他指向兄弟节点
		// 也就是继续处理后续的节点
		oldFiber = oldFiber.sibling;
	}
}
// 抽离处理函数组件和普通dom节点的逻辑
function updateFunctionComponent(fiber) {
	// 这里不需要处理dom,函数组件并没有dom属性,只需要处理children
	const children = [fiber.type(fiber.props)];
	reconcileChildren(fiber, children);
}
function updateHostComponent(fiber) {
	// 处理dom
	if (!fiber.dom) {
		// 1. create dom
		const dom = (fiber.dom = createDom(fiber.type));
		// 2. 处理props
		updateProps(dom, fiber.props, {}); // dom prevProps nextProps
	}
	// 处理children
	const children = fiber.props.children;
	reconcileChildren(fiber, children);
}
function performWorkOfUnit(fiber) {
	// console.log(fiber);
	const isFunctionComponent = typeof fiber.type === "function";
	if (isFunctionComponent) {
		updateFunctionComponent(fiber);
	} else {
		updateHostComponent(fiber);
	}

	// 这个时候第一层已经处理完了,这个时候要返回后续要处理的任务,也就是向下遍历
	if (fiber.child) {
		return fiber.child;
	}
	// 当渲染多个counter组件的时候,我们直接返回了上一级的sibling,但是如果上一级也没有sibling的话,就会报错
	// 解决方案: 循环往上找,直到找到有sibling的父节点
	// 这里的fiber参数就是counter函数组件
	let nextFiber = fiber;
	while (nextFiber) {
		if (nextFiber.sibling) return nextFiber.sibling; // 没有就返回父级的兄弟节点 如果有的话
		nextFiber = nextFiber.parent;
	}
}

// update : create new root
// 这个新的root节点是老节点在形成链式结构时赋值的,因此我们不需要给他传值
requestIdleCallback(workLoop);

function update() {
	wipRoot = {
		dom: currentRoot.dom,
		props: currentRoot.props,
		alternate: currentRoot,
	};
	nextWorkOfUnit = wipRoot;
}

const React = {
	update,
	render,
	createElement,
};
export default React;
