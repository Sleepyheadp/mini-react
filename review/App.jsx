import React from "./core/react.js";
// const App = React.createElement("div", { id: "app" }, "hello mini-react");
let isShow = false;
let count = 10;
let count_one = 1;
let count_two = 2;

function Counter() {
	const [count, setCount] = React.useState(10);
	const [name, setName] = React.useState("Tom");
	function handleClick() {
		// setCount((count) => count + 1);
		setCount(count + 1);
	}
	function changeName() {
		setName("Jerry");
		if (name === "Jerry") {
			alert("changed");
		}
		// setName((name) => "Jerry");
	}
	// useEffect(()=>{},[]) 初始化时会调用一次
	// useEffect(()=>{},[value]) 当value发生变化时执行
	// useEffect(() => {
	// 	console.log("init run");
	// }, []);
	return (
		<div>
			<div>
				<h2>Counter</h2>
				count:{count}
				<button onClick={handleClick}>addCount</button>
				name:{name}
				<button onClick={changeName}>changeName</button>
			</div>
		</div>
	);
}
function CounterOne() {
	const update = React.update();
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
function CounterTwo() {
	const update = React.update();
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
	return (
		<div id="app">
			Hello mini-react
			<hr />
			<ToggleBar></ToggleBar>
			<hr />
			<CounterOne></CounterOne>
			<CounterTwo></CounterTwo>
			<hr />
			<Counter></Counter>
			{/* <Counter></Counter> */}
		</div>
	);
}
export default App;
