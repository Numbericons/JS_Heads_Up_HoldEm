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

  newGame(){
    // while (this.players[0].chipstack > 0 && this.players[1].chipstack > 0) {
      let playername = document.querySelector('section');
      console.log(playername);
      let player1 = this.players[0];
      console.log(player1);
      playername.innerText = `${player1.name}`;
      // section.appendChild(playername);
      // this.playHand();
    //   this.togglePlayers();
    //   this.resetPlayerVars();
    //   this.table.resetVars();
    // }
    // if (this.players[0].chipstack === 0) {
    //   "Seat 2 has won the match!"
    // } else {
    //   "Seat 1 has won the match!"
    // }
  }
}

export default HoldEm;
