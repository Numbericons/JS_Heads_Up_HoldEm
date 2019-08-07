import Table from "./table";
import HumanPlayer from "../playerLogic/humanplayer";

class HoldEm {
  constructor(initialChips) {
    this.initialChips = initialChips;
    this.players = [new HumanPlayer("sb", initialChips), new HumanPlayer("bb", initialChips)];
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
  game.playHand();
  game.togglePlayers();
  game.resetPlayerVars();
}
if (game.players[0].chipstack === 0) {
  "Seat 2 has won the match!"
} else {
  "Seat 1 has won the match!"
}
