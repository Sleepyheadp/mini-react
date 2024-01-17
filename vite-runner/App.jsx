import React from "./core/react.js";
let count = 10;
function Counter() {
	// 这个时候已经绑定了事件,但是为什么没有打印log呢?
	// 这是因为我们没有在react.js中进行处理,它不能够识别clike这个事件
	function handleClick() {
		count++;
		console.log(count);
		React.update(); // 更新
	}
	return <button onClick={handleClick}>count:{count}</button>;
}
function App() {
	return (
		<div id="app">
			Hello mini-react
			<Counter></Counter>
			{/* <Counter num={20}></Counter> */}
		</div>
	);
}
export default App;
