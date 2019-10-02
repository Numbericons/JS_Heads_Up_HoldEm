const Hand = require('pokersolver').Hand;

export default class PostFlop {
  constructor(boardCards) {
    this.cards = boardCards;
    debugger;
    this.cardsV2 = Hand.solve(this.cards);
  }

  getTeir(cards) {
    this.cards = cards;
    return 'Teir3';
  }


  topPair(hand){}

  numCardsUsed(){}

  loLoHigh(){};
  paired(){};
  twoPair(){};

  twoStraight(){};
  threeStraight(){};
  fourStraight(){};
  fiveStraight(){};
  gapTwoStraight(){}

  trips(){}

  rainbow() { }
  twoFlush() { };
  threeFlush() { };
  fourFlush() { };
  fiveFlush() { };

  quadsPlus(){}

}