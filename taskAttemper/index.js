const el = document.createElement("div");
el.innerHTML = "task attemper";
document.body.append(el);

let i = 0;
while (i < 1000) {
	i++;
}
// 作用:通过requestIdleCallback来进行任务调度
// 如果当前帧有空闲时间则执行,如果没有空闲时间则等待下一帧,因此就避免了浏览器卡顿的情况
const workloop = (idleDeadline) => {
	// 1. 当有空闲时间的时候执行添加dom的操作
	// 1.1 首先进行判断是否有空闲时间
	const hasTimeEmpty = false; // 默认没有空闲时间
	while (!hasTimeEmpty) {
		// 当有空闲时间时执行dom操作

		hasTimeEmpty = idleDeadline.timeRemaining() < 1;
	}
	console.log("requestIdleCallback", idleDeadline.timeRemaining());
	// requestIdleCallback(workloop);
};
requestIdleCallback(workloop);
