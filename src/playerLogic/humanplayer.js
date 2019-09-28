import Chipstack from '../pokerLogic/chipstack';
export default class HumanPlayer {
  constructor(position, chipstack, cardDims){
    this.position = position;
    this.chipstack = chipstack;
    this.folded = false;
    this.chipsInPot = 0;
    this.streetChipsInPot = 0;
    this.hand = [];
    this.comp = false;
    this.revealed = true;
    this.cardDims = cardDims;
    (position === 'sb') ? this.side = 'right' : this.side = 'left';
    (this.side === 'right') ? this.name = 'Mike McDermott' : this.name = 'Teddy KGB';
    this.chipsBet = new Audio('https://js-holdem.s3-us-west-1.amazonaws.com/Audio/raise.mp3');
    this.chipsCall = new Audio('https://js-holdem.s3-us-west-1.amazonaws.com/Audio/call.wav');
    this.check = new Audio('https://js-holdem.s3-us-west-1.amazonaws.com/Audio/check.wav');
  }

  promptText(input){
    let promptSelect = document.querySelector(".table-bottom-actions-prompt");
    promptSelect.innerText = input;
  }

  promptAction(to_call){
    if (to_call === 0) {
      this.promptText("")
    } else {
      this.promptText(`$${to_call} to call`)
    }
  }

  resolve_action(to_call, betInput, textInput, sb = 0) {
    if (textInput === 'check') {
      this.check.play();
      return 0;
    } else if (textInput === 'fold') {
      this.folded = true;
      return null;
    } else if (textInput === 'call') {
      this.chipsCall.play();
      this.chipstack -= to_call;
      this.chipsInPot += to_call;
      this.streetChipsInPot += to_call;
      return to_call;
    } else {
      this.chipsBet.play();
      this.chipstack = this.chipstack - betInput + sb;
      this.chipsInPot += betInput - sb;
      this.streetChipsInPot += betInput - sb;
      return betInput - sb; //+
    }
  }

  renderName(gameStarted, current) {
    let playerName = document.querySelector(`#player-info-${this.side}-chip-text-name`);
    playerName.innerText = `${this.name}`;
    if (gameStarted) {
      (current) ? playerName.className = 'glow' : playerName.className = '';
    }
  }

  renderTextChips(gameStarted, current) {
    let playerChips = document.querySelector(`#player-info-${this.side}-chip-text-chips`);
    playerChips.innerText = `$${this.chipstack}`
    if (gameStarted) {
      (current) ? playerChips.className = "glow" : playerChips.className = "";
    }
  }

  renderCards() {
    if (this.hand[0]) {
      let playerCard1 = document.querySelector(`.player-info-${this.side}-cards-1`);
      let playerCard2 = document.querySelector(`.player-info-${this.side}-cards-2`);
      this.hand[0].render(playerCard1, [this.cardDims[0]], [this.cardDims[1]], this.revealed, true);
      this.hand[1].render(playerCard2, [this.cardDims[0]], [this.cardDims[1]], this.revealed, true);
    }
  }

  renderChips() {
    let $stackDiv = $(`.table-felt-board-bet-player-1`);
    let stack = new Chipstack(this.streetChipsInPot, $stackDiv);
    stack.render();
  }

  unrenderChips(){
    let $stackDiv = $(`.table-felt-board-bet-player-1`);
    $stackDiv.empty();
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
  }
}