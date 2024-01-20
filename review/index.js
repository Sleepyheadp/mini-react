import ReactDOM from "./core/reactDom.js";
import React from "./core/react.js";
const App = React.createElement(
	"div",
	{ id: "app" },
	"Hello mini-react review"
);

ReactDOM().createRoot(document.querySelector("#root")).render(App);
