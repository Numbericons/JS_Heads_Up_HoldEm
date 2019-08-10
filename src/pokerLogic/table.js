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
    this.minBet = this.bb;

    this.bindEvents = this.bindEvents.bind(this);
  }

  resetVars(){
    this.deck = new Deck;
    this.boardCards = [];
    this.pot = 0;
    this.currPlayerPos = 0;
    this.currBet = this.sb;
    this.streetActions = [];
    this.currStreet = 'preflop';
    this.minBet = this.bb;
  }

  resetPlayerVars() {
    this.players[0].folded = false;
    this.players[0].chipsInPot = 0;
    this.players[0].hand = [];
    this.players[1].folded = false;
    this.players[1].chipsInPot = 0;
    this.players[1].hand = [];
  }

  playHand(){
    this.dealInPlayers();
    this.takeBlinds();
    this.render();
  }

  anyFolds(){
    if (!this.players[0].folded && !this.players[1].folded) {
      return false;
    } else {
      return true;
    }
  }

  togglePlayers() {
    this.players.push(this.players.shift());
    this.players[0].position = 'sb';
    this.players[1].position = 'bb';
  }


  determineWinner(){
    var hand1 = Hand.solve(this.players[0].hand.concat(this.boardCards));
    var hand2 = Hand.solve(this.players[1].hand.concat(this.boardCards));
    this.outputString = (this.boardCards.length > 0) ? `On a board of ${this.boardCards}, `: `Preflop, `
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
    alert(this.outputString + `the hand resulted in a tie. Splitting the pot of ${this.pot} with ${hand.descr}!`)
    this.players[0].chipstack += Math.floor(this.pot / 2);
    this.players[1].chipstack += Math.floor(this.pot / 2);
    if (!this.pot % 2 === 0) {
      if (Math.random() < .5) {
        this.players[0].chipstack += 1;
      } else {
        this.players[1].chipstack += 1;
      }
    }
    this.handOver();
  }

  winner(winHand, loseHand, winPos,losePos){
    this.outputString += `${this.players[winPos].name} wins the pot of ${this.pot}`;
    if (!this.players[losePos].folded) this.outputString += ` with hand: ${winHand.descr}`;
    if (!this.players[losePos].chipstack === 0) this.outputString += `${this.players[losePos].name} lost with with hand: ${loseHand.descr}`;
    alert(this.outputString);
    this.players[winPos].chipstack += this.pot;
    this.handOver();
  }

  handOver(){
    if (this.players[0].chipstack === 0) {
      alert(`${this.players[1].name} has won the match!`);
    } else if (this.players[1].chipstack === 0) {
      alert(`${this.players[1].name} has won the match!`);
    } else {
      this.nextHand();
    }
  }

  nextHand(){
    this.togglePlayers();
    this.resetPlayerVars();
    this.resetVars();
    this.playHand();
  }

  handToStr(player){
    let playerHand = player.hand.join(" ");
    return playerHand;
  }

  dealInPlayers(){
    this.players[1].hand.push(this.deck.draw());
    this.players[0].hand.push(this.deck.draw());
    this.players[1].hand.push(this.deck.draw());
    this.players[0].hand.push(this.deck.draw());
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

  showBoard(){
    let currPot = document.querySelector(`.table-felt-board`);
    currPot.innerText = `${this.boardCards}`;
  }

  // resolveAddBets(minBet){
  //   if (minBet[1].startsWith('ra')) {
  //     this.pot += minBet[0];
  //   }
  //   while (!this.players[0].chipsInPot === this.players[0].chipsInPot) {
  //     this.render();
  //     this.toggleCurrPlayer();
  //     const bet = this.action(minBet[0]);
  //     if (bet[1].startsWith('ra')) {
  //       this.pot += minBet[0];
  //     }
  //     if (bet) {
  //       this.pot += bet[0];
  //     }
  //   }
  // }

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
    currPot.innerText = `Current pot: ${this.pot}`;
  }

  render(){
    this.showPot();
    this.showBoard();
    this.players[0].render();
    this.players[1].render();
    this.players[this.currPlayerPos].promptAction(this.currBet);
    this.setButtons();
    this.bindEvents();
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
    let $betAmtDiv = $("<input/>", {
      type: 'text',
      class: 'actions-cont-bet-amt',
      // placeholder: `${this.minBet}`,
      value: `${this.minBet}`
    })
    // $betAmtDiv.addClass("actions-cont-text");
    $betAmtDiv.data("action", "fold");
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
    if (!this.allIn()) {
      this.betOrRaise($outDiv);
    }
    this.betAmount($outDiv);

    this.$el.empty();
    this.$el.append($outDiv);
  }

  // determineCurrBet(action, amount){
  //   this.currBet = (action === 'raise' || action === 'bet') ? amount : 0;
  //   if (this.currStreet === 'preflop' && this.streetActions.length === 1){
  //     if (action === 'call') this.currBet = 0;
  //   } 
  // }

  renderCurrBet(action, amount){
    this.currBet = (action === 'raise' || action === 'bet') ? amount : 0;
    if (this.currStreet === 'preflop' && this.streetActions.length === 1){
      if (action === 'call') this.currBet = 0;
    } 
  }

  action($button) {
    let playerAction = $button.data().action;
    if (playerAction === 'fold') {
      this.players[this.currPlayerPos].folded = true;
      return this.determineWinner();
    }
    this.streetActions = this.streetActions.concat(playerAction);
    this.determineCurrBet(action, amount)
    // let isSb = (this.currStreet === 'preflop' && this.streetActions.length === 2) ? this.sb : 0;
    let resolvedAction = this.players[this.currPlayerPos].resolve_action(this.currBet, playerAction); //, isSb
    if (resolvedAction) {
      this.pot += resolvedAction
    }
    this.toggleCurrPlayer();
    this.renderCurrBet(this.streetActions[this.streetActions.length - 1], resolvedAction);
    this.render();
    this.nextAction();
  }

  nextAction(){
    let lastAction = this.streetActions[this.streetActions.length - 1];
    let multipleActions = this.streetActions.length > 1;
    if (this.streetActions[this.streetActions - 1] === 'fold') {
      this.determineWinner();
    } else if (this.allIn() && lastAction === 'call') {
      this.showDown();
      this.determineWinner();
    } else if (this.currStreet === 'river' && multipleActions && (lastAction === 'call' || lastAction === 'check')) {
      this.determineWinner();
    } else if (multipleActions && (lastAction === 'call' || lastAction === 'check')) {
      this.nextStreet();
    }
  }

  showDown() {
    while (this.boardCards.length < 5) {
      this.dealCard();
    }
  }
  
  nextStreet(){
    this.streetActions = [];
    this.currBet = 0;
    this.minBet = this.bb;
    if (this.currStreet === 'preflop') {
      this.currStreet = 'flop';
      this.dealFlop();
      this.showBoard();
      if (!this.allIn()) this.render();
    } else if (this.currStreet === 'flop') {
      this.currStreet = 'turn';
      this.dealCard();
      this.showBoard();
      if (!this.allIn()) this.render();
    } else if (this.currStreet === 'turn') {
      this.currStreet = 'river';
      this.dealCard();
      this.showBoard();
      if (!this.allIn()) this.render();
    }
  }

  setCurrBet($input){
    $input;
  }

  bindEvents() {
    this.$el.unbind();
    this.$el.on("click", "button", (event => {
      const $button = $(event.currentTarget);
      this.action($button);
    }));
    this.$el.on("click", "input", (event => {
      const $input = $(event.currentTarget);
      this.setCurrBet($input);
    }));
  }
}

export default Table;