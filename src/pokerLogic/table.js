import "babel-polyfill";
import Board from "./board.js";
import HumanPlayer from "../playerLogic/humanplayer";
import ComputerPlayer from "../playerLogic/computerplayer";

class Table {
  constructor($el, initialChipstack = 5000, sb = 50, bb = 100, cardDims = ["54%", "87%"]){
    this.players = [new HumanPlayer("sb", initialChipstack, cardDims), new ComputerPlayer("bb", initialChipstack, cardDims)];
    this.board = new Board($el, this.players, sb, bb, this)
    this.handNum = 1;
  }

  resetPlayerVars() {
    this.players[0].resetVars();
    this.players[1].resetVars();
  }

  togglePlayers() {
    this.board.players.push(this.board.players.shift());
    this.board.players[0].position = 'sb';
    this.board.players[1].position = 'bb';
  }

  handOver(){
    if (this.board.currentPlayer().chipstack === 0) {
      this.removeButtons();
      this.board.otherPlayer().promptText(`${this.board.otherPlayer().name} has won the match!`);
    } else if (this.board.otherPlayer().chipstack === 0) {
      this.removeButtons();
      this.board.currentPlayer().promptText(`${this.board.currentPlayer().name} has won the match!`);
    } else {
      this.nextHand();
    }
  }

  removeButtons(){
    this.board.button.$el.empty();
  }

  playHand(){
    this.board.playHand();
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async nextHand(){
    await this.sleep(2000);
    this.togglePlayers();
    this.resetPlayerVars();
    this.board.clearBoard();
    this.board.resetVars();
    this.handNum += 1;
    this.playHand();
  }
}

export default Table;