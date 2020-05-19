const Hand = require('pokersolver').Hand;

export default class PreFlop {
  constructor(stats) {
    this.stats = stats;
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

  suited(){
    return this.hand[0].suit === this.hand[1].suit;
  }

  sideCard(side, min, max, attr) {
    let rank = this.convertVal(side.rank);
    if (rank >= this.convertVal(min) && rank <= this.convertVal(max)) return attr;
  }

  sideRank(main, minRank, maxRank, attr) {
    const side = this.hand[0].rank === main ? 1 : 0;
    return this.sideCard(this.hand[side], minRank, maxRank, attr);
  }

  inclRank(rank) {
    return this.hand[0].rank === rank || this.hand[1].rank === rank;
  }

  pfTierOne() {
    if (this.compHands(["8s", "8h"]) === this.handSolved) return ['pfPair'];
    if (this.handSolved.rank === 1 && this.compHands(["As", "Jh"]) === this.handSolved) return ['pfHigh'];
    return false;
  }

  pfTierTwo(){
    if (this.compHands(["1s", "1h"]) === this.handSolved) return ['pfPair'];
    if (this.inclRank("A") && this.suited()) return ['pfHigh'];

    if (this.inclRank("A")) return this.sideRank("A", "9", "J", ['pfHigh']);
    if (this.inclRank("K")) return this.sideRank("K", "J", "Q", ['pfHigh']);
    if (this.inclRank("Q")) return this.sideRank("Q", "J", "J", ['pfHigh']);
    if (this.inclRank("J") && this.suited()) return this.sideRank("J", "T", "T", ['pfHigh']);
    
    return false;
  }
  
  pfTierThree(){
    if (this.inclRank("A")) return ['pfHigh'];
    if (this.inclRank("K") && this.suited()) return ['pfHigh'];
    
    if (this.inclRank("K")) return this.sideRank("K", "T", "T", ['pfHigh']);
    if (this.inclRank("Q")) return this.sideRank("Q", "9", "T", ['pfHigh']);
    if (this.inclRank("J")) return this.sideRank("J", "T", "T", ['pfHigh']);
    if (this.inclRank("T") && this.suited()) return this.sideRank("T", "8", "9", ['pfConn']);
    if (this.inclRank("9") && this.suited()) return this.sideRank("9", "7", "8", ['pfConn']);
    if (this.inclRank("8") && this.suited()) return this.sideRank("8", "7", "7", ['pfConn']);
  }
  
  pfTierFour(){
    if (this.inclRank("K")) return ['pfHigh'];
    if (this.inclRank("Q") && this.suited()) return [];
    if (this.inclRank("J") && this.suited()) return [];
    
    if (this.inclRank("Q")) return this.sideRank("Q", "8", "8", ['pfConn', 'pfHigh']);
    if (this.inclRank("J")) return this.sideRank("J", "7", "9", ['pfConn']);
    if (this.inclRank("T")) return this.sideRank("T", "6", "9", ['pfConn']);
    if (this.inclRank("9")) return this.sideRank("9", "6", "8", ['pfConn']);
    if (this.inclRank("8")) return this.sideRank("8", "5", "7", ['pfConn']);
    if (this.inclRank("7")) return this.sideRank("7", "5", "6", ['pfConn']);
    if (this.inclRank("6")) return this.sideRank("6", "5", "5", ['pfConn']);
    if (this.inclRank("5")) return this.sideRank("5", "4", "4", ['pfConn']);

    return false;
  }
  pfTierFive(){
    if (this.inclRank("Q")) return [];
    if (this.inclRank("T") && this.suited()) return [];
    if (this.inclRank("9") && this.suited()) return [];

    if (this.inclRank("J")) return this.sideRank("J", "5", "6", []);
    if (this.inclRank("T")) return this.sideRank("T", "5", "5", []);
    if (this.inclRank("9")) return this.sideRank("9", "4", "5", []);
    if (this.inclRank("8")) return this.sideRank("8", "4", "4", []);
    if (this.inclRank("7")) return this.sideRank("7", "4", "4", []);
    if (this.inclRank("6")) return this.sideRank("6", "4", "4", ['pfConn']);
    if (this.inclRank("5")) return this.sideRank("5", "3", "3", ['pfConn']);
    if (this.inclRank("4")) return this.sideRank("4", "3", "3", ['pfConn']);

    return false;
  }

  defineHand(hand){
    this.hand = hand;
    this.handSolved = this.handVal(hand);
  }

  attrAdj(num, attr) {
    if (this.suited()) attr.push('pfSuit');
    const stats = this.stats
    attr.forEach(k => { num *= stats[k] });
    return num;
  }

  statAdj(num, attr) {
    return this.attrAdj(num, attr) * this.stats['pfAgg'] * this.stats['pfCall'];
  }

  getTeir(hand){
    this.defineHand(hand);

    const t1 = this.pfTierOne();
    if (t1) return [this.statAdj(1, t1), 'agg'];    
    const t2 = this.pfTierTwo();
    if (t2) return [this.statAdj(.35, t2)];
    const t3 = this.pfTierThree();
    if (t3) return [this.statAdj(.25, t3)];
    const t4 = this.pfTierFour();     
    if (t4) return [this.statAdj(.15, t4)];
    const t5 = this.pfTierFive();     
    if (t5) return [this.statAdj(.1, t5)];

    return [this.statAdj(.05, [])];
  }
}

//t1
  // 1 + (1 * 3 * Math.random) >= .66      1.x >= .66   always yes
//t2
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
//t3
  // .25 + .25 * 3 * rand
