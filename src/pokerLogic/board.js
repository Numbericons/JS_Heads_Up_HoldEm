import "babel-polyfill";
import Deck from './deck'
import Button from './button'
import Bet from './bet'
import Chipstack from './chipstack';
import Action from "./action";
const Hand = require('pokersolver').Hand;

export default class Board {
  constructor($el, players, sb = 50, bb = 100, table) {
    this.boardCards = [];
    this.deck = new Deck;
    this.button = new Button($el, this);
    this.bet = new Bet(this);
    this.action = new Action(this);
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
    this.handFinish = false;
    this.cardDelay = 900;
    this.rightChips = $('#table-felt-board-bet-player-1');
    this.leftChips = $('#table-felt-board-bet-player-2');
    this.shuffle = new Audio('https://js-holdem.s3-us-west-1.amazonaws.com/Audio/shuffle2.mp3');
    this.cardTurn = new Audio('https://js-holdem.s3-us-west-1.amazonaws.com/Audio/cardTurnOver.mp3');
    this.flop = new Audio('https://js-holdem.s3-us-west-1.amazonaws.com/Audio/flop.wav');
  }

  currentPlayer() {
    return this.players[this.currPlayerPos];
  }

  otherPlayer() {
    let otherPlayerPos = (this.currPlayerPos === 0) ? 1 : 0;
    return this.players[otherPlayerPos];
  }

  resetVars() {
    this.$currPot.removeClass();
    this.deck = new Deck;
    this.boardCards = [];
    this.pot = 0;
    this.currPlayerPos = 0;
    this.currBet = this.sb;
    this.streetActions = [];
    this.currStreet = 'preflop';
    this.lastShownCard = 0;
    this.handFinish = false;
  }

  showDealerBtn() {
    if (!!this.pot){
      (this.table.handNum % 2 === 0) ? this.button.showDealerBtnHelp('left', 'right') : this.button.showDealerBtnHelp('right', 'left');
    } else {
      this.button.hideDealerBtn();
    }
  }

  resetPlayerVars() {
    this.players[0].resetVars();
    this.players[1].resetVars();
  }

  async playHand() {
    this.shuffle.play();
    this.dealInPlayers();
    this.takeBlinds();
    this.render();
  }

  determineWinner() {
    this.handFinish = true;
    var hand1 = Hand.solve(this.handToStrArr(this.players[0]).concat(this.textBoard()));
    var hand2 = Hand.solve(this.handToStrArr(this.players[1]).concat(this.textBoard()));
    this.outputString = (this.boardCards.length > 0) ? `On a board of ${this.symbolBoard()}, ` : `Preflop, `
    var winners = Hand.winners([hand1, hand2]);
    if (winners.length === 2) {
      return this.tie(hand1);
    } else if (this.players[1].folded || (!this.players[0].folded && winners[0] === hand1)) {
      this.winner(hand1, hand2, 0, 1);
    } else {
      this.winner(hand2, hand1, 1, 0);
    }
  }

  relativeBet(playerAction){
    if (playerAction.includes('X')) {
      return 'raises'
    } else if (playerAction.includes('/')) {
      return (this.streetActions[this.streetActions.length - 2] > 0) ? 'raises' : 'bets';
    } else if (playerAction === 'All In') {
      return 'goes all in for';
    } else {
      return playerAction + 's';
    }
  }

  actionText(playerAction){
    let text = this.relativeBet(playerAction);
    const bbOption = (text === 'bet' && this.streetActions[0] === this.sb);
    let action = (bbOption) ? 'raises' : text;
    if (text === 'raise' || bbOption) action += ' to'
    return `${this.players[this.currPlayerPos].name} ${action}`
  }

  betText(playerAction){
    let retStr = this.actionText(playerAction);
    if (playerAction === 'call') {
      retStr += ` ${this.streetActions[this.streetActions.length - 1]}`;
    } else if (playerAction !== 'check') {
      retStr += ` ${this.currentPlayer().streetChipsInPot}`;
    }
    return retStr;
  }

  lastActionChat(playerAction){
    let output = this.betText(playerAction);
    this.renderChat(output);
  }

  renderChat(str){
    let chat = $('.table-bottom-text-chat');
    chat.val(str);
  }

  chipMissing(){
    return this.players[0].chipstack + this.players[1].chipstack < this.table.initialChipstack * 2;
  }

  tie(hand) {
    this.renderChat(this.outputString + `the hand resulted in a tie. Splitting the pot of $${this.pot} with ${hand.descr}!`)
    this.players[0].chipstack += Math.floor(this.pot / 2);
    this.players[1].chipstack += Math.floor(this.pot / 2);
    if (this.chipMissing()) {
      if (Math.random() < .5) {
        this.players[0].chipstack += 1;
      } else {
        this.players[1].chipstack += 1;
      }
    }
    this.renderPlayers();
    this.table.handOver();
  }

