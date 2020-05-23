import Chipstack from '../pokerLogic/chipstack';
import PreFlop from './preflop';
import PostFlop from './postflop';

export default class ComputerPlayer {
  constructor(position, chipstack, cardDims, reveal, stats, sound) {
    this.position = position;
    this.chipstack = chipstack;
    this.folded = false;
    this.chipsInPot = 0;
    this.streetChipsInPot = 0;
    this.preFlop = new PreFlop(stats);
    this.postFlop = new PostFlop(stats);
    this.hand = [];
    this.comp = true;
    this.reveal = reveal;
    this.revealed = reveal;
    this.cardDims = cardDims;
    this.aggressor = false;
    (position === 'sb') ? this.side = 'right' : this.side = 'left';
    (position === 'sb') ? this.num = 1 : this.num = 2;
    (this.side === 'right') ? this.name = 'Mike McDermott' : this.name = 'Teddy KGB';
    this.sound = sound;
    this.stats = stats;
    if (sound) {
      this.chipsBet = new Audio('https://js-holdem.s3-us-west-1.amazonaws.com/Audio/raise.mp3');
      this.chipsCall = new Audio('https://js-holdem.s3-us-west-1.amazonaws.com/Audio/call.wav');
      this.check = new Audio('https://js-holdem.s3-us-west-1.amazonaws.com/Audio/check.wav');
    }
  }

  text(input) {
    document.querySelector(".table-bottom-actions-text").innerText = input;
  }

  promptText(input) {
    document.querySelector(".table-bottom-actions-prompt").innerText = input;
  }

  promptAction() {}

  maxBet(num, toCall, sb) {
    let amount =  (num + toCall > this.chipstack) ? this.chipstack : num;
    return (sb || toCall > 0) ? ['raise', amount] : ['bet', amount];
  }

  genPreflopBetRaise(betRaise){
    return betRaise * this.nRandoms(3) * 1.3 + betRaise; //from 1.75
  }

  nRandoms(n) {
    let result = Math.random();
    for (let i=1;i<n.length;i++) { result = (result + Math.random()) / 2 }
    return result;
  }

  genBetRaise(toCall, pot, sb, isPreflop){
    let randNum = this.nRandoms(3) * 3 * pot;
    let betRaise;
    if (randNum < toCall * 2) {
      betRaise = toCall * 2;
      // if (sb) betRaise = (betRaise >= 3 * sb) ? betRaise : 3 * sb;
    // } else if (randNum > 1.6 * pot) {
    //   if (sb) betRaise = (randNum > 3 * sb) ? randNum : 3 * sb;
    } else {
      let rand = this.nRandoms(1);
      if (rand > .5) {
        betRaise = (randNum > pot) ? pot : randNum;
      } else {
        betRaise = (randNum > 1.5 * pot) ? 1.5 * pot : randNum;
      }
      // if (sb) betRaise = (betRaise > 3 * sb) ? betRaise : 3 * sb;
    }
    if (sb) betRaise = (betRaise > 3 * sb) ? betRaise : 3 * sb;
    if (isPreflop) betRaise = this.genPreflopBetRaise(betRaise);
    return this.maxBet(betRaise, toCall, sb);
  }
  
  adjByTeir(handTeir, potOdds){ //.25
    //return 2 * handTeir * potOdds * this.nRandoms(3)) + handTeir;
    const max = 2 * handTeir * potOdds
    const inverse =  1 / max;
    const rng = this.nRandoms(3);
    if (rng / inverse > max * .85) return 1;
    return max * rng;
  }

  isAggressor(){
    if (this.aggressor) return this.nRandoms(3) >= .5;
  }

  currStreet(boardCards) {
    if (!boardCards.length) return 'pf';
    if (boardCards.length === 3) return 'flop';
    if (boardCards.length === 4) return 'turn';
    if (boardCards.length === 5) return 'river';
  }

