import React from "./core/react.js";
function Counter({ num }) {
	return <div>count:{num}</div>;
}
function App() {
	return (
		<div id="app">
			Hello mini-react
			{/* 问题:为什么要调用两次?一次性传递两个不行吗? */}
			<Counter num={10}></Counter>
			<Counter num={20}></Counter>
		</div>
	);
}
export default App;
