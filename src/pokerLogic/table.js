import Deck from "./deck.js";
const Hand = require('pokersolver').Hand;

class Table {
  constructor($el, players, sb = 50, bb = 100){
    this.boardCards = [];
    this.deck = new Deck;
    this.players = players;
    this.sb = sb;
    this.bb = bb;
    this.pot = 0;
    this.currPlayerPos = 0;
    this.$el = $el;
    this.currBet = this.sb;
    this.streetActions = [];
    this.currStreet = 'preflop';
    this.handNum = 1;

    this.bindEvents = this.bindEvents.bind(this);
  }

  currentPlayer(){
    return this.players[this.currPlayerPos];
  }

  otherPlayer(){
    let otherPlayerPos = (this.currPlayerPos === 0) ? 1 : 0;
    return this.players[otherPlayerPos];
  }

  resetVars(){
    this.deck = new Deck;
    this.boardCards = [];
    this.pot = 0;
    this.currPlayerPos = 0;
    this.currBet = this.sb;
    this.streetActions = [];
    this.currStreet = 'preflop';
  }

  showDealerBtn(){
    let dealerButton = $('#table-felt-dealer-btn');
    dealerButton.removeClass();
    if (this.handNum % 2 === 0) {
      (this.boardCards.length === 0) ? dealerButton.addClass("table-felt-dealer-btn-left") : dealerButton.addClass("table-felt-dealer-btn-left-board");
    } else {
      (this.boardCards.length === 0) ? dealerButton.addClass("table-felt-dealer-btn-right") : dealerButton.addClass("table-felt-dealer-btn-right-board");
    }
  }

  resetPlayerVars() {
    this.players[0].resetVars();
    this.players[1].resetVars();
  }

  playHand(){
    this.dealInPlayers();
    this.takeBlinds();
    this.render();
  }

  togglePlayers() {
    this.players.push(this.players.shift());
    this.players[0].position = 'sb';
    this.players[1].position = 'bb';
  }

  determineWinner(){
    var hand1 = Hand.solve(this.handToStrArr(this.players[0]).concat(this.textBoard()));
    var hand2 = Hand.solve(this.handToStrArr(this.players[1]).concat(this.textBoard()));
    this.outputString = (this.boardCards.length > 0) ? `On a board of ${this.textBoard()}, `: `Preflop, `
    var winners = Hand.winners([hand1, hand2]);
    if (!this.players[0].folded && !this.players[1].folded && winners.length === 2){
      return this.tie(hand1);
    } else if (this.players[1].folded || (!this.players[0].folded && winners[0] === hand1)) {
      return this.winner(hand1, hand2, 0, 1);
    } else {
      return this.winner(hand2, hand1, 1, 0);
    }
  }

  tie(hand){
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
    this.gameOver();
  }

  winner(winHand, loseHand, winPos,losePos){
    this.outputString += `${this.players[winPos].name} wins the pot of $${this.pot}`;
    if (!this.players[losePos].folded) this.outputString += ` with hand: ${winHand.descr}`;
    if (!this.players[losePos].chipstack === 0) this.outputString += `${this.players[losePos].name} lost with with hand: ${loseHand.descr}`;
    alert(this.outputString);
    this.players[winPos].chipstack += this.pot;
    this.gameOver();
  }

  gameOver(){
    if (this.players[0].chipstack === 0) {
      this.currentPlayer().promptText(`${this.players[1].name} has won the match!`);
    } else if (this.players[1].chipstack === 0) {
      this.currentPlayer().promptText(`${this.players[1].name} has won the match!`);
    } else {
      this.nextHand();
    }
  }

  clearFlop(){
    for (let i =0; i< 3; i++) {
      let card = document.querySelector(`.table-felt-board-flop-${i+1}`);
      this.boardCards[i].unrender(card);
    }
  }

  clearTurnRiver(street){
    let card = document.querySelector(`.table-felt-board-${street}`);
    (street === 'turn') ? this.boardCards[3].unrender(card) : this.boardCards[4].unrender(card);
  }

