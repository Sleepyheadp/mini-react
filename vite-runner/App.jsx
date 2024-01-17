import React from "./core/react.js";
function Counter({ num }) {
	// 这个时候已经绑定了事件,但是为什么没有打印log呢?
	// 这是因为我们没有在react.js中进行处理,它不能够识别clike这个事件
	function handleClick(){
		console.log("clikeMe")
	}
	return <button onClick={handleClick}>count:{num}</button>;
}
function App() {
	return (
		<div id="app">
			Hello mini-react
			{/* 问题:为什么要调用两次?一次性传递两个不行吗? */}
			<Counter num={10}></Counter>
			{/* <Counter num={20}></Counter> */}
		</div>
	);
}
export default App;
