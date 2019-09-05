import "babel-polyfill";
import Board from "./board.js";
import HumanPlayer from "../playerLogic/humanplayer";
import ComputerPlayer from "../playerLogic/computerplayer";

class Table {
  constructor($el, initialChipstack = 5000, sb = 50, bb = 100, cardDims = ["54%", "96%"]){
    // this.players = [new ComputerPlayer("sb", initialChipstack, cardDims), new HumanPlayer("bb", initialChipstack, cardDims)];
    this.players = [new HumanPlayer("sb", initialChipstack, cardDims), new ComputerPlayer("bb", initialChipstack, cardDims)];
    this.board = new Board($el, this.players, sb, bb, this)
    this.handNum = 1;

    this.win1 = new Audio('https://js-holdem.s3-us-west-1.amazonaws.com/Audio/win1.wav');
    this.win2 = new Audio('https://js-holdem.s3-us-west-1.amazonaws.com/Audio/win2.wav');
    this.win3 = new Audio('https://js-holdem.s3-us-west-1.amazonaws.com/Audio/win3.mp3');
    this.loss1 = new Audio('https://js-holdem.s3-us-west-1.amazonaws.com/Audio/loss1.wav');
    this.loss2 = new Audio('https://js-holdem.s3-us-west-1.amazonaws.com/Audio/loss2.wav');
    this.loss3 = new Audio('https://js-holdem.s3-us-west-1.amazonaws.com/Audio/loss3.wav');
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

  winSound(rng){
    if (rng < .333) {
      this.win1.play();
    } else if (rng < .666) {
      this.win2.play();
    } else {
      this.win3.play();
    }
  }
  lossSound(rng){
    if (rng < .333) {
      this.loss1.play();
    } else if (rng < .666) {
      this.loss2.play();
    } else {
      this.loss3.play();
    }
  }
  sampleWinLoss(){
    let rng = Math.random();
    if (this.board.currentPlayer().chipstack === 0) {
      if (this.board.currentPlayer().comp){
        this.winSound(rng);
      } else {
        this.lossSound(rng);
      }
    } else {
      if (this.board.currentPlayer().comp) {
        this.lossSound(rng);
      } else {
        this.winSound(rng);
      }
    }
  }

  async resultSound(){
    await this.sleep(1500);
    this.sampleWinLoss();
  }

  setup(){
    this.board.renderDealerPlayers();
    this.board.button.bindPlayGame(this);
  }

  newGame(){
    location.reload();
  }

  result(){
    this.removeButtons();
    this.resultSound();
    this.board.button.bindNewGame(this);
  }

  handOver(){
    if (this.board.currentPlayer().chipstack === 0) {
      this.board.otherPlayer().promptText(`${this.board.otherPlayer().name} has won the match!`);
      this.result();
    } else if (this.board.otherPlayer().chipstack === 0) {
      this.board.currentPlayer().promptText(`${this.board.currentPlayer().name} has won the match!`);
      this.result();
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
    if (this.handNum > 0) await this.sleep(2000);
    this.togglePlayers();
    this.resetPlayerVars();
    this.board.clearBoard();
    this.board.resetVars();
    this.handNum += 1;
    this.playHand();
  }
}

export default Table;