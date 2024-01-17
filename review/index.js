import reactDom from "./core/reactDom.js";
import react from "./core/react.js";
const App = react.createElement(
	"div",
	{ id: "app" },
	"Hello mini-react review"
);

// react 官方的形式: ReactDom.createRoot(document.getElementById(root)).render(<App/>)
// render(App, document.querySelector("#root"));
const rootDom = document.querySelector("#root");
reactDom.createRoot(rootDom).render(App);
