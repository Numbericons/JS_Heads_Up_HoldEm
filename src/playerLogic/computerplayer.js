import Chipstack from '../pokerLogic/chipstack';
export default class ComputerPlayer {
  constructor(position, chipstack, cardDims) {
    this.position = position;
    this.chipstack = chipstack;
    this.folded = false;
    this.chipsInPot = 0;
    this.streetChipsInPot = 0;
    this.hand = [];
    this.comp = true;
    this.revealed = false;
    this.cardDims = cardDims;
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

  promptAction() {
  }

  maxBet(num, to_call) {
    return (num + to_call > this.chipstack) ? ['betRaise', this.chipstack] : ['betRaise', num];
  }

  genBetRaise(to_call, pot, sb){
    let randNum = Math.random() * 2 * pot;
    let betRaise;
    if (randNum < to_call * 2) {
      betRaise = to_call * 2;
      if (sb) betRaise = (betRaise >= 3 * sb) ? betRaise : 3 * sb;
      return this.maxBet(betRaise, to_call);
    } else if (randNum > 1.6 * pot) {
      if (sb) betRaise = (randNum > 3 * sb) ? randNum : 3 * sb;
      return this.maxBet(betRaise, to_call);
    } else {
      betRaise = (randNum > pot) ? pot : randNum;
      if (sb) betRaise = (betRaise > 3 * sb) ? betRaise : 3 * sb;
      return this.maxBet(betRaise, to_call);
    }
  }
  
  promptResponse(to_call, pot, sb){
    let adjToCall;
    (to_call === 0) ? adjToCall = pot / 2: adjToCall = to_call;
    let randNum = Math.random();
    let potOdds = adjToCall / (adjToCall + pot); 
    if (randNum < potOdds) {
      if (to_call > 0) {
        return ['fold'];
      } else {
          return ['check'];
      }
    } else if (this.chipstack === to_call) {
      return ['call'];
    } else if (randNum < potOdds * 1.5) {
      if (to_call > 0) {
        return ['call'];
      } else {
        return ['check'];
      }
    } else {
        return this.genBetRaise(to_call, pot, sb);
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

  // resolveBetRaise(betInput, sb){
  //   let betAmt = (betInput > this.chipstack) ? this.chipstack : betInput;
  //   this.chipstack -= betAmt + sb;
  //   this.chipsInPot += betAmt + sb;
  //   this.streetChipsInPot += betAmt + sb;
  //   this.chipsBet.play();
  //   return betAmt + sb;
  // }
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

  playerName() {
    let playerName = document.querySelector(`.player-info-${this.side}-chip-text-name`);
    playerName.innerText = `${this.name}`;
  }

  playerChips() {
    let playerChips = document.querySelector(`.player-info-${this.side}-chip-text-chips`);
    playerChips.innerText = `$${this.chipstack}`
  }

  playerCards() {
    if (this.hand[0]) {
      let playerCard1 = document.querySelector(`.player-info-${this.side}-cards-1`);
      let playerCard2 = document.querySelector(`.player-info-${this.side}-cards-2`);
      this.hand[0].render(playerCard1, [this.cardDims[0]], [this.cardDims[1]], this.revealed, true);
      this.hand[1].render(playerCard2, [this.cardDims[0]], [this.cardDims[1]], this.revealed, true);
    }
  }

  renderChips(){
    let $stackDiv = $(`.table-felt-board-bet-player-2`);
    let stack = new Chipstack(this.streetChipsInPot, $stackDiv);
    stack.render();
  }

  unrenderChips() {
    let $stackDiv = $(`.table-felt-board-bet-player-2`);
    $stackDiv.empty();
  }

  render() {
    this.playerName();
    this.playerChips();
    this.playerCards();
    (this.streetChipsInPot > 0) ? this.renderChips() : this.unrenderChips();
  }

  resetVars() {
    this.folded = false;
    this.chipsInPot = 0;
    this.hand = [];
    this.revealed = false;
  }
}