const Hand = require('pokersolver').Hand;
//Account for length of board cards
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
    if (this.handSolved.rank === 5) return this.flush(texture, handArr);
    if (this.handSolved.rank === 4) return this.straight(texture, handArr);
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
    let wonArr = Hand.winners([this.handSolved, this.boardSolved]);
    return (wonArr.length === 1 && wonArr[0] === this.handSolved);
  };

  chkCard(card, idx) {
    return card.suit === this.hand[idx] && card.value === this.hand[idx].rank;
  }

  cardsUsed(){
    let used = 0;
    this.handSolved.cards.forEach(card => {
      if (chkCard(card,0)) used += 1;
      if (chkCard(card,1)) used += 1;
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
  twoPair(){};

  twoStraight(){};
  threeStraight(){};
  fourStraight(){};
  fiveStraight(){};
  gapThreeStraight(){}
  gapFourStraight(){}

  trips(){
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
    const cards = player ? this.handSolved.suits : this.boardSolved.suits;
    const keys = player ? Object.keys(cards) : Object.keys(cards);

    for (let s = 0; s < keys.length; s++) {
      const suitCnt = cards[keys[s]].length;
      if (suitCnt > fCards) {
        fCards = suitCnt;
        suit = keys[s];
      }
    }
    return [fCards, suit];
  }

  flush(texture, handAttr) {
    const pFlush = this.flushCards(true);
    // if (hCards === 2) 
    //num cards used, if beats board and using both cards and board isnt paired+ return [1,'agg']
  }
}