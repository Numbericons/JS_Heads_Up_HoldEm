//RandoLongBall
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
    this.check = new Audio('./audio/cardSlide1_check.wav');
  }

  text(input) {
    let textSelect = document.querySelector(".table-actions-text");
    textSelect.innerText = input;
  }

  promptText(input) {
    let promptSelect = document.querySelector(".table-actions-prompt");
    promptSelect.innerText = input;
  }

  promptAction(to_call) {
  }
  genBetRaise(to_call, stack, pot){
    let randNum = Math.random()
    if (to_call === 0) {
      let bet = randNum * stack;
      return ['betRaise', bet];
    } else {
      let raise = randNum * stack;
      if (raise < to_call * 2) raise = to_call * 2;
      return ['betRaise', raise];
    }
  }
  
  promptResponse(to_call, stack, pot){
    let randNum = Math.random()
    if (randNum < .3333) {
      if (to_call > 0) {
        return ['fold'];
      } else {
        if (randNum < .16666) {
          return ['check'];
        } else {
          return this.genBetRaise(to_call, stack, pot);
        }
      }
    } else if (randNum < .6666) {
      if (to_call > 0) {
        return ['call'];
      } else {
        return ['check'];
      }
    } else {
      if (to_call === 0) {
        return this.genBetRaise(to_call, stack, pot);
      } else {
        return ['call']
      }
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
      this.chipstack -= betInput + sb;
      this.chipsInPot += betInput + sb;
      this.streetChipsInPot += betInput + sb;
      return betInput + sb;
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
      this.hand[0].render(playerCard1, [this.cardDims[0]], [this.cardDims[1]], this.revealed);
      this.hand[1].render(playerCard2, [this.cardDims[0]], [this.cardDims[1]], this.revealed);
    }
  }

  render() {
    this.playerName();
    this.playerChips();
    this.playerCards();
    let chipVal = (this.streetChipsInPot > 0) ? '$' + this.streetChipsInPot : "";
    $(`.table-felt-board-bet-player-2`).text(chipVal);
  }

  resetVars() {
    this.folded = false;
    this.chipsInPot = 0;
    this.hand = [];
    this.revealed = false;
  }
}