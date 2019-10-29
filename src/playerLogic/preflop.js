const Hand = require('pokersolver').Hand;

export default class PreFlop {
  constructor() {
  }
  
  handVal(hand){
    return Hand.solve([`${hand[0].rank}${hand[0].suit}`, `${hand[1].rank}${hand[1].suit}`]);
  }

  compHands(oppHand){ ["8s", "8c"]
    let hand = Hand.solve([`${this.hand[0].rank}${this.hand[0].suit}`, `${this.hand[1].rank}${this.hand[1].suit}`]);
    oppHand = Hand.solve(oppHand)
    return (Hand.winners([this.handSolved, oppHand])[0] === this.handSolved) ? this.handSolved : oppHand;
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

  pfTierOne(hand){
    if (this.compHands(["8s", "8h"]) === this.handV2) return true;
    if (this.compHands(["As", "Jh"]) === this.handV2) return true;
    return false;
  }

  pfTierTwo(){
    if (this.compHands(["1s", "1h"]) === this.handV2) return true;
    if (this.hand[0].rank === 'A' || this.hand[1].rank === 'A') return true;
    if ((this.hand[0].rank === 'K' || this.hand[1].rank === 'K') && this.suited()) return true;
    
    if (this.hand[0].rank === 'K') return this.sideCard(this.hand[1].rank, "T", "Q");
    if (this.hand[1].rank === 'K') return this.sideCard(this.hand[0].rank, "T", "Q");
    if (this.hand[0].rank === 'Q') return this.sideCard(this.hand[1].rank, "9", "J");
    if (this.hand[1].rank === 'Q') return this.sideCard(this.hand[0].rank, "9", "J");
    if (this.hand[0].rank === 'J') return this.sideCard(this.hand[1].rank, "T", "T");
    if (this.hand[1].rank === 'J') return this.sideCard(this.hand[0].rank, "T", "T");
    if (this.hand[0].rank === 'T') return this.sideCard(this.hand[1].rank, "9", "9");
    if (this.hand[1].rank === 'T') return this.sideCard(this.hand[0].rank, "9", "9");
    if (this.hand[0].rank === '9') return this.sideCard(this.hand[1].rank, "8", "8");
    if (this.hand[1].rank === '9') return this.sideCard(this.hand[0].rank, "8", "8");
    
    return false;
  }
  
  pfTierThree(){
    if (this.hand[0].rank === 'K' || this.hand[1].rank === 'K') return true;
    if ((this.hand[0].rank === 'Q' || this.hand[1].rank === 'Q') && this.suited()) return true;
    if ((this.hand[0].rank === 'J' || this.hand[1].rank === 'J') && this.suited()) return true;
    
    if (this.hand[0].rank === 'Q') return this.sideCard(this.hand[1].rank, "8", "8");
    if (this.hand[1].rank === 'Q') return this.sideCard(this.hand[0].rank, "8", "8");
    if (this.hand[0].rank === 'J') return this.sideCard(this.hand[1].rank, "7", "9");
    if (this.hand[1].rank === 'J') return this.sideCard(this.hand[0].rank, "7", "9");
    if (this.hand[0].rank === 'T') return this.sideCard(this.hand[1].rank, "6", "8");
    if (this.hand[1].rank === 'T') return this.sideCard(this.hand[0].rank, "6", "8");
    if (this.hand[0].rank === '9') return this.sideCard(this.hand[1].rank, "5", "7");
    if (this.hand[1].rank === '9') return this.sideCard(this.hand[0].rank, "5", "7");
    if (this.hand[0].rank === '8') return this.sideCard(this.hand[1].rank, "5", "6");
    if (this.hand[1].rank === '8') return this.sideCard(this.hand[0].rank, "5", "6");
    if (this.hand[0].rank === '7') return this.sideCard(this.hand[1].rank, "5", "6");
    if (this.hand[1].rank === '7') return this.sideCard(this.hand[0].rank, "5", "6");
    if (this.hand[0].rank === '6') return this.sideCard(this.hand[1].rank, "5", "5");
    if (this.hand[1].rank === '6') return this.sideCard(this.hand[0].rank, "5", "5");
    if (this.hand[0].rank === '5') return this.sideCard(this.hand[1].rank, "4", "4");
    if (this.hand[1].rank === '5') return this.sideCard(this.hand[0].rank, "4", "4");

    return false;
  }
  pfTierFour(){
    if (this.hand[0].rank === 'Q' || this.hand[1].rank === 'Q') return true;
    if ((this.hand[0].rank === 'T' || this.hand[1].rank === 'T') && this.suited()) return true;
    if ((this.hand[0].rank === '9' || this.hand[1].rank === '9') && this.suited()) return true;
    
    if (this.hand[0].rank === 'J') return this.sideCard(this.hand[1].rank, "6", "6");
    if (this.hand[1].rank === 'J') return this.sideCard(this.hand[0].rank, "6", "6");
    if (this.hand[0].rank === 'T') return this.sideCard(this.hand[1].rank, "6", "5");
    if (this.hand[1].rank === 'T') return this.sideCard(this.hand[0].rank, "6", "5");
    if (this.hand[0].rank === '9') return this.sideCard(this.hand[1].rank, "5", "4");
    if (this.hand[1].rank === '9') return this.sideCard(this.hand[0].rank, "5", "4");
    if (this.hand[0].rank === '8') return this.sideCard(this.hand[1].rank, "5", "4");
    if (this.hand[1].rank === '8') return this.sideCard(this.hand[0].rank, "5", "4");
    if (this.hand[0].rank === '7') return this.sideCard(this.hand[1].rank, "4", "4");
    if (this.hand[1].rank === '7') return this.sideCard(this.hand[0].rank, "4", "4");
    if (this.hand[0].rank === '6') return this.sideCard(this.hand[1].rank, "4", "4");
    if (this.hand[1].rank === '6') return this.sideCard(this.hand[0].rank, "4", "4");
    if (this.hand[0].rank === '5') return this.sideCard(this.hand[1].rank, "3", "3");
    if (this.hand[1].rank === '5') return this.sideCard(this.hand[0].rank, "3", "3");
    if (this.hand[0].rank === '4') return this.sideCard(this.hand[1].rank, "3", "3");
    if (this.hand[1].rank === '4') return this.sideCard(this.hand[0].rank, "3", "3");
    if (this.hand[0].rank === '3') return this.sideCard(this.hand[1].rank, "2", "2");
    if (this.hand[1].rank === '3') return this.sideCard(this.hand[0].rank, "2", "2");

    return false;
  }

  defineHand(hand){
    this.hand = hand;
    this.handSolved = this.handVal(hand);
  }

  getTeir(hand){
    this.defineHand(hand);
    if (this.pfTierOne()) return 'Teir1';
    if (this.pfTierTwo()) return 'Teir2';
    if (this.pfTierThree()) return 'Teir3';
    if (this.pfTierFour()) return 'Teir4';
    return '2';
  }
}