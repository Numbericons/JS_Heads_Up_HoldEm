const Hand = require('pokersolver').Hand;
//Account for length of board cards
export default class PostFlop {
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
      return 2;
    } else if (this.nPair(3)) {
      return 3;
    } else if (this.nPair(4) || this.nPair(5)) {
      return 4;
    } else {
      return 5;
    }
  }

  getTeir(hand, boardCards) {
    this.defineHand(hand,boardCards);
    let pairVal = this.pairTeir();
    if (pairVal > 5) return 'Teir' + pairVal;
    return (this.beatsBoard()) ? 'Teir3' : 'Teir4';
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

  trips(){}

  rainbow() { }
  twoFlush() { };
  threeFlush() { };
  fourFlush() { };
  fiveFlush() { };

  quadsPlus(){}
}