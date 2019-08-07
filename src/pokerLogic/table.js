import Deck from "./deck.js";
const Hand = require('pokersolver').Hand;

class Table {
  constructor(players, sb = 50, bb = 100){
    this.boardCards = [];
    this.deck = new Deck;
    this.players = players;
    this.sb = sb;
    this.bb = bb;
    this.pot = 0;
    this.currPlayerPos = 0;
  }

  resetVars(){
    this.boardCards = [];
    this.pot = 0;
    this.currPlayerPos = 0;
  }

  playHand(){
    this.dealInPlayers();
    this.takeBlinds();
    this.bettingRound(this.sb);
    if (this.remainingPlayers()) {
      console.log("*******-FLOP-*******");
      this.dealFlop();
      this.showBoard();
      if (!this.allIn()) this.bettingRound();
    }
    if (this.remainingPlayers()) {
      console.log("*******-TURN-*******");
      this.dealTurn();
      this.showBoard();
      if (!this.allIn()) this.bettingRound();
    }
    if (this.remainingPlayers()) {
      console.log("*******-RIVER-*******");
      this.dealRiver();
      this.showBoard();
      if (!this.allIn()) this.bettingRound();
    }
    this.determineWinner();
  }

  anyFolds(){
    if (!this.players[0].folded && !this.players[1].folded) {
      return false;
    } else {
      return true;
    }
  }

  determineWinner(){
    var hand1 = Hand.solve(this.players[0].hand.concat(this.boardCards));
    var hand2 = Hand.solve(this.players[1].hand.concat(this.boardCards));
    (this.boardCards.length > 0) ? console.log(`On a board of ${this.boardCards}, `) : console.log(`Preflop, `);
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
    console.log(`the hand resulted in a tie. Splitting the pot of ${this.pot} with ${hand.descr}!`)
    this.players[0].chipstack += Math.floor(this.pot / 2);
    this.players[1].chipstack += Math.floor(this.pot / 2);
    if (!this.pot % 2 === 0) {
      if (Math.random() < .5) {
        this.players[0].chipstack += 1;
      } else {
        this.players[1].chipstack += 1;
      }
    }
    return [2];
  }

  winner(winHand, loseHand, winPos,losePos){
    console.log(`${this.players[winPos].name} wins the pot of ${this.pot}`)
    if (!this.players[losePos].folded) console.log(` with hand: ${winHand.descr}`)
    if (!this.players[losePos].chipstack === 0) console.log(`${this.players[losePos].name} lost with with hand: ${loseHand.descr}`)
    this.players[winPos].chipstack += this.pot;
    return [winPos];
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
    this.boardCards.push(this.deck.draw());
  }

  dealFlop(){
    this.currPlayerPos = 1;
    for(let i=0;i<3;i++){
      this.dealCard();
    }
  }

  dealTurn(){
    this.currPlayerPos = 1;
    this.dealCard();
  }

  dealRiver(){
    this.currPlayerPos = 1;
    this.dealCard();
  }

  showBoard(){
    console.log("The board is: ");
    this.boardCards.forEach(card => {
      console.log(card);
    })
  }

  bettingRound(ifSB = 0){
    this.showPot();
    const firstBet = this.pAction(ifSB, ifSB);
    if (firstBet === null) {
      return this.pot;
    }
    this.pot += firstBet[0];
    this.toggleCurrPlayer();
    this.showPot();
    const prevBet = this.pAction(firstBet[0] - ifSB);
    if (prevBet === null) {
      return this.pot;
    }
    this.pot += prevBet[0];
    if (prevBet[1] === 'raise' && ifSB > 0) {
      this.pot += firstBet[0];
    }
    this.resolveAddBets(prevBet);
    return this.pot;
  }

  resolveAddBets(prevBet){
    if (prevBet[1].startsWith('ra')) {
      this.pot += prevBet[0];
    }
    while (!this.players[0].chipsInPot === this.players[0].chipsInPot) {
      this.showPot();
      this.toggleCurrPlayer();
      const bet = this.pAction(prevBet[0]);
      if (bet[1].startsWith('ra')) {
        this.pot += prevBet[0];
      }
      if (bet) {
        this.pot += bet[0];
      }
    }
  }

  showPot(){
    console.log(this.pot);
  }

  pAction(bet = 0, sb = 0){
    const toCall = this.players[this.currPlayerPos].action(bet,this.bb);
   
    if (!toCall) this.players[this.currPlayerPos].folded = true;
    return toCall
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
}

export default Table;