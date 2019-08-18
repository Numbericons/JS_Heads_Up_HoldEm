import Deck from "./deck.js";
import Board from "./board.js";
const Hand = require('pokersolver').Hand;

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
    this.board.$el.empty();
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

  // fold($outDiv) {
  //   let $foldDiv = $("<button>");
  //   $foldDiv.addClass("actions-cont-text");
  //   $foldDiv.data("action", "fold");
  //   $foldDiv.html('FOLD');
  //   $outDiv.append($foldDiv)
  // }

  // callOrCheck($outDiv) {
  //   let $callDiv = $("<button>");
  //   $callDiv.addClass("actions-cont-text")
  //   if (this.currBet === 0) {
  //     $callDiv.data("action", "check");
  //     $callDiv.html('CHECK');
  //   } else {
  //     $callDiv.data("action", "call");
  //     $callDiv.html('CALL');
  //   }

  //   $outDiv.append($callDiv)
  // }

  // betAmount($outDiv) {
  //   let value;
  //   if (this.currBet > 0) {
  //     if (this.currBet === this.sb) {
  //       value = this.bb * 2;
  //     } else {
  //       value = this.currBet * 2;
  //     }
  //   } else {
  //     value = this.bb
  //   }
  //   let $betAmtDiv = $("<input/>", {
  //     type: 'text',
  //     class: 'actions-cont-bet-amt',
  //     value: `${value}`
  //   })
  //   $outDiv.append($betAmtDiv)
  // }

  // betOrRaise($outDiv) {
  //   let $betDiv = $("<button>");
  //   $betDiv.addClass("actions-cont-text")

  //   if (this.currBet === 0) {
  //     $betDiv.data("action", "bet");
  //     $betDiv.html('BET');
  //   } else {
  //     $betDiv.data("action", "raise");
  //     $betDiv.html('RAISE');
  //   }
  //   $outDiv.append($betDiv)
  // }

  // setButtons() {
  //   const $outDiv = $("<div>");
  //   $outDiv.addClass("actions-cont")

  //   this.fold($outDiv);
  //   this.callOrCheck($outDiv);
  //   if (!this.allIn() && this.currentPlayer().chipstack > this.currBet) {
  //     this.betOrRaise($outDiv);
  //     this.betAmount($outDiv);
  //   }

  //   this.$el.empty();
  //   this.$el.append($outDiv);
  // }

  // bindEvents() {
  //   this.$el.unbind();
  //   this.$el.on("click", "button", (event => {
  //     const $button = $(event.currentTarget);
  //     this.action($button);
  //   }));
  // }
}

export default Table;