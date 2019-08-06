// import Deck from "./deck.js";

export default class Table {
  constructor(players, sb = 50, bb = 100){
    this.boardCards = [];
    this.deck = new Deck;
    this.players = players;
    this.sb = sb;
    this.bb = bb;
    this.pot = 0;
    this.currPlayerPos = 0;
  }

  playHand(){
    this.dealInPlayers();
    this.takeBlinds();
    this.bettingRound(sb);
    if (this.remainingPlayers()) {
      console.log("*******-FLOP-*******");
      this.dealFlop();
      this.showBoard();
      this.bettingRound();
    }
    if (this.remainingPlayers()) {
      console.log("*******-TURN-*******");
      this.dealTurn();
      this.showBoard();
      this.bettingRound();
    }
    if (this.remainingPlayers()) {
      console.log("*******-RIVER-*******");
      this.dealRiver();
      this.showBoard();
      this.bettingRound();
    }
    this.determineWinner();
  }

  determineWinner(){
    // if (this.players[1].folded || ) {
    //   console.log(`Player in seat 1 wins the pot of ${this.pot}`)
    //   this.players[0].chipstack += this.pot;
    //   return [1];
    // } else if (this.players[0].folded || ) {
    //   console.log(`Player in seat 1 wins the pot of ${this.pot}`)
    //   this.players[1].chipstack += this.pot;
    //   return [0];
    // } else {
    //   console.log(`This hand resulted in a tie. Splitting the pot of ${self.pot}!`)
    //   this.players[0].chipstack = this.players[0].chipstack + Math.floor(this.pot / 2);
    //   this.players[1].chipstack = this.players[1].chipstack + Math.floor(this.pot / 2);
    //   if (!this.pot % 2 === 0) {
    //     if (Math.random() < .5) {
    //       this.players[0].chipstack = this.players[0].chipstack + 1;
    //     } else {
    //       this.players[1].chipstack = this.players[1].chipstack + 1;
    //     } 
    //     return [2];
    //   }
    // }
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
    this.players[0].chipstack = this.players[0].chipstack - this.sb;
    this.players[0].chipsInPot = this.players[0].chipsInPot + this.sb;
    this.players[1].chipstack = this.players[0].chipstack - this.sb;
    this.players[1].chipsInPot = this.players[1].chipsInPot + this.sb;
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
    console.log("clear");
    this.showPot();
    const firstBet = this.pAction(ifSB, ifSB);
    if (firstBet < 0 ) {
      return this.pot;
    }
    this.pot = this.pot + firstBet[0];
    this.toggleCurrPlayer();
    console.log("clear");
    this.showPot();
    const prevBet = this.pAction(firstBet[0] - ifSB);
    if (prevBet < 0) {
      return this.pot;
    }
    this.pot = this.pot + prevBet[0];
    if (prevBet[1] === 'raise' && ifSB > 0) {
      this.pot = this.pot + firstBet[0];
    }
    this.resolveAddBets(prevBet);
    return this.pot;
  }

  resolveAddBets(prevBet){
    if (prevBet[1].startsWith('ra')) {
      this.pot = this.pot + prevBet[0];
    }
    while (!this.players[0].chipsInPot === this.players[0].chipsInPot) {
      console.log('clear');
      this.showPot();
      this.toggleCurrPlayer();
      const bet = this.pAction(prevBet[0]);
      if (bet[1].startsWith('ra')) {
        this.pot = this.pot + prevBet[0];
      }
      if (bet) {
        this.pot = this.pot + bet[0];
      }
    }
  }

  showPot(){
    console.log(this.pot);
  }

  pAction(bet = 0, sb = 0){
    toCall = this.players[this.currPlayerPos].action(bet,bb);
   
    if (!toCall) this.players[this.currPlayerPos].folded = true;
    return toCall
  }

  toggleCurrPlayer(){
    if (this.currPlayer === this.players[0]){
      this.currPlayer = this.players[1];
    } else  {
      this.currPlayer = this.players[0];
    }
  }

  remainingPlayers() {
    if (players[0].chipstack === 0 || players[1].chipstack === 0) return false;
    if (players[0].folded === true || players[1].folded === true) return false;

    return true;
  }
}