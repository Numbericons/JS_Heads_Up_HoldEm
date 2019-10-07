const Hand = require('pokersolver').Hand;
//Account for length of board cards
export default class PostFlop {
  constructor() {
    // this.cards = boardCards;
    // this.cardsV2 = Hand.solve(this.cards);
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

  getTeir(hand, boardCards) {
    this.defineHand(hand,boardCards);
    if(this.topPair()) return 'Teir2';
    return (this.beatsBoard()) ? 'Teir3' : 'Teir4';
  }

  beatsBoard(){
    let wonArr = Hand.winners([this.handSolved, this.boardSolved]);
    return (wonArr.length === 1 && wonArr[0] === this.handSolved);
  };
  numCardsUsed(){};
  kicker(){};

  topCard(){
    let top = 0;
    for(let i = 0, len = this.boardCards.length; i < len; i++) {
      let val = this.convertVal(this.boardCards[i].rank);
      if(val > top) top = val;
    }
    return top;
  }
  topPair(){
    let top = this.topCard();
    return (this.convertVal(this.hand[0].rank) === top || this.convertVal(this.hand[1].rank) === top) ? true : false;
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

  trips(){}

  rainbow() { }
  twoFlush() { };
  threeFlush() { };
  fourFlush() { };
  fiveFlush() { };

  quadsPlus(){}
}