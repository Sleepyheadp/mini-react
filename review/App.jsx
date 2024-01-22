import React from "./core/react.js";
// const App = React.createElement("div", { id: "app" }, "hello mini-react");
let count = 10;
let isShow = false;

function Counter({ num }) {
	// const foo = <div>foo</div>;
	function Foo() {
		return <div>foo</div>;
	}
	const bar = <div>bar</div>;
	function handleClick() {
		console.log("click");
		count++;
		React.update();
	}
	function toggle() {
		isShow = !isShow;
		React.update();
	}
	return (
		<div id="count">
			num_props:{num}; count:{count}
			<button onClick={handleClick}>clikeme</button>
			<div>
				<span>{isShow ? bar : <Foo />}</span>
				<button onClick={toggle}>toggle</button>
			</div>
		</div>
	);
}

function App() {
	return (
		<div id="app">
			Hello mini-react
			<Counter num={10}></Counter>
			{/* <Counter num={20}></Counter> */}
		</div>
	);
}
export default App;
