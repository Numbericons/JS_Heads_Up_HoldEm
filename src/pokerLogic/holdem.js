import Table from "./table";
import HumanPlayer from "../playerLogic/humanplayer";

class HoldEm {
  constructor($el, initialChipstack = 1500) {
    this.$el = $el;
    this.initialChipstack = initialChipstack;
    this.players = [new HumanPlayer("sb", initialChipstack), new HumanPlayer("bb", initialChipstack)];
    this.dealer_pos = 0;
    this.table = new Table($el, this.players);
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

  render(){
    this.table.render();
    // this.players[0].render();
    // this.players[1].render();
  }

  newGame(){
    while (this.players[0].chipstack > 0 && this.players[1].chipstack > 0) {
    this.render();
    this.playHand();
      this.togglePlayers();
      this.resetPlayerVars();
      this.table.resetVars();
    }
    if (this.players[0].chipstack === 0) {
      "Seat 2 has won the match!"
    } else {
      "Seat 1 has won the match!"
    }
  }

}

// <div class="actions-cont">
//   <div class="actions-cont-text" id="fold">FOLD</div>
//   <div class="actions-cont-text" id="check-call">CHECK/CALL</div>
//   <div class="actions-cont-text" id="bet-raise">BET/RAISE</div>
//   <input class="actions-cont-bet-amt" type="number" value="0">
// </div>

export default HoldEm;
