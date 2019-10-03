const Hand = require('pokersolver').Hand;

export default class PostFlop {
  constructor() {
    // this.cards = boardCards;
    // debugger;
    // this.cardsV2 = Hand.solve(this.cards);
  }

  getTeir(cards) {
    this.cards = cards;
    return 'Teir3';
  }

  beatBoard(hand, board){};
  numCardsUsed(){};
  kicker(){};

  topPair(hand, board){};
  midPair(hand, board){};
  secondPair(hand, board){};
  thirdPair(hand, board){};
  forthPair(hand, board){};
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