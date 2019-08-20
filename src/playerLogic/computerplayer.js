export default class ComputerPlayer {
  constructor(position, chipstack) {
    this.position = position;
    this.chipstack = chipstack;
    this.folded = false;
    this.chipsInPot = 0;
    this.hand = [];
    this.comp = true;
    (position === 'sb') ? this.side = 'right' : this.side = 'left';
    (this.side === 'right') ? this.name = 'Seat 1' : this.name = 'Seat 2';
  }

  text(input) {
    let textSelect = document.querySelector(".table-actions-text");
    textSelect.innerText = input;
  }

  promptText(input) {
    // let promptSelect = document.querySelector(".table-actions-prompt");
    // promptSelect.innerText = input;
  }

  promptAction(to_call) {
    // this.text(`${this.name}, your hand is ${this.hand[0].rank} ${this.hand[1]}.suit`)
    // if (to_call === 0) {
    //   this.promptText(`${this.name}, enter 'check', 'fold', or 'bet' will bet the amount in the box to the right`)
    // } else {
    //   this.promptText(`It costs ${to_call} to call. Enter 'call', 'fold', 'raise' will raise the amount in the box to the right`)
    // }
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
      return 0;
    } else if (textInput === 'fold') {
      this.folded = true;
      return null;
    } else if (textInput === 'call') {
      this.chipstack -= to_call;
      this.chipsInPot += to_call;
      return to_call;
    } else {
      this.chipstack -= betInput + sb;
      this.chipsInPot += betInput + sb;
      return betInput + sb;
    }
  }

  playerName() {
    let playerName = document.querySelector(`.player-info-chip-text-name-${this.side}`);
    playerName.innerText = `${this.name}`;
  }

  playerChips() {
    let playerChips = document.querySelector(`.player-info-chip-text-chips-${this.side}`);
    playerChips.innerText = `$${this.chipstack} chips`
  }

  playerCards() {
    if (this.hand[0]) {
      let playerCard1 = document.querySelector(`.player-info-cards-${this.side}-1`);
      let playerCard2 = document.querySelector(`.player-info-cards-${this.side}-2`);
      this.hand[0].render(playerCard1, "54%", "97%");
      this.hand[1].render(playerCard2, "54%", "97%");
    }
  }

  render() {
    this.playerName();
    this.playerChips();
    this.playerCards();
  }

  resetVars() {
    this.folded = false;
    this.chipsInPot = 0;
    this.hand = [];
  }
}