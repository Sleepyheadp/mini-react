import React from "./core/React.js";

let count = 10;
let props = { id: "11111111111" };
function Counter({ num }) {
  // update
  function handleClick() {
    console.log("click");
    count++;
    props = {}
    React.update();
  }
  return (
    <div {...props}>
      count: {count}
      <button onClick={handleClick}>click</button>
    </div>
  );
}

function CounterContainer() {
  return <Counter></Counter>;
}

function App() {
  return (
    <div>
      hi-mini-react
      <Counter num={10}></Counter>
      {/* <Counter num={20}></Counter> */}
      {/* <CounterContainer></CounterContainer> */}
    </div>
  );
}

export default App;
