import Chipstack from '../pokerLogic/chipstack';
import PreFlop from './preflop';
import PostFlop from './postflop';


export default class ComputerPlayer {
  constructor(position, chipstack, cardDims) {
    this.position = position;
    this.chipstack = chipstack;
    this.folded = false;
    this.chipsInPot = 0;
    this.streetChipsInPot = 0;
    this.preFlop = new PreFlop();
    this.postFlop = new PostFlop();
    this.hand = [];
    this.comp = true;
    this.revealed = false;
    this.cardDims = cardDims;
    this.aggressor = false;
    (position === 'sb') ? this.side = 'right' : this.side = 'left';
    (this.side === 'right') ? this.name = 'Mike McDermott' : this.name = 'Teddy KGB';
    this.chipsBet = new Audio('https://js-holdem.s3-us-west-1.amazonaws.com/Audio/raise.mp3');
    this.chipsCall = new Audio('https://js-holdem.s3-us-west-1.amazonaws.com/Audio/call.wav');
    this.check = new Audio('https://js-holdem.s3-us-west-1.amazonaws.com/Audio/check.wav');
  }

  text(input) {
    let textSelect = document.querySelector(".table-bottom-actions-text");
    textSelect.innerText = input;
  }

  promptText(input) {
    let promptSelect = document.querySelector(".table-bottom-actions-prompt");
    promptSelect.innerText = input;
  }

  promptAction() {}

  maxBet(num, to_call, sb) {
    let amount =  (num + to_call > this.chipstack) ? this.chipstack : num;
    return (sb || to_call > 0) ? ['raise', amount] : ['bet', amount];
  }

  genPreflopBetRaise(betRaise){
    let multiplier = Math.random() * 1.3 + 1 //from 1.75
    return betRaise * multiplier;
  }

  genBetRaise(to_call, pot, sb, isPreflop){
    let randNum = Math.random() * 2 * pot;
    let betRaise;
    if (randNum < to_call * 2) {
      betRaise = to_call * 2;
      if (sb) betRaise = (betRaise >= 3 * sb) ? betRaise : 3 * sb;
    } else if (randNum > 1.6 * pot) {
      if (sb) betRaise = (randNum > 3 * sb) ? randNum : 3 * sb;
    } else {
      betRaise = (randNum > pot) ? pot : randNum;
      if (sb) betRaise = (betRaise > 3 * sb) ? betRaise : 3 * sb;
    }
    if (isPreflop) betRaise = this.genPreflopBetRaise(betRaise);
    return this.maxBet(betRaise, to_call, sb);
  }
  
  adjByTeir(handTeir, potOdds){
    // const autoAction = Math.random();
    // if (handTeir >= autoAction) return Infinity;
    return handTeir + (2 * handTeir * potOdds * Math.random());
  }

  isAggressor(){
    if (this.aggressor) return Math.random() >= .5;
    return false;
  }

  promptResponse(to_call, pot, sb, isPreflop, boardCards = [], aggAction){
    if (aggAction && this.isAggressor()) return this.genBetRaise(to_call, pot, sb, isPreflop);
    let evalArr = (boardCards.length > 0) ? this.postFlop.getTeir(this.hand, boardCards) : this.preFlop.getTeir(this.hand);
    const auto = evalArr[1];
    if (auto === 'agg') this.genBetRaise(to_call, pot, sb, isPreflop);
    
    let adjToCall = (to_call === 0) ? pot : to_call;
    let potOdds = (adjToCall + pot) / adjToCall;
    let teiredNum = this.adjByTeir(evalArr[0], potOdds);

    if (auto === 'fold' || teiredNum < .5) {
      return to_call > 0 ? ['fold'] : ['check'];
    } else if (auto === 'call' || this.chipstack === to_call || teiredNum < .80) {
      return to_call > 0 ? ['call'] : ['check'];
    } else {
      return this.genBetRaise(to_call, pot, sb, isPreflop);
    }
  }
  

  resolveCall(to_call){
    let callAmt = (to_call > this.chipstack) ? this.chipstack : to_call;
    this.chipsCall.play();
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
    this.chipsBet.play();
    return betAmt;
  }

  resolve_action(to_call, betInput, textInput, sb = 0) {
    if (textInput === 'check') {
      this.check.play();
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
    let $stackDiv = $(`#table-felt-board-bet-player-2`);
    let stack = new Chipstack(this.streetChipsInPot, $stackDiv);
    stack.render();
  }

  unrenderChips() {
    let $stackDiv = $(`#table-felt-board-bet-player-2`);
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
    this.revealed = false;
  }
}

