import Table from "./table";
import HumanPlayer from "../playerLogic/humanplayer";
import ComputerPlayer from "../playerLogic/computerplayer";

class HoldEm {
  constructor($el, initialChipstack = 5000) {
    this.$el = $el;
    this.initialChipstack = initialChipstack;
    this.players = [new HumanPlayer("sb", initialChipstack), new ComputerPlayer("bb", initialChipstack)];
    this.dealer_pos = 0;
    this.table = new Table($el, this.players);
  }

  render(){
    this.table.board.render();
  }

  playHand(){
    this.table.board.playHand();
  }
  newGame(){
      this.render();
      this.playHand();
  }
}

export default HoldEm;
