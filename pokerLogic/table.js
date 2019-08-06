class Table {
  constructor(players, sb = 50, bb = 100){
    this.boardCards = [];
    this.deck = new Deck;
    this.players = players;
    this.sb = sb;
    this.bb = bb;
    this.pot = 0;
    this.currPlayer = players[0];
  }

  playHand(){

  }

  // dealInPlayers(){
  //   this.players[0]
  // }

  dealCard(){
    this.boardCards.push(this.deck.draw());
  }

  remainingPlayers(){
    if (players[0])
    
    return true;
  }
}