import HoldEm from './pokerLogic/holdem';

$(() => {
  const actionsCont = $('.table-actions');
  const game = new HoldEm(actionsCont);
  game.newGame();
});

// $(() => {
//   const rootEl = $('.ttt');
//   const game = new Game();
//   new View(game, rootEl);
// });

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
// document.addEventListener("DOMContentLoaded", () => {
//   const game = new HoldEm;
//   game.newGame();
//   console.log("Game Over!");
// })



