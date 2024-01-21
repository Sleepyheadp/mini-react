import React from "./core/react.js";
// const App = React.createElement("div", { id: "app" }, "hello mini-react");

function Counter({ num }) {
	function handleClick() {
		console.log("click");
	}
	return (
		<div id="count">
			count:{num}
			<button onClick={handleClick}>clikeme</button>
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
