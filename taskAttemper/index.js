const el = document.createElement("div");
el.innerHTML = "task attemper";
document.body.append(el);

let i = 0;
while (i < 1000) {
	i++;
}
// 使用requestIdleCallback来进行任务调度
requestIdleCallback((idleDeadline) => {
	console.log("requestIdleCallback", idleDeadline.timeRemaining());
});
