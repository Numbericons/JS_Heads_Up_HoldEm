export default class ComputerPlayer {
  constructor(position, chipstack) {
    this.position = position;
    this.chipstack = chipstack;
    this.folded = false;
    this.chipsInPot = 0;
    this.streetChipsInPot = 0;
    this.hand = [];
    this.comp = true;
    this.revealed = false;
    (position === 'sb') ? this.side = 'right' : this.side = 'left';
    (this.side === 'right') ? this.name = 'Mike McDermott' : this.name = 'Teddy KGB';
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
    //   this.promptText(`Enter 'check', 'fold', or 'bet' will bet the amount in the box to the right`)
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

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async promptResponse(to_call, stack, pot){
    await this.sleep(2000).then(this.resolvePrompt(to_call, stack, pot));
  }

  async resolvePrompt(to_call, stack, pot){
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
      this.streetChipsInPot += to_call;
      return to_call;
    } else {
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
    playerChips.innerText = `$${this.chipstack} chips`
  }

  playerCards() {
    if (this.hand[0]) {
      let playerCard1 = document.querySelector(`.player-info-${this.side}-cards-1`);
      let playerCard2 = document.querySelector(`.player-info-${this.side}-cards-2`);
      this.hand[0].render(playerCard1, "54%", "89%", this.revealed);
      this.hand[1].render(playerCard2, "54%", "89%", this.revealed);
    }
  }

  render() {
    this.playerName();
    this.playerChips();
    this.playerCards();
    $(`.table-felt-board-bet-player-2`).text('$' + this.streetChipsInPot);
  }

  resetVars() {
    this.folded = false;
    this.chipsInPot = 0;
    this.hand = [];
    this.revealed = false;
  }
}