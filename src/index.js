import HoldEm from './pokerLogic/holdem';
// import React from "react";
// import ReactDom from "react-dom";
// import App from "../dist/App"

// const Root = () => {
//   return (
//     // <App />
//   )
// }

// ReactDOM.render(element, document.getElementById('root'));

// ReactDOM.render(<h1>Hello Poker world!</h1>, document.getElementById("root"));
document.addEventListener("DOMContentLoaded", () => {
  const game = new HoldEm;
  game.newGame();
  console.log("Game Over!");
})
