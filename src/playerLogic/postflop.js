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

  defineHand(hand, boardCards) {
    this.hand = hand;
    this.boardCards = boardCards;
    this.boardSolved = this.boardVal();
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
    debugger
    const hCards = cardsUsed();
    this.flush(beatsBoard);
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

  flushCards(player){
    let fCards = 1;
    const cards = player ? this.handSolved.suits : this.boardSolved.suits;
    const keys = player ? Object.keys(cards) : Object.keys(cards);

    for (let s=0;s<keys.length;s++) {
      const suitCnt = cards[keys[s]].length;
      if (suitCnt > fCards) fCards = suitCnt;
    }
    return fCards;
  }

  flush(beatsBoard, hCards){
    const pFlush = this.flushCards(true);
    const bFlush = this.flushCards(false);
    //num cards used, if beats board and using both cards and board isnt paired+ return [1,'agg']
  }

  house(beatsBoard) {
    if (this.boardSolved.rank === 6) return beatsBoard ? [1,'agg'] : [.5,'call'];
  }

  quads(kicker, beatsBoard){
    return beatsBoard ? [1, 'agg'] : [.5, 'call'];
  }

  fHousePlus(kicker, beatsBoard){
    if (this.handSolved.rank > 7) return [1,'agg'];
    const quads = this.quads(kicker, beatsBoard);
    if (quads) return quads;
    return this.house(beatsBoard);
  }
}