import Table from './pokerLogic/table';

// sleep(ms){
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

$( async () => {
  // const actionsCont = $('.table-bottom-actions');
  // const table = new Table(actionsCont);
  // table.setup();
  let wins = { player1: 0, player2: 0 }
  for (let z=0; z<1000; z++) {
    const table = new Table(null, true);
    const winner =  table.setup(true);
    if (winner) wins[winner] += 1;
  }
  console.log(wins);
});