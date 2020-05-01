const Hand = require('pokersolver').Hand;
//Account for length of board cards
export default class PostFlop {
  constructor() {
    // this.cards = boardCards;
    // this.cardsV2 = Hand.solve(this.cards);
    this.value = 0;
  }

  handVal() {
    let handArr = [`${this.hand[0].rank}${this.hand[0].suit}`, `${this.hand[1].rank}${this.hand[1].suit}`];
    for(let i = 0, len = this.boardCards.length; i<len; i++){
      handArr.push(`${this.boardCards[i].rank}${this.boardCards[i].suit}`)
    }
    return Hand.solve(handArr);
  }

  convertVal(rank) {
    if (parseInt(rank)) return parseInt(rank);
    switch (rank) {
      case "T":
        return 10;
      case "J":
        return 11;
      case "Q":
        return 12;
      case "K":
        return 13;
      case "A":
        return 14;
    }
  }

  defineHand(hand, boardCards) {
    this.hand = hand;
    this.boardCards = boardCards;
    this.boardSolved = Hand.solve(boardCards);
    this.handSolved = this.handVal();
  }

  pairMinus(){
    if (this.nPair(1)) {
      return 1;
    } else if (this.nPair(2)) {
      return .25;
    } else if (this.nPair(3)) {
      return .15;
    } else if (this.nPair(4) || this.nPair(5)) {
      return .1;
    } else {
      return .05;
    }
  }

  getTeir(hand, boardCards) {
    this.defineHand(hand,boardCards);
    const kicker = this.kicker();
    const beatsBoard = this.beatsBoard();
    debugger;
    if (this.handSolved.rank > 5) return this.fHousePlus(kicker);
    if (this.handSolved.rank === 5) return this.flush(kicker);
    if (this.handSolved.rank === 4) return this.straight(kicker);
    if (this.handSolved.rank === 3) return this.trips(kicker);
    const val = this.pairMinus();
    return beatsBoard ? val + .05 : val;
  }

  beatsBoard(){
    let wonArr = Hand.winners([this.handSolved, this.boardSolved]);
    return (wonArr.length === 1 && wonArr[0] === this.handSolved);
  };

  numCardsUsed(){};
  kicker(){}

  nCard(num){
    let top = num - 1;
    for(let i = 0, len = this.boardCards.length; i < len; i++) {
      let val = this.convertVal(this.boardCards[i].rank);
      if(val > top) top = val;
    }
    return top;
  }

  nPair(num){
    let nTop = this.nCard(num);
    return (this.convertVal(this.hand[0].rank) === nTop || this.convertVal(this.hand[1].rank) === nTop);
  };

  secondPair(){};
  thirdPair(){};
  forthPair(){};
  bottomPair(){};

  loLoHigh(){};
  paired(){};
  twoPair(){};

  twoStraight(){};
  threeStraight(){};
  fourStraight(){};
  fiveStraight(){};
  gapThreeStraight(){}
  gapFourStraight(){}

  trips(){
    debugger
  }

  rainbow() { }
  twoFlush() { };
  threeFlush() { };
  fourFlush() { };
  fiveFlush() { };

  house(beatsBoard) {
    if (this.boardSolved.rank === 6) {
      if (beatsBoard) return 1;
    } 
  }

  quads(kicker){

  }

  fHousePlus(kicker,){
    if (this.handSolved.rank > 7) return 1;
    const quads = this.quads(kicker);
    if (quads) return quads;
    return this.house(beatsBoard);
  }
}

//first define things like if the board is a certain hand based on the rank of the board cards
//  also check if board is 3 to a suit, 3 to a straight etc.

//second step is to check for best hands on down for return value
//  straight flush plus returns Infinity

//Ideas:
//slowplay a certain % 
//  flop only?
//never fold option but no bets/raises
//  Get teir function returns an array of 2 elements
//    first is the number used for calculations
//    second is one of: foldChk, callChk, betRaise

//Kicker function
//  calc nut kicker
//  doesnt bluff if it's kicker is the board and it doesnt have a quad card in hand 

//Full house, doesnt bluff is full house on board, if board is a house and hand beats board, return infinity