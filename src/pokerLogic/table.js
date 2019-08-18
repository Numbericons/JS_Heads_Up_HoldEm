import Board from "./board.js";

class Table {
  constructor($el, players, sb = 50, bb = 100){
    this.board = new Board($el, players, sb, bb, this)
    this.boardCards = [];
    this.players = players;
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

  nextHand(){
    this.togglePlayers();
    this.resetPlayerVars();
    this.board.clearBoard();
    this.board.resetVars();
    this.handNum += 1;
    this.playHand();
  }
}

export default Table;