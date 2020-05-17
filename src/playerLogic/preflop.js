const Hand = require('pokersolver').Hand;

export default class PreFlop {
  constructor() {
  }
  
  handVal(hand){
    return Hand.solve([`${hand[0].rank}${hand[0].suit}`, `${hand[1].rank}${hand[1].suit}`]);
  }

  compHands(oppHand){
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

  sideCard(rank, min, max){
    let rank = this.convertVal(rank);
    return rank >= parseInt(min) && rank <= parseInt(max);
  }

  suited(){
    return this.hand[0][1] === this.hand[1][1];
  }

  pfTierOne(hand){
    if (this.compHands(["8s", "8h"]) === this.handSolved) return true;
    if (this.compHands(["As", "Jh"]) === this.handSolved) return true;
    return false;
  }

  sideRank(main, minRank, maxRank) {
    const side = this.hand[0].rank === main ? 1 : 0;
    return this.sideCard(this.hand[side], minRank, maxRank);
  }

  inclRank(rank) {
    return this.hand[0].rank === rank || this.hand[1].rank === rank;
  }

  pfTierTwo(){
    if (this.compHands(["1s", "1h"]) === this.handSolved) return true;
    if (inclRank('A')) return true;
    if (inclRank('K') && this.suited()) return true;
    if (this.inclRank("K")) return sideRank("K", "T", "Q");
    if (this.inclRank("Q")) return sideRank("Q", "9", "J");
    if (this.inclRank("J")) return sideRank("J", "T", "T");
    if (this.inclRank("T") && this.suited) return sideRank("T", "9", "9");
    if (this.inclRank("9") && this.suited) return sideRank("9", "8", "8");
    
    return false;
  }
  
  pfTierThree(){
    if (inclRank('K') && this.suited()) return true;
    if (inclRank('Q') && this.suited()) return true;
    if (inclRank('J') && this.suited()) return true;
    
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
    if (inclRank('Q')) return true;
    if ((this.hand[0].rank === 'T' || this.hand[1].rank === 'T') && this.suited()) return true;
    if ((this.hand[0].rank === '9' || this.hand[1].rank === '9') && this.suited()) return true;
    
    if (this.hand[0].rank === 'J' || this.hand[0].rank === 'T') return this.sideCard(this.hand[1].rank, "5", "6");
    if (this.hand[1].rank === 'J' || this.hand[1].rank === 'T') return this.sideCard(this.hand[0].rank, "5", "6");
    if (this.hand[0].rank === '9') return this.sideCard(this.hand[1].rank, "4", "5");
    if (this.hand[1].rank === '9') return this.sideCard(this.hand[0].rank, "4", "5");
    if (this.hand[0].rank === '8') return this.sideCard(this.hand[1].rank, "4", "5");
    if (this.hand[1].rank === '8') return this.sideCard(this.hand[0].rank, "4", "5");
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
    if (this.pfTierOne()) return [1, 'agg']; //3:1    1 * 3 * rand compare to .66    
    // 1 + (1 * 3 * Math.random) >= .66      1.x >= .66   always yes
    if (this.pfTierTwo()) return [.25];
    // .5 + (.5 * 3 * Math.random) >= .66       .5 + 1.5 * rand   [1.5 * rand compared to .16]
    // .25 + (.25 / 3 * Math.random) 
    //villan bets 200 into 100 pot -> final pot 500, 200 to call   -> .4   //2.5
    // .25 + (.25 + .4 ( Math.random)) => .25 + .65 * rand  [0 -> .65]
    // vill bets 100 into 200 pot >>  final pot 400, 100 to call -> .25 // 4
    //  current pot / to_call
    // bet 100 into 200   3:1
    //.25 + (.25 * 3 * Math.random)   
    // bet 200 into 100   300 / 200 ->> 1.5
    // bet 1000 into 100   1100 / 1000 
    // .25 + (.5 * 3 * random)
    if (this.pfTierThree()) return [.15];
    // .25 + .25 * 3 * rand               
    if (this.pfTierFour()) return [.1];
    return [.05];
  }
}