  streetAdj(boardCards, num) {
    const street = this.currStreet(boardCards);
    const aggFactor = this.stats[`${street}Agg`] / this.stats[`${street}Call`]
    return num * aggFactor;
  }

  promptResponse(toCall, pot, sb, isPreflop, boardCards = [], aggAction){
    if (aggAction && this.isAggressor()) return this.genBetRaise(toCall, pot, sb, isPreflop);
    let evalArr = (boardCards.length > 0) ? this.postFlop.getTeir(this.hand, boardCards) : this.preFlop.getTeir(this.hand);
    const betRaise = this.genBetRaise(toCall, pot, sb, isPreflop);
    if (evalArr[1] === 'agg') return betRaise;

    const adjToCall = (toCall === 0) ? pot / 2 : toCall;
    const potOdds = pot / adjToCall;
    let teiredNum = this.adjByTeir(evalArr[0], potOdds);

    if (evalArr[1] === 'fold' || teiredNum < .45) return toCall > 0 ? ['fold'] : ['check'];
    teiredNum = this.streetAdj(boardCards, teiredNum);
    if (evalArr[1] === 'call' || this.chipstack === toCall || teiredNum < .85) {
      return toCall > 0 ? ['call'] : betRaise;
    } else {
      return betRaise;
    }
  }
  

  resolveCall(to_call){
    let callAmt = (to_call > this.chipstack) ? this.chipstack : to_call;
    if (this.sound) this.chipsCall.play();
    this.chipstack -= callAmt;
    this.chipsInPot += callAmt;
    this.streetChipsInPot += callAmt;
    return callAmt;
  }

  resolveBetRaise(betInput, sb){
    let betAmt = (betInput > this.chipstack) ? this.chipstack : betInput;
    this.chipstack -= betAmt;
    this.chipsInPot += betAmt;
    this.streetChipsInPot += betAmt;
    if (this.sound) this.chipsBet.play();
    return betAmt;
  }

  resolveAction(to_call, betInput, textInput, sb = 0) {
    if (textInput === 'check') {
      if (this.sound) this.check.play();
      return 0;
    } else if (textInput === 'fold') {
      this.folded = true;
      return null;
    } else if (textInput === 'call') {
      return this.resolveCall(to_call);
    } else {
      return this.resolveBetRaise(betInput, sb);
    }
  }

  renderName(gameStarted, current) {
    let playerName = document.querySelector(`#player-info-${this.side}-chip-text-name`);
    playerName.innerText = `${this.name}`;
    if (gameStarted) {
      (current) ? playerName.className = 'glow' : playerName.className = 'player-info-name';
    }
  }
  
  renderTextChips() {
    let playerChips = document.querySelector(`#player-info-${this.side}-chip-text-chips`);
    playerChips.innerText = `$${this.chipstack}`;
  }

  renderCards() {
    if (this.hand[0]) {
      let playerCard1 = document.querySelector(`.player-info-${this.side}-cards-1`);
      let playerCard2 = document.querySelector(`.player-info-${this.side}-cards-2`);
      this.hand[0].render(playerCard1, [this.cardDims[0]], [this.cardDims[1]], this.revealed, this.folded, true);
      this.hand[1].render(playerCard2, [this.cardDims[0]], [this.cardDims[1]], this.revealed, this.folded, true);
    }
  }

  renderChips(){
    let $stackDiv = $(`#table-felt-board-bet-player-${this.num}`);
    let stack = new Chipstack(this.streetChipsInPot, $stackDiv);
    stack.render();
  }

  unrenderChips() {
    let $stackDiv = $(`#table-felt-board-bet-player-${this.num}`);
    $stackDiv.empty();
  }

  render(gameStarted, current) {
    this.renderName(gameStarted, current);
    this.renderTextChips(gameStarted, current);
    this.renderCards();
    (this.streetChipsInPot > 0) ? this.renderChips() : this.unrenderChips();
  }

  resetVars() {
    this.folded = false;
    this.chipsInPot = 0;
    this.hand = [];
    this.revealed = this.reveal;
  }
}