import Table from "./table";
import HumanPlayer from "../playerLogic/humanplayer";
import ComputerPlayer from "../playerLogic/computerplayer";

class HoldEm {
  constructor($el, initialChipstack = 1500) {
    this.$el = $el;
    this.initialChipstack = initialChipstack;
    // this.players = [new HumanPlayer("sb", initialChipstack), new ComputerPlayer("bb", initialChipstack)];
    this.players = [new ComputerPlayer("sb", initialChipstack), new HumanPlayer("bb", initialChipstack)];
    // this.players = [new HumanPlayer("sb", initialChipstack), new HumanPlayer("bb", initialChipstack)];
    this.dealer_pos = 0;
    this.table = new Table($el, this.players);
  }

  playHand(){
    this.table.playHand();
  }

  newGame(){
    // while (this.players[0].chipstack > 0 && this.players[1].chipstack > 0) {
      this.table.render();
      this.playHand();
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

// <div class="actions-cont">
//   <div class="actions-cont-text" id="fold">FOLD</div>
//   <div class="actions-cont-text" id="check-call">CHECK/CALL</div>
//   <div class="actions-cont-text" id="bet-raise">BET/RAISE</div>
//   <input class="actions-cont-bet-amt" type="number" value="0">
// </div>

export default HoldEm;
