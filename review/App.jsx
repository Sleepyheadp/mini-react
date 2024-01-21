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
		<div id="count">
			num_props:{num}; count:{count}
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
