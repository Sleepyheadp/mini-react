import React from "./core/react.js";
// const App = React.createElement("div", { id: "app" }, "hello mini-react");
let count = 10;
let count_one = 1;
let count_two = 2;
function Counter({ num }) {
	const update = React.update();
	function handleClick() {
		console.log("click");
		count++;
		update();
		// React.update();
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
// 优化渲染dom
function CounterOne() {
	const update = React.update();
	console.log("one run");
	function handleClick() {
		count_one++;
		update();
	}

	return (
		<div>
			<h3>count_one</h3>
			{count_one}
			<button onClick={handleClick}>addCount</button>
		</div>
	);
}

// count_two
function CounterTwo() {
	const update = React.update();
	console.log("two run");
	function handleClick() {
		count_two++;
		update();
	}

	return (
		<div>
			<h3>count_two</h3>
			{count_two}
			<button onClick={handleClick}>addCount</button>
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
	const update = React.update();
	function toggle() {
		isShow = !isShow;
		update();
		// React.update();
	}
	return (
		<div>
			{/* {isShow ? foo : bar}  */}
			{/* isShow是false类型的,所以报错了 */}
			{(isShow && bar) || (!isShow && foo)}
			<button onClick={toggle}>toggle</button>
		</div>
	);
}

function App() {
	console.log("app run");
	return (
		<div id="app">
			Hello mini-react
			<Counter num={10}></Counter>
			{/* <Counter num={20}></Counter> */}
			<hr />
			<ToggleBar></ToggleBar>
			<hr />
			<CounterOne></CounterOne>
			<CounterTwo></CounterTwo>
		</div>
	);
}
export default App;
