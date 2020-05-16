import Table from './pokerLogic/table';

// sleep(ms){
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

$(() => {
  // const actionsCont = $('.table-bottom-actions');
  // const table = new Table(actionsCont);
  // table.setup();
  
  let wins = { player1: 0, player2: 0 }
  for (let z=0; z<1000; z++) {
    const table = new Table(null, true);
    const winner =  table.setup(true);
    if (winner) wins[winner] += 1;
  }
  // document.querySelector(".result-text-1").innerText = wins;
  // document.querySelector(".result-text-2").innerText = wins;
  $(".result-text-1").text(`Comp Player 1 wins: ${wins['player1']} games`)
  $(".result-text-2").text(`Comp Player 2 wins: ${wins['player2']} games`)
});