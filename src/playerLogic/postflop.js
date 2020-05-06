const Hand = require('pokersolver').Hand;
export default class PostFlop {
  constructor() {
    this.value = 0;
  }

  handVal() {
    let handArr = [`${this.hand[0].rank}${this.hand[0].suit}`, `${this.hand[1].rank}${this.hand[1].suit}`];
    for(let i = 0, len = this.boardCards.length; i<len; i++){
      handArr.push(`${this.boardCards[i].rank}${this.boardCards[i].suit}`)
    }
    return Hand.solve(handArr);
  }

  boardVal() {
    let cardArr = [];
    for (let i = 0; i < this.boardCards.length; i++) {
      cardArr.push(`${this.boardCards[i].rank}${this.boardCards[i].suit}`)
    }
    return Hand.solve(cardArr);
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

  getTeir(hand, boardCards) {
    this.defineHand(hand, boardCards);
    const texture = this.texture();
    const handAttr = this.handAttr();
    debugger
    if (this.handSolved.rank > 5) return this.fHousePlus(texture, handAttr);
    return this.flushMinus(texture, handAttr);
  }

  defineHand(hand, boardCards) {
    this.hand = hand;
    this.boardCards = boardCards;
    this.boardSolved = this.boardVal();
    this.handSolved = this.handVal();
  }

  texture(){
    let texture = {};
    texture['pair'] = this.boardSolved.rank === 2;
    texture['twoPair'] = this.boardSolved.rank === 3;
    texture['trips'] = this.boardSolved.rank === 4;
    texture['fCards'] = this.flushCards(true);
    return texture;
  }

  handAttr() {
    let handAttr = {};
    handAttr['kicker'] = this.kicker();
    handAttr['beatsBoard'] = this.beatsBoard();
    handAttr['cardsUsed'] = this.cardsUsed();
    return handAttr;
  }

  flushMinus(texture, handArr){
    if (this.handSolved.rank === 6) return this.flush(texture, handArr);
    if (this.handSolved.rank === 5) return this.straight(texture, handArr);
    if (this.handSolved.rank === 4) return this.twoPair(texture, handArr);
    if (this.handSolved.rank === 3) return this.trips(texture, handArr);
    return this.pairMinus(texture, handArr);
  }

  pairMinus(texture, handAttr){
    let val = handAttr['beatsBoard'] ? .05 : 0;
    if (this.nPair(1)) {
      val += 1;
    } else if (this.nPair(2)) {
      val += .25;
    } else if (this.nPair(3)) {
      val += .15;
    } else if (this.nPair(4) || this.nPair(5)) {
      val += .1;
    } else {
      val += .05;
    }
    return [val];
  }

  beatsBoard(){
    if (this.handSolved.rank > this.boardSolved.rank) return true;
    if (this.boardSolved.cards.length < 5) return false;
    let wonArr = Hand.winners([this.handSolved, this.boardSolved]);
    return (wonArr.length === 1 && wonArr[0] === this.handSolved);
  };

  bPairedPlus(texture){
    return texture['pair'] || texture['twoPair'] || texture['trips'];
  }

  chkCard(card, idx) {
    return card.suit === this.hand[idx] && card.value === this.hand[idx].rank;
  }

  cardsUsed(){
    let used = 0;
    this.handSolved.cards.forEach(card => {
      if (this.chkCard(card,0)) used += 1;
      if (this.chkCard(card,1)) used += 1;
    })
    return used;
  };

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

  twoPair(texture, handAttr){
    return handAttr['beatsBoard'] ? [.5] : [.35, 'call'];
  };
  
  straight(texture, handAttr) {
    return handAttr['beatsBoard'] ? [.7] : [.55, 'call'];
  }
  
  twoStraight(){};
  threeStraight(){};
  fourStraight(){};
  fiveStraight(){};
  gapThreeStraight(){}
  gapFourStraight(){}

  trips(texture, handAttr){
    return handAttr['beatsBoard'] ? [.7] : [.45, 'call'];
  }

  quads(texture, handAttr) {
    return handAttr['beatsBoard'] ? [1, 'agg'] : [.5, 'call'];
  }

  house(texture, handAttr) {
    if (this.boardSolved.rank === 6) return handAttr['beatsBoard'] ? [1,'agg'] : [.5,'call'];
  }

  fHousePlus(texture, handAttr){
    if (this.handSolved.rank > 7) return [1,'agg'];
    const quads = this.quads(texture, handAttr);
    if (quads) return quads;
    return this.house(texture, handAttr);
  }

  flushCards(player) {
    let fCards = 1;
    let suit = "";
    let kicker = "";
    const cards = player ? this.handSolved.suits : this.boardSolved.suits;
    const keys = player ? Object.keys(cards) : Object.keys(cards);

    for (let s = 0; s < keys.length; s++) {
      let suitCnt = cards[keys[s]].length;
      if (suitCnt > fCards) {
        fCards = suitCnt;
        suit = keys[s];
      }
    }
    return [fCards, suit];
  }

  flushKicker(suit) {
    const higher = this.convertVal(this.hand[0].rank) > this.convertVal(this.hand[1].rank) ? this.hand[0] : this.hand[1];
    return higher.suit === suit ? higher.rank : null;
  }

  flushDraw() {
    const fCards = this.flushCards(true)[0];
    return {
      'fourFlush': this.boardCards.length < 5 && fCards === 4,
      'threeFlush': this.boardCards.length === 3 && fCards === 3,
      'suitCard': this.flushKicker(fCards[1])
    }
  }

  flush(texture, handAttr) {
    if (this.bPairedPlus()) {
      if (handAttr['cardsUsed'] === 2) return [.5];
    } else {
      if (handAttr['cardsUsed'] === 2) return [1,'agg'];
      return [.25]
    }
  }
}

//account flush/straight draws