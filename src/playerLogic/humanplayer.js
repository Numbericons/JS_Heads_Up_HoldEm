import Chipstack from '../pokerLogic/chipstack';
export default class HumanPlayer {
  constructor(position, chipstack, cardDims, reveal){
    this.position = position;
    this.chipstack = chipstack;
    this.folded = false;
    this.chipsInPot = 0;
    this.streetChipsInPot = 0;
    this.hand = [];
    this.comp = false;
    this.reveal = reveal;
    this.revealed = reveal;
    this.cardDims = cardDims;
    this.aggressor = false;
    (position === 'sb') ? this.side = 'right' : this.side = 'left';
    (this.side === 'right') ? this.name = 'Mike McDermott' : this.name = 'Teddy KGB';
    this.sound = true;
    this.chipsBet = new Audio('https://js-holdem.s3-us-west-1.amazonaws.com/Audio/raise.mp3');
    this.chipsCall = new Audio('https://js-holdem.s3-us-west-1.amazonaws.com/Audio/call.wav');
    this.check = new Audio('https://js-holdem.s3-us-west-1.amazonaws.com/Audio/check.wav');
  }

  promptText(input){
    document.querySelector(".table-bottom-actions-prompt").innerText = input;
  }

  promptAction(to_call){
    (to_call === 0) ? this.promptText("...") : this.promptText(`$${to_call} to call`);
  }

  resolveAction(to_call, betInput, textInput, sb = 0) {
    if (textInput === 'check') {
      if (this.sound) this.check.play();
      return 0;
    } else if (textInput === 'fold') {
      this.folded = true;
      return null;
    } else if (textInput === 'call') {
      if (this.sound) this.chipsCall.play();
      this.chipstack -= to_call;
      this.chipsInPot += to_call;
      this.streetChipsInPot += to_call;
      return to_call;
    } else {
      if (this.sound) this.chipsBet.play();
      this.chipstack = this.chipstack - betInput + sb;
      this.chipsInPot += betInput - sb;
      this.streetChipsInPot += betInput - sb;
      return betInput - sb; //+
    }
  }

  renderName(gameStarted, current) {
    let playerName = document.querySelector(`#player-info-${this.side}-chip-text-name`);
    playerName.innerText = this.name;
    if (gameStarted) (current) ? playerName.className = 'glow' : playerName.className = 'player-info-name';
  }

  renderTextChips() {
    document.querySelector(`#player-info-${this.side}-chip-text-chips`).innerText = `$${this.chipstack}`;
  }

  renderCards() {
    if (this.hand[0]) {
      let playerCard1 = document.querySelector(`.player-info-${this.side}-cards-1`);
      let playerCard2 = document.querySelector(`.player-info-${this.side}-cards-2`);
      this.hand[0].render(playerCard1, [this.cardDims[0]], [this.cardDims[1]], this.revealed, this.folded, true);
      this.hand[1].render(playerCard2, [this.cardDims[0]], [this.cardDims[1]], this.revealed, this.folded, true);
    }
  }

  renderChips() {
    new Chipstack(this.streetChipsInPot, $(`#table-felt-board-bet-player-1`)).render();
  }

  unrenderChips(){
    $(`#table-felt-board-bet-player-1`).empty();
  }

  render(gameStarted, current){
    this.renderName(gameStarted, current);
    this.renderTextChips(gameStarted, current);
    this.renderCards();
    (this.streetChipsInPot > 0) ? this.renderChips() : this.unrenderChips();
  }

  resetVars(){
    this.folded = false;
    this.chipsInPot = 0;
    this.streetChipsInPot = 0;
    this.hand = [];
    this.revealed = this.reveal
  }
}