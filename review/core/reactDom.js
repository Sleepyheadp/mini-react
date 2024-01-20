import react from "./react.js";
// reactDom是一个对象,可以通过obj.sth的方式进行获取属性,
// 函数的话必须要有返回值,这里的createRoot返回了一个函数,
// 因为我们也可以通过createRoot.render()的方式
const ReactDOM = {
	createRoot(container) {
		return {
			render(App) {
				react.render(App, container);
			},
		};
	},
};

export default ReactDOM;