  clearBoard(){
    if (this.boardCards[0]) this.clearFlop();
    if (this.boardCards[3]) this.clearTurnRiver("turn");
    if (this.boardCards[4]) this.clearTurnRiver("river");
  }

  nextHand(){
    this.togglePlayers();
    this.resetPlayerVars();
    this.clearBoard();
    this.resetVars();
    this.handNum += 1;
    this.playHand();
  }

  handToStrArr(player){
    let playerHand = player.hand.map(card => {
      return `${card.rank}${card.suit}`;
    })
    return playerHand;
  }

  dealPlayerCard(pos, revealed){
    let card = this.deck.draw();
    card.revealed = revealed;
    this.players[pos].hand.push(card);
  }

  dealInPlayers(){
    this.dealPlayerCard(1, false);
    this.dealPlayerCard(0, true);
    this.dealPlayerCard(1, false);
    this.dealPlayerCard(0, true);
  }

  takeBlinds(){
    this.players[0].chipstack -= this.sb;
    this.players[0].chipsInPot = this.sb;
    this.players[1].chipstack -= this.bb;
    this.players[1].chipsInPot = this.bb;
    this.pot = this.sb + this.bb;
  }

  dealCard(){
    this.currPlayerPos = 1;
    this.boardCards.push(this.deck.draw());
  }

  dealFlop(){
    this.currPlayerPos = 1;
    for(let i=0;i<3;i++){
      this.dealCard();
    }
  }

  textBoard(){
    let textBoard = this.boardCards.map(card => {
      return `${card.rank}${card.suit}`
    })
    return textBoard;
  }

  showFlop(){
    let card1 = document.querySelector(`.table-felt-board-flop-1`);
    this.boardCards[0].render(card1, "17.5%", "52%")
    let card2 = document.querySelector(`.table-felt-board-flop-2`);
    this.boardCards[1].render(card2, "17.5%", "52%")
    let card3 = document.querySelector(`.table-felt-board-flop-3`);
    this.boardCards[2].render(card3, "17.5%", "52%")
  }

  showTurn(){
    let card4 = document.querySelector(`.table-felt-board-turn`);
    this.boardCards[3].render(card4, "17.5%", "52%")
  }

  showRiver(){
    let card5 = document.querySelector(`.table-felt-board-river`);
    this.boardCards[4].render(card5, "17.5%", "52%")
  }

  showBoard(){
    if (this.boardCards[0]) this.showFlop();
    if (this.boardCards[3]) this.showTurn();
    if (this.boardCards[4]) this.showRiver();
  }

  toggleCurrPlayer(){
    if (this.currPlayerPos === 0){
      this.currPlayerPos = 1;
    } else  {
      this.currPlayerPos = 0;
    }
  }

  remainingPlayers() {
    if (this.players[0].folded === true || this.players[1].folded === true) return false;
    return true;
  }
  
  allIn() {
    if (this.players[0].chipstack === 0 || this.players[1].chipstack === 0) return true;
    return false;
  }

  showPot(){
    let currPot = document.querySelector(`.table-felt-pot`);
    currPot.innerText = `Current pot: $${this.pot}`;
  }

