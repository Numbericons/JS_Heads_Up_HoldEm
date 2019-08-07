import Table from "./table";
import HumanPlayer from "../playerLogic/humanplayer";

class HoldEm {
  constructor(initialChipstack = 1500) {
    this.initialChipstack = initialChipstack;
    this.players = [new HumanPlayer("sb", initialChipstack), new HumanPlayer("bb", initialChipstack)];
    this.dealer_pos = 0;
    this.table = new Table(this.players);
  }

  playHand(){
    this.table.playHand();
  }

  togglePlayers(){
    this.players.push(this.players.shift());
    if (this.players[0].position === 1) {
      this.players[0].position = 2;
      this.players[1].position = 1;
    } else {
      this.players[0].position = 1;
      this.players[1].position = 2;
    }
  }

  resetPlayerVars() {
    this.players[0].folded = false;
    this.players[0].chipsInPot = 0;
    this.players[0].hand = [];
    this.players[1].folded = false;
    this.players[1].chipsInPot = 0;
    this.players[1].hand = [];
  }
}

let game = new HoldEm;
while (game.players[0].chipstack > 0 && game.players[1].chipstack > 0) {
  let section = document.querySelector('section');
  let player1 = game.players[0];
  let player1name = document.createElement('div');
  player1name.innerHTML = `<h5 class="playername>${player1.name}<h5/>`
  section.appendChild(player1name);
  game.playHand();
  game.togglePlayers();
  game.resetPlayerVars();
  game.table.resetVars(); 
}
if (game.players[0].chipstack === 0) {
  "Seat 2 has won the match!"
} else {
  "Seat 1 has won the match!"
}
