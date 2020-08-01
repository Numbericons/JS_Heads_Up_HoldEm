import Table from './table';

let wins = { player1: 0, player2: 0 }
const table = new Table(null, true);
const winner = table.setup(true);
if (winner) wins[winner] += 1;
console.log(wins);