  resolvePlayerPrompt(response){
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

  promptPlayer(){
    let response = this.currentPlayer().promptResponse(this.currBet, this.currentPlayer().chipstack);
    if (response) {
      this.resolvePlayerPrompt(response);
    }
  }

  render(){
    this.showDealerBtn();
    this.showPot();
    this.showBoard();
    this.players[0].render();
    this.players[1].render();
    this.setButtons();
    this.bindEvents();
    if (this.currentPlayer().hand[0]) this.currentPlayer().promptAction(this.currBet, this.currentPlayer.chipstack);
    if (this.currentPlayer().comp && (this.streetActions.length < 2 || this.handChipDiff() !== 0 )) this.promptPlayer();
  }

  fold($outDiv) {
    let $foldDiv = $("<button>");
    $foldDiv.addClass("actions-cont-text");
    $foldDiv.data("action", "fold");
    $foldDiv.html('FOLD');
    $outDiv.append($foldDiv)
  }

  callOrCheck($outDiv){
    let $callDiv = $("<button>");
    $callDiv.addClass("actions-cont-text")
    if (this.currBet === 0) {
      $callDiv.data("action", "check");
      $callDiv.html('CHECK');
    } else {
      $callDiv.data("action", "call");
      $callDiv.html('CALL');
    }
      
    $outDiv.append($callDiv)
  }

  betAmount($outDiv){
    let value;
    if (this.currBet > 0) {
      if (this.currBet === this.sb) {
        value = this.bb * 2;
      } else {
        value = this.currBet * 2;
      }
    } else {
      value = this.bb
    } 
    let $betAmtDiv = $("<input/>", {
      type: 'text',
      class: 'actions-cont-bet-amt',
      value: `${value}`
    })
    $outDiv.append($betAmtDiv)
  }

  betOrRaise($outDiv){
    let $betDiv = $("<button>");
    $betDiv.addClass("actions-cont-text")

    if (this.currBet === 0) {
      $betDiv.data("action", "bet");
      $betDiv.html('BET');
    } else {
      $betDiv.data("action", "raise");
      $betDiv.html('RAISE');
    }
    $outDiv.append($betDiv)
  }

  setButtons() {
    const $outDiv = $("<div>");
    $outDiv.addClass("actions-cont")
    
    this.fold($outDiv);
    this.callOrCheck($outDiv);
    if (!this.allIn() && this.currentPlayer().chipstack > this.currBet) {
      this.betOrRaise($outDiv);
      this.betAmount($outDiv);
    }

    this.$el.empty();
    this.$el.append($outDiv);
  }

  renderCurrBet(amount){
    if (this.currStreet === 'preflop' && this.streetActions.length === 1){
      if (amount === 50) {
        this.currBet = 0;
      } else {
        this.currBet = amount - 50;
      }
    } else {
      this.currBet = (amount > 0) ? amount : 0;
    }
  }

  handChipDiff(){
    return Math.abs(this.players[0].chipsInPot - this.players[1].chipsInPot);
  }

  calcBetInput(isSb){
    let betInput = $('.actions-cont-bet-amt');
    if (betInput.length === 0) return 0;
    let totalBet = Number(betInput[0].value);
    if (totalBet > this.currentPlayer().chipstack) totalBet = this.currentPlayer().chipstack - isSb;
    if (totalBet > this.otherPlayer().chipstack) totalBet = this.otherPlayer().chipstack - isSb;
    return totalBet;
  }

  calcCompBetRaise(compBetRaise, isSb){
    let totalBet;
    if (compBetRaise > this.currentPlayer().chipstack) {
      totalBet = this.currentPlayer().chipstack - isSb;
    } else if (compBetRaise > this.otherPlayer().chipstack) {
      totalBet = this.otherPlayer().chipstack - isSb
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
  
  continueAction(){
    this.currBet = this.handChipDiff();
    this.toggleCurrPlayer();
    this.render();
    this.nextAction();
  }

  nextAction(){
    let handChipsEqual = this.handChipDiff() === 0;
    let multipleActions = this.streetActions.length > 1;
    if (this.streetActions[this.streetActions - 1] === 'fold') {
      this.determineWinner();
    } else if (handChipsEqual) {
      if (this.allIn()) {
        this.showDown();
        this.determineWinner();
      } else if (this.currStreet === 'river' && multipleActions) {
        this.determineWinner();
      } else if (multipleActions) {
        this.nextStreet();
      }
    }
  }

  showDown(){
    while (this.boardCards.length < 5) {
      this.dealCard();
      this.showBoard();
    }
  }

  stepStreet(flopBool){
    (flopBool) ? this.dealFlop() : this.dealCard();
    this.showBoard();
    if (!this.allIn()) this.render();
  }
  
  nextStreet(){
    this.streetActions = [];
    this.currBet = 0;
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

  bindEvents() {
    this.$el.unbind();
    this.$el.on("click", "button", (event => {
      const $button = $(event.currentTarget);
      this.action($button);
    }));
  }
}

export default Table;