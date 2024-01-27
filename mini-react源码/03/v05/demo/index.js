let taskId = 1;
function workLoop(deadline) {
  taskId++;

  let shouldYield = false;
  while (!shouldYield) {
    // run task
    console.log(`taskId:${taskId} run task`);
    // dom

    shouldYield = deadline.timeRemaining() < 1;
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);
