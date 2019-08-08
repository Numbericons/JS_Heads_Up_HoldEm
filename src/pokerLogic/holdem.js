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

  playerNames(player1, player2){
    let pNameRight = document.querySelector('.player-info-name-right');
    let pNameLeft = document.querySelector('.player-info-name-left');
    pNameRight.innerText = `${player1.name}`;
    pNameLeft.innerText = `${player2.name}`;
  }

  playerChips(player1, player2){
    let pChipsRight = document.querySelector('.player-info-chips-right');
    let pChipsLeft = document.querySelector('.player-info-chips-left');
    pChipsRight.innerText = `${player1.chipstack} chips`
    pChipsLeft.innerText = `${player2.chipstack} chips`
  }

  newGame(){
    let player1 = this.players[0];
    let player2 = this.players[1];
    this.playerNames(player1, player2);
    this.playerChips(player1, player2);
    // while (this.players[0].chipstack > 0 && this.players[1].chipstack > 0) {

      // section.appendChild(pNameR;
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