  winner(winHand, loseHand, wonPos, lostPos) {
    this.outputString += `${this.players[wonPos].name} wins the pot of $${this.pot}`;
    if (!this.players[lostPos].folded) this.outputString += ` with hand: ${winHand.descr}`;
    if (!this.players[lostPos].chipstack === 0) this.outputString += `${this.players[losePos].name} lost with with hand: ${loseHand.descr}`;
    this.players[wonPos].chipstack += this.pot;
    this.renderPlayers();
    this.renderChat(this.outputString);
    this.$currPot.addClass(`won-${this.players[wonPos].side}`);
    this.players[0].unrenderChips();
    this.players[1].unrenderChips();
    this.table.handOver();
  }
  
  clearBoard() {
    for (let i = 0; i < this.boardCards.length; i++) {
      let card = document.querySelector(`.table-felt-board-card-${i + 1}`);
      this.boardCards[i].unrender(card);
    }
  }

  handToStrArr(player) {
    return player.hand.map(card => {
      return `${card.rank}${card.suit}`;
    })
  }

  async dealPlayerCard(pos, revealed) {
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

  takeBlinds() {
    const sbTotal = this.bet.blindPlayer(this.players[0], this.sb);
    const bbTotal = this.bet.blindPlayer(this.players[1], this.bb);
    this.pot = sbTotal + bbTotal;
  }

  async dealCard(sound) {
    this.currPlayerPos = 1;
    this.boardCards.push(this.deck.draw());
    if (sound) this.cardTurn.play();
    this.showBoard();
  }
  
  async dealFlop() {
    this.currPlayerPos = 1;
    for (let i = 0; i < 3; i++) {
      if (i > 0) await this.sleep(this.cardDelay);
      this.dealCard(true);
    }
  }

  symbolBoard() {
    let textBoard = this.boardCards.map(card => {
      return card.show();
    })
    return textBoard;
  }

  textBoard() {
    let textBoard = this.boardCards.map(card => {
      return `${card.rank}${card.suit}`;
    })
    return textBoard;
  }

  sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  showBoardCard(pos){
    let card = document.querySelector(`.table-felt-board-card-${pos+1}`);
    this.boardCards[pos].render(card, "72px", "106px", true)
  }

  showBoard() {
    if (this.boardCards.length === 0) return;
    for (let i = this.lastShownCard; i < this.boardCards.length; i++) {
      this.showBoardCard(i);
      this.lastShownCard+=1
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
    if (this.players[0].chipstack === 0 || this.players[1].chipstack === 0) {
      return true
    }
    return false;
  }

  showPot() {
    let currPotText = document.querySelector(`.top-left-current-pot-text`);
    currPotText.innerText = `Current pot: $${this.pot}`;
    this.$currPot = $(`#table-felt-pot`);
    let potStack = new Chipstack(this.pot, this.$currPot);
    potStack.render();
  }

  renderPlayers(){
    let gameStarted = !!this.pot;
    let currZero = this.currPlayerPos === 0;
    this.players[0].render(gameStarted, currZero);
    this.players[1].render(gameStarted, !currZero);

  }

  renderDealerPlayers(){
    this.showDealerBtn();
    this.renderPlayers();
  }

  pfBetSize(){
    return this.currStreet === 'preflop' && 
      (!this.streetActions.length || (this.streetActions.length === 1 && this.streetActions[0] === this.sb)); //preflop first to act or 2nd to act after call  
  }

  async render() {
    this.renderDealerPlayers();
    this.showPot();
    if (this.allIn() && this.handChipDiff() === 0) {
      await this.showDown();
      this.determineWinner();
      return;
    }
    this.showBoard();
    this.button.setButtons(this.pfBetSize());
    this.button.bindEvents();
  
    if (this.currentPlayer().comp && (this.streetActions.length < 2 || this.handChipDiff() !== 0)) {
      this.button.$el.empty();
      this.action.promptPlayer(this.handToStrArr(this.currentPlayer()));
    } else if (this.currentPlayer().hand[0]) {
      this.currentPlayer().promptAction(this.handChipDiff(), this.currentPlayer.chipstack);
    }
  }

  handChipDiff() {
    return Math.abs(this.players[0].chipsInPot - this.players[1].chipsInPot);
  }

  isSb(){
    return (this.currStreet === 'preflop' && this.streetActions.length === 0) ? this.sb : 0;
  }

  revealCards() {
    this.players.forEach(player => { 
      player.revealed = true
    })
    this.renderPlayers();
  }

  async showDown() {
    this.revealCards();
    while (this.boardCards.length < 5) {
      await this.sleep(this.cardDelay * 1.5);
      this.dealCard(true);
      this.showBoard();
    }
  }

  combineChips(){
    this.leftChips.addClass('chip-combine-left')
    this.rightChips.addClass('chip-combine-right')
  }

  setAggressor(){
    this.otherPlayer().aggressor = false;
    if (this.streetActions[this.streetActions.length - 2] > this.sb) {
      this.currentPlayer().aggressor = true;
    } else {
      this.currentPlayer().aggressor = false;
    }
  }

  async stepStreet(flopBool) {
    this.combineChips();
    await this.sleep(1000);
    this.rightChips.removeClass();
    this.leftChips.removeClass();
    (flopBool) ? this.dealFlop() : this.dealCard(true);
    this.showBoard();
    if (!this.allIn()) this.render();
  }
  
  nextStreet() {
    this.setAggressor();
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