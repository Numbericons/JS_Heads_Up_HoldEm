import "babel-polyfill";
import Deck from './deck'
import Button from './button'
const Hand = require('pokersolver').Hand;

export default class Board {
  constructor($el, players, sb = 50, bb = 100, table) {
    this.boardCards = [];
    this.deck = new Deck;
    this.button = new Button($el, this);
    this.players = players;
    this.sb = sb;
    this.bb = bb;
    this.table = table;
    this.pot = 0;
    this.currPlayerPos = 0;
    this.currBet = this.sb;
    this.streetActions = [];
    this.currStreet = 'preflop';
    this.lastShownCard = 0;
  }

  currentPlayer() {
    return this.players[this.currPlayerPos];
  }

  otherPlayer() {
    let otherPlayerPos = (this.currPlayerPos === 0) ? 1 : 0;
    return this.players[otherPlayerPos];
  }

  resetVars() {
    this.deck = new Deck;
    this.boardCards = [];
    this.pot = 0;
    this.currPlayerPos = 0;
    this.currBet = this.sb;
    this.streetActions = [];
    this.currStreet = 'preflop';
  }

  showDealerBtn() {
    if (this.table.handNum % 2 === 0) {
      $('#dealer-right-img').addClass("display-none");
      let button = $('#dealer-left-img');
      button.removeClass();
      (this.boardCards.length === 0) ? button.addClass("table-felt-dealer-btn-left") : button.addClass("table-felt-dealer-btn-left-board");
    } else {
      $('#dealer-left-img').addClass("display-none");
      let button = $('#dealer-right-img');
      button.removeClass();
      (this.boardCards.length === 0) ? button.addClass("table-felt-dealer-btn-right") : button.addClass("table-felt-dealer-btn-right-board");
    }
  }

  resetPlayerVars() {
    this.players[0].resetVars();
    this.players[1].resetVars();
  }

  playHand() {
    if (this.allIn()) {
      debugger
      this.table.removeButtons();
      return;
    }  
    this.dealInPlayers();
    this.takeBlinds();
    this.render();
  }

  determineWinner() {
    var hand1 = Hand.solve(this.handToStrArr(this.players[0]).concat(this.textBoard()));
    var hand2 = Hand.solve(this.handToStrArr(this.players[1]).concat(this.textBoard()));
    this.outputString = (this.boardCards.length > 0) ? `On a board of ${this.textBoard()}, ` : `Preflop, `
    var winners = Hand.winners([hand1, hand2]);
    if (!this.players[0].folded && !this.players[1].folded && winners.length === 2) {
      return this.tie(hand1);
    } else if (this.players[1].folded || (!this.players[0].folded && winners[0] === hand1)) {
      this.winner(hand1, hand2, 0, 1);
    } else {
      this.winner(hand2, hand1, 1, 0);
    }
  }

  tie(hand) {
    alert(this.outputString + `the hand resulted in a tie. Splitting the pot of $${this.pot} with ${hand.descr}!`)
    this.players[0].chipstack += Math.floor(this.pot / 2);
    this.players[1].chipstack += Math.floor(this.pot / 2);
    if (!this.pot % 2 === 0) {
      if (Math.random() < .5) {
        this.players[0].chipstack += 1;
      } else {
        this.players[1].chipstack += 1;
      }
    }
    this.table.handOver();
  }

  winner(winHand, loseHand, winPos, losePos) {
    this.outputString += `${this.players[winPos].name} wins the pot of $${this.pot}`;
    if (!this.players[losePos].folded) this.outputString += ` with hand: ${winHand.descr}`;
    if (!this.players[losePos].chipstack === 0) this.outputString += `${this.players[losePos].name} lost with with hand: ${loseHand.descr}`;
    this.players[winPos].chipstack += this.pot;
    this.renderPlayers();
    alert(this.outputString);
    // this.renderPlayers().then(res => {
    //   alert(this.outputString);
    // })
    this.table.handOver();
  }

  clearBoard() {
    for (let i = 0; i < this.boardCards.length; i++) {
      let card = document.querySelector(`.table-felt-board-card-${i + 1}`);
      this.boardCards[i].unrender(card);
    }
  }

  handToStrArr(player) {
    let playerHand = player.hand.map(card => {
      return `${card.rank}${card.suit}`;
    })
    return playerHand;
  }

  dealPlayerCard(pos, revealed) {
    let card = this.deck.draw();
    card.revealed = revealed;
    this.players[pos].hand.push(card);
  }

  dealInPlayers() {
    this.dealPlayerCard(1, !this.players[1].comp);
    this.dealPlayerCard(0, !this.players[0].comp);
    this.dealPlayerCard(1, !this.players[1].comp);
    this.dealPlayerCard(0, !this.players[0].comp);
  }

  chkBlindAllIn(){
    if (this.otherPlayer().chipstack === 0) {
      return this.handChipDiff();
    } else {
      return this.currBet; 
    }
  }

  blindPlayer(player, blind){
    if (player.chipstack > blind) {
      player.chipstack -= blind;
      player.chipsInPot = blind;
      player.streetChipsInPot = blind;
      return blind;
    } else {
      player.chipsInPot = player.chipstack;
      player.streetChipsInPot = player.chipstack;
      player.chipstack = 0;
      return player.chipsInPot;
    }
  }

  takeBlinds() {
    const sbTotal = this.blindPlayer(this.players[0], this.sb);
    const bbTotal = this.blindPlayer(this.players[1], this.bb);
    this.pot = sbTotal + bbTotal;
  }

  dealCard() {
    this.currPlayerPos = 1;
    this.boardCards.push(this.deck.draw());
  }

  dealFlop() {
    this.currPlayerPos = 1;
    for (let i = 0; i < 3; i++) {
      this.dealCard();
    }
  }

  textBoard() {
    let textBoard = this.boardCards.map(card => {
      return `${card.rank}${card.suit}`
    })
    return textBoard;
  }

  sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  startCard(){
    if (this.currStreet === 'flop') {
      return 0;
    } else {
      return this.boardCards.length - 1;
    }
  }

  showBoardCard(pos){
    let card = document.querySelector(`.table-felt-board-card-${pos+1}`);
    this.boardCards[pos].render(card, "17.5%", "58%", true)
  }

  async showBoard() {
    if (this.boardCards.length === 0) return;
    for (let i = this.startCard(); i < this.boardCards.length; i++) {
      await this.sleep(500);
      this.showBoardCard(i);
      // setTimeout(this.showBoardCard(i), 5000);
    };
  }

  toggleCurrPlayer() {
    if (this.currPlayerPos === 0) {
      this.currPlayerPos = 1;
    } else {
      this.currPlayerPos = 0;
    }
  }

  allIn() {
    if (this.players[0].chipstack === 0 || this.players[1].chipstack === 0) return true;
    return false;
  }

  showPot() {
    let currPot = document.querySelector(`.table-felt-pot`);
    currPot.innerText = `Current pot: $${this.pot}`;
  }

  resolvePlayerPrompt(response) {
    if (response[0] === 'fold') {
      this.action(null, 'fold');
    } else if (response[0] === 'call') {
      this.action(null, 'call');
    } else if (response[0] === 'check') {
      this.action(null, 'check');
    } else {
      this.action(null, 'bet', Math.ceil(response[1]));
    }
  }

  promptPlayer() {
    let response = this.currentPlayer().promptResponse(this.currBet, this.currentPlayer().chipstack);
    if (response) {
      this.resolvePlayerPrompt(response);
    }
  }

  renderPlayers(){
    this.players[0].render();
    this.players[1].render();
  }

