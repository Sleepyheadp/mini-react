import React from "./core/react.js";
let count = 10;
let id = 0;
let isShow = false;
function Counter() {
	const foo = <div>foo</div>;
	const bar = <div>bar</div>;
	// 这个时候已经绑定了事件,但是为什么没有打印log呢?
	// 这是因为我们没有在react.js中进行处理,它不能够识别clike这个事件
	function handleClick() {
		count++;
		id = Math.random().toFixed(2);
		React.update(); // 更新
	}
	function handleShow() {
		console.log("handleShow");
		isShow = !isShow;
		React.update();
	}
	return (
		<div>
			<button id={id} onClick={handleClick}>
				count:{count}
			</button>
			<div>{isShow ? bar : foo}</div>
			<button onClick={handleShow}>Toggle</button>
		</div>
	);
}
function App() {
	return (
		<div id="app">
			Hello mini-react
			<br />
			<Counter></Counter>
			{/* <Counter num={20}></Counter> */}
		</div>
	);
}
export default App;
