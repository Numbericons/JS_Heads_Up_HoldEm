import Table from './pokerLogic/table';

// sleep(ms){
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

$(() => {
  const actionsCont = $('.table-bottom-actions');
  const table = new Table(actionsCont, false, false); //3rd arg is watch mode
  table.setup();
});

// $(() => {
  // let results = { player1: 0, player2: 0 }
  // const games = 1000
  // for (let z=0; z<games; z++) {
  //   const table = new Table(null, true);
  //   const winner =  table.setup(true);
    // if (winner) results[winner] += 1;
    // results[numHands] += table.handNum;
  // }
  // $(".result-text-1").text(`Comp Player 1 wins: ${results['player1']} games`)
  // $(".result-text-2").text(`Comp Player 2 wins: ${results['player2']} games`)
  // $(".stats-1").text(`Average hands per game: ${results['numHands'] / games}`);
// });