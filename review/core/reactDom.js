import react from "./react.js";
const reactDom = {
	createRoot(container) {
		return {
			render(App) {
				react.render(App, container);
			},
		};
	},
};
export default reactDom;
