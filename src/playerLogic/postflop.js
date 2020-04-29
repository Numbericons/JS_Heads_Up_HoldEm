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

  pairTeir(){
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
    if (this.handSolved.rank > 7) return Infinity;
    debugger;
    let pairVal = this.pairTeir();
    // if (pairVal > 5) return 'Teir' + pairVal;
    if (this.trips()) return 
    return (this.beatsBoard()) ? pairVal + .05 : pairVal;
  }

  beatsBoard(){
    let wonArr = Hand.winners([this.handSolved, this.boardSolved]);
    return (wonArr.length === 1 && wonArr[0] === this.handSolved);
  };

  numCardsUsed(){};
  kicker(){}
  //calc nut kicker

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

  quadsPlus(){}
}

//first define things like if the board is a certain hand based on the rank of the board cards
//  also check if board is 3 to a suit, 3 to a straight etc.

//second step is to check for best hands on down for return value
//  straight flush plus returns Infinity

//Ideas:
//slowplay a certain % 
//  flop only?