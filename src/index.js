import Table from './pokerLogic/table';

// sleep(ms){
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

$( async () => {
  const actionsCont = $('.table-bottom-actions');
  // const table = new Table(actionsCont);
  // table.setup();
  let wins = { player1: 0, player2: 0 }
  for (let z=0; z<100; z++) {
    const table = new Table(actionsCont);
    await table.setup(true);
    let winner = table.board.players[0].chipstack > 0 ? 'player1' : 'player2';
    wins[winner] += 1
  }
  console.log(wins);
});