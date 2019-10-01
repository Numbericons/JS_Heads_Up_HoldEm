const Hand = require('pokersolver').Hand;

export default class HandRank {
  constructor(hand) {
    this.hand = hand;
    this.handV2 = Hand.solve([`${hand[0].rank}${hand[0].suit}`, `${hand[1].rank}${hand[1].suit}`]);
  }

  compHands(oppHand){
    oppHand = Hand.solve(oppHand);
    return (Hand.winners([this.handV2, oppHand])[0] === this.handV2) ? this.handV2 : oppHand;
  }

  convertVal(rank){
    if (parseInt(rank)) return parseInt(rank);
    switch(rank) {
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

  sideCard(cardRank, min, max){
    return this.convertVal(cardRank) >= min && this.convertVal(cardRank) <= max;
  }

  suited(){
    return this.hand[0][1] === this.hand[1][1];
  }

  pfTierOne(){
    if (this.compHands(["8s", "8h"]) === this.handV2) return true;
    if (this.compHands(["As", "Jh"]) === this.handV2) return true;
    // if (this.hand[0][0] === 'A' || this.hand[1][0] === 'A') {
    //   if (this.hand[0][0] === 'K' || this.hand[1][0] === 'K') return true;
    //   if (this.hand[0][0] === 'Q' || this.hand[1][0] === 'Q') return true;
    // }
    return false;
  }

  pfTierTwo(){
    if (this.compHands(["1s", "1h"]) === this.handV2) return true;
    if (this.hand[0][0] === 'A' || this.hand[1][0] === 'A') return true;
    if (this.hand[0][0] === 'K') return this.sideCard(this.hand[1][0], "T", "Q");
    if (this.hand[1][0] === 'K') return this.sideCard(this.hand[0][0], "T", "Q");
    if (this.hand[0][0] === 'K') return this.sideCard(this.hand[1][0], "T", "Q");
    if (this.hand[1][0] === 'K') return this.sideCard(this.hand[0][0], "T", "Q");
    if (this.hand[0][0] === 'Q') return this.sideCard(this.hand[1][0], "9", "J");
    if (this.hand[1][0] === 'Q') return this.sideCard(this.hand[0][0], "9", "J");
    if (this.hand[0][0] === 'J') return this.sideCard(this.hand[1][0], "T", "T");
    if (this.hand[1][0] === 'J') return this.sideCard(this.hand[0][0], "T", "T");
    if (this.hand[0][0] === 'T') return this.sideCard(this.hand[1][0], "9", "9");
    if (this.hand[1][0] === 'T') return this.sideCard(this.hand[0][0], "9", "9");
    if (this.hand[0][0] === '9') return this.sideCard(this.hand[1][0], "8", "8");
    if (this.hand[1][0] === '9') return this.sideCard(this.hand[0][0], "8", "8");

    return false;
  }

  pfTierThree(){
    if (this.hand[0][0] === 'K' || this.hand[1][0] === 'K') return true;
    if (this.hand[0][0] === 'Q' || this.hand[1][0] === 'Q') return true;
    if (this.hand[0][0] === 'J') return this.sideCard(this.hand[1][0], "7", "9");
    if (this.hand[1][0] === 'J') return this.sideCard(this.hand[0][0], "7", "9");
    if (this.hand[0][0] === 'T') return this.sideCard(this.hand[1][0], "6", "8");
    if (this.hand[1][0] === 'T') return this.sideCard(this.hand[0][0], "6", "8");
    if (this.hand[0][0] === '9') return this.sideCard(this.hand[1][0], "5", "7");
    if (this.hand[1][0] === '9') return this.sideCard(this.hand[0][0], "5", "7");
    if (this.hand[0][0] === '8') return this.sideCard(this.hand[1][0], "5", "6");
    if (this.hand[1][0] === '8') return this.sideCard(this.hand[0][0], "5", "6");
    if (this.hand[0][0] === '7') return this.sideCard(this.hand[1][0], "5", "6");
    if (this.hand[1][0] === '7') return this.sideCard(this.hand[0][0], "5", "6");
    if (this.hand[0][0] === '6') return this.sideCard(this.hand[1][0], "5", "5");
    if (this.hand[1][0] === '6') return this.sideCard(this.hand[0][0], "5", "5");
    if (this.hand[0][0] === '5') return this.sideCard(this.hand[1][0], "4", "4");
    if (this.hand[1][0] === '5') return this.sideCard(this.hand[0][0], "4", "4");

    return false;
  }

  rankPfHand(){
    if (this.pfTierOne()) return 'Teir1';
    if (this.pfTierTwo()) return 'Teir2';
    if (this.pfTierThree()) return 'Teir3';
    return 'Teir4';
  }
}