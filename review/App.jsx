import React from "./core/react.js";
// const App = React.createElement("div", { id: "app" }, "hello mini-react");
let count = 10;

function Counter({ num }) {
	function handleClick() {
		console.log("click");
		count++;
		React.update();
	}

	return (
		<div>
			<div id="count">
				num_props:{num}; count:{count}
				<button onClick={handleClick}>clikeme</button>
			</div>
		</div>
	);
}

// 为什么isShow不能放ToggleBar函数组件里面?
let isShow = false;
function ToggleBar() {
	// [注意]这里的foo是函数组件形式时,在toggle触发的时候,
	// 并没有老节点的child没有被删除的情况
	const foo = (
		<div>
			foo
			<div>foo's child1</div>
			<div>foo's child2</div>
		</div>
	);
	const bar = <div>bar</div>;
	function toggle() {
		isShow = !isShow;
		React.update();
	}
	return (
		<div>
			{isShow ? foo : bar}
			<button onClick={toggle}>toggle</button>
		</div>
	);
}

function App() {
	return (
		<div id="app">
			Hello mini-react
			<Counter num={10}></Counter>
			{/* <Counter num={20}></Counter> */}
			<ToggleBar></ToggleBar>
		</div>
	);
}
export default App;