  render() {
    this.showDealerBtn();
    this.showPot();
    this.renderPlayers();
    this.showBoard();
    this.button.setButtons();
    this.button.bindEvents();
    if (this.currentPlayer().hand[0]) this.currentPlayer().promptAction(this.chkBlindAllIn(), this.currentPlayer.chipstack);
    if (this.currentPlayer().comp && (this.streetActions.length < 2 || this.handChipDiff() !== 0)) this.promptPlayer();
  }

  handChipDiff() {
    return Math.abs(this.players[0].chipsInPot - this.players[1].chipsInPot);
  }

  calcBetInput(isSb) {
    let betInput = $('.actions-cont-bet-amt');
    if (betInput.length === 0) return 0;
    let totalBet = Number(betInput[0].value);
    if (totalBet > this.currentPlayer().chipstack) totalBet = this.currentPlayer().chipstack - isSb;
    if (totalBet > this.otherPlayer().chipstack) totalBet = this.otherPlayer().chipstack + this.handChipDiff() - isSb;
    return totalBet;
  }

  calcCompBetRaise(compBetRaise, isSb) {
    let totalBet;
    if (compBetRaise > this.currentPlayer().chipstack) {
      totalBet = this.currentPlayer().chipstack - isSb;
    } else if (compBetRaise > this.otherPlayer().chipstack) {
      totalBet = this.otherPlayer().chipstack + this.handChipDiff() - isSb;
    } else {
      totalBet = compBetRaise;
    }
    return totalBet;
  }

  action($button, compAction, compBetRaise) {
    let playerAction;
    playerAction = ($button) ? $button.data().action : compAction;
    if (playerAction === 'fold') {
      this.currentPlayer().folded = true;
      return this.determineWinner();
    }
    let isSb = (this.currStreet === 'preflop' && this.streetActions.length === 0) ? this.sb : 0;
    let betRaise;
    if (compBetRaise) {
      if (compBetRaise < this.bb) compBetRaise = this.bb;
      betRaise = this.calcCompBetRaise(compBetRaise, isSb);
    } else {
      betRaise = this.calcBetInput(isSb);
    }
    let resolvedAction = this.currentPlayer().resolve_action(this.handChipDiff(), betRaise, playerAction, isSb);
    if (resolvedAction) {
      this.pot += resolvedAction
    }
    this.streetActions = this.streetActions.concat(resolvedAction);
    this.continueAction();
  }

  continueAction() {
    this.currBet = this.handChipDiff();
    this.toggleCurrPlayer();
    this.render();
    this.nextAction();
  }

  nextAction() {
    let handChipsEqual = this.handChipDiff() === 0;
    let multipleActions = this.streetActions.length > 1;
    if (this.streetActions[this.streetActions - 1] === 'fold') {
      this.determineWinner();
    } else if (handChipsEqual) {
      if (this.allIn()) {
        this.showDown();
        this.determineWinner();
      } else if (this.currStreet === 'river' && multipleActions) {
        this.revealCards();
        this.determineWinner();
      } else if (multipleActions) {
        this.nextStreet();
      }
    }
  }

  revealCards() {
    this.players.forEach(player => { player.revealed = true })
  }

  showDown() {
    this.revealCards();
    while (this.boardCards.length < 5) {
      this.dealCard();
      this.showBoard();
    }
  }

  stepStreet(flopBool) {
    (flopBool) ? this.dealFlop() : this.dealCard();
    this.showBoard();
    if (!this.allIn()) this.render();
  }

  nextStreet() {
    this.streetActions = [];
    this.currBet = 0;
    this.players[0].streetChipsInPot = 0;
    this.players[1].streetChipsInPot = 0;
    if (this.currStreet === 'preflop') {
      this.currStreet = 'flop';
      this.stepStreet(true);
    } else if (this.currStreet === 'flop') {
      this.currStreet = 'turn';
      this.stepStreet();
    } else if (this.currStreet === 'turn') {
      this.currStreet = 'river';
      this.stepStreet();
    }
  }
}