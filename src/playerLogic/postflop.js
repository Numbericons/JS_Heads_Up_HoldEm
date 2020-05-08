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
    if (this.handSolved.rank > 6) return this.fHousePlus(texture, handAttr);
    return this.flushMinus(texture, handAttr);
  }

  defineHand(hand, boardCards) {
    this.hand = hand;
    this.boardCards = boardCards;
    this.boardSolved = this.boardVal();
    this.handSolved = this.handVal();
  }

  texture(){
    return {
      fCards: this.flushCards(true),
      fCards: this.flushCards(true),
      straight: this.straightTexture(),
      pair: this.boardSolved.rank === 2,
      twoPair: this.boardSolved.rank === 3,
      trips: this.boardSolved.rank === 4,

    }
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
    if (this.handSolved.rank === 4) return this.trips(texture, handArr);
    if (this.handSolved.rank === 3) return this.twoPair(texture, handArr);
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

  fHousePlus(texture, handAttr) {
    if (this.handSolved.rank > 7) return [1, 'agg'];
    const quads = this.quads(texture, handAttr);
    if (quads) return quads;
    return this.house(texture, handAttr);
  }

  // secondPair(){};
  // thirdPair(){};
  // forthPair(){};
  // bottomPair(){};

  // loLoHigh(){};

  // twoStraight(){};
  // threeStraight(){};
  // fiveStraight(){};
  // gapThreeStraight(){}
  // gapFourStraight(){}

  quads(texture, handAttr) {
    return handAttr['beatsBoard'] ? [1, 'agg'] : [.5, 'call'];
  }

  house(texture, handAttr) {
    if (this.boardSolved.rank === 6) return handAttr['beatsBoard'] ? [1,'agg'] : [.5,'call'];
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

  gaps(cards) {
    const ranks = cards.map(card => (card.rank+1));
    let gaps = [];
    for (let z=0; z< ranks.length;z++) {
      if (z === ranks.length - 1) {
        gaps.push([1,ranks[z]]);
        break;
      }
      const gap = ranks[z] - ranks[z + 1];
      if (gap > 0) gaps.push([gap,ranks[z]]);
    }
    return gaps;
  }

  straightDraw() {

  }

  sumGaps(gaps,idx,cnt){
    if (!gaps[idx+1+cnt]) return null;
    return gaps.slice(idx, idx+cnt).reduce((acc,gap)=> (acc + gap));
  }

  straightTexture() {
    const gaps = this.gaps(this.boardSolved.cards);
    const strTexture = { gutters: 0, threeStr: false,
                         openEnd: false, smThreeStr: false
                        }
    for (let g=0; g<gaps.length-2;g++) { //[1, 6, 3, 1], 0, 2  arguments to sumGaps
      let firstRank = gaps[g][1];
      if (this.sumGaps(gaps,g,2) === 3) { //4 straight
        if (firstRank === 14) {
          strTexture['gutters'] = strTexture['gutters'] ? strTexture['gutters'] + 1 : 1;
        } else {
          strTexture['openEnd'] = true;
        }
      } 
      if (this.sumGaps(gaps,g,2) === 4) strTexture['gutters'] = strTexture['gutters'] ? strTexture['gutters'] + 1 : 1;
      if (!firstRank === 14 && this.sumGaps(gaps, g, 1) === 2) firstRank === 13 || firstRank === 2 ? strTexture['smThreeStr'] = true : strTexture['threeStr'] = true;
    }
    return strTexture;
  }

  straight(texture, handAttr) {
    if (texture['fCards'] === 3 || bPairedPlus(texture)) return handAttr['beatsBoard'] ? [.50] : [.25, 'call'];
    return handAttr['beatsBoard'] ? [.75] : [.55, 'call'];
  }

  trips(texture, handAttr) {
    return handAttr['beatsBoard'] ? [.7] : [.45, 'call'];
  }

  twoPair(texture, handAttr) {
    return handAttr['beatsBoard'] ? [.5] : [.35, 'call'];
  };
}