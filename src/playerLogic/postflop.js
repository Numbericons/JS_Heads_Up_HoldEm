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
    let textObj = {
      fCards: this.flushCards(false),
      straight: this.straightTexture(this.boardSolved.cards),
      pair: this.boardSolved.rank === 2,
      twoPair: this.boardSolved.rank === 3,
      trips: this.boardSolved.rank === 4,
    }
    textObj['lowHigh'] = this.lowHigh(textObj);
    return textObj;
  }
  
  handAttr() {
    return {
      kicker: this.kicker(),
      fCards: this.flushCards(true),
      straight: this.straightTexture(this.handSolved.cards),
      beatsBoard: this.beatsBoard(),
      cardsUsed: this.cardsUsed(),
    }
  }

  flushMinus(texture, handArr){
    if (this.handSolved.rank === 6) return this.flush(texture, handArr);

    const flushCards = handArr['fcards'];
    let val;
    if (this.handSolved.rank === 5) {
      val = this.straight(texture, handArr);
      val *= 2;
    } else if (this.handSolved.rank === 4 || this.handSolved.rank === 3) {
      val = this.handSolved.rank === 4 ? this.trips(texture,handArr) : this.twoPair(texture, handArr);
      val *= 1.25;
    } else {
      val = this.pairMinus(texture, handArr);
      val = val * 1.5 + .5
    }
    return val;
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

  kicker(){  }

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

  quads(texture, handAttr) {
    return handAttr['beatsBoard'] ? [1, 'agg'] : [.5, 'call'];
  }

  house(texture, handAttr) {
    if (this.boardSolved.rank === 6) return handAttr['beatsBoard'] ? [1,'agg'] : [.5,'call'];
  }

  flushCards(player) {
    let fCards = 1;
    let suit = "";
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
    if (this.bPairedPlus(texture)) {
      if (handAttr['cardsUsed'] === 2) return [.5];
    } else {
      if (handAttr['cardsUsed'] === 2) return [1,'agg'];
      return [.25]
    }
  }

  gaps(cards) {
    const ranks = cards.map(card => (card.rank+1)).sort((a,b) => (b - a));
    let gaps = [];
    for (let z=0; z< ranks.length;z++) {
      if (z === ranks.length - 1) {
        ranks[0] === 14 ? gaps.push([ranks[z] - 1,ranks[z]], [1,1]) : gaps.push([1,ranks[z]]); //when including ace
        break;
      }
      let gap = ranks[z] - ranks[z+1];
      if (gap > 0) gaps.push([gap,ranks[z]]);
    }
    return gaps;
  }

  sumGaps(gaps,idx,cnt){
    if (!gaps[idx+cnt]) return null;
    return gaps.slice(idx, idx+cnt).map(gap=> (gap[0])).reduce((acc,gap)=> (acc + gap));
  }

  fourCardStr(gaps, strTexture, firstRank, idx){
    const sum = this.sumGaps(gaps, idx, 3);
    if (sum === 3) {
      if (firstRank === 14) {
        strTexture['gutters'] = strTexture['gutters'] ? strTexture['gutters'] + 1 : 1;
      } else {
        strTexture['openEnd'] = true;
      }
    }
    if (sum === 4) strTexture['gutters'] = strTexture['gutters'] ? strTexture['gutters'] + 1 : 1;
  }
  
  threeCardStr(gaps, strTexture, firstRank, idx) {
    const sum = this.sumGaps(gaps, idx, 2);
    if (firstRank !== 14 && sum === 2) firstRank === 13 || firstRank === 2 ? strTexture['smThree'] = true : strTexture['three'] = true;
    if (sum === 3 || sum === 4) sum === 3 ? strTexture['threeGap'] = true : strTexture['threeTwoGap'] = true
  }

  straightTexture(cards) {
    const gaps = this.gaps(cards);
    const strTexture = { gutters: 0, three: false, openEnd: false, smThree: false, threeGap: false, threeTwoGap: false }
    for (let g=0; g<gaps.length;g++) { //[1, 6, 3, 1], 0, 2  arguments to sumGaps
      let firstRank = gaps[g][1];
      this.fourCardStr(gaps, strTexture, firstRank, g);
      this.threeCardStr(gaps, strTexture, firstRank, g);
    }
    return strTexture;
  }

  straight(texture, handAttr) {
    if (texture['fCards'] === 3 || this.bPairedPlus(texture)) return handAttr['beatsBoard'] ? [.50] : [.25, 'call'];
    return handAttr['beatsBoard'] ? [1] : [.55, 'call'];
  }
  
  trips(texture, handAttr) {
    if (texture['fCards'] === 3 || this.bPairedPlus(texture)) return handAttr['beatsBoard'] ? [1] : [.25];
    return handAttr['beatsBoard'] ? [.8] : [.45, 'call'];
  }
  
  twoPair(texture, handAttr) {
    if (texture['fCards'] === 3 || this.bPairedPlus(texture)) return handAttr['beatsBoard'] ? [.6] : [.15];
    return handAttr['beatsBoard'] ? [.7] : [.35, 'call'];
  };

  pairMinus(texture, handAttr) {
    let val = handAttr['beatsBoard'] ? .1 : .05;
    if (this.nPair(1)) {
      val += .75;
      if (texture['lowHigh']) val *= 1.5;
    } else if (this.nPair(2)) {
      val += .3;
      if (texture['lowHigh']) val *= 1.3;
    } else if (this.nPair(3)) {
      val += .25;
      if (texture['lowHigh']) val *= 1.1;
    } else if (this.nPair(4) || this.nPair(5)) {
      val += .15;
    } else {
      val += .05;
    }
    if (texture['fCards'] === 3) val /= 1.5;
    if (texture['fCards'] === 4) val /= 4;
    return [val];
  }

  xHigh(num) {
    return this.boardSolved.cards.filter(card => (card.rank > 9)).length === num;
  }

  xLow(num) {
    return this.boardSolved.cards.filter(card => (card.rank < 10)).length === num;
  }

  lowHigh(texture) {
    if (this.bPairedPlus(texture)) return false;
    if (!this.xHigh(1)) return false;
    if (!xLow(1)) return false;
    return true;
  }
}