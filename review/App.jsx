import React from "./core/react.js";
// const App = React.createElement("div", { id: "app" }, "hello mini-react");
function Counter() {
	return <div id="count">count</div>;
}
function App() {
	return (
		<div id="app">
			Hello mini-react
			<Counter></Counter>
		</div>
	);
}
export default App;
