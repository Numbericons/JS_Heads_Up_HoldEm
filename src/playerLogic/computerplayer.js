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
    let promptSelect = document.querySelector(".table-actions-prompt");
    promptSelect.innerText = input;
  }

  promptAction(to_call) {
  }

  genBetRaise(to_call, stack, pot){
    let randNum = Math.random() * stack * to_call / pot;
    debugger
    if (randNum < to_call / pot) {
      return ['betRaise', pot * .5]
    } else if (randNum > to_call / pot * 2) {
      return ['betRaise', pot * 2]
    } else {
      return ['betRaise', randNum]
    }
  }

  // genBetRaise(to_call, stack, pot){
  //   // let randNum = Math.random()
  //   if (to_call === 0) {
  //     let bet = randNum * stack;
  //     return ['betRaise', bet];
  //   } else {
  //     let raise = randNum * stack;
  //     if (raise < to_call * 2) raise = to_call * 2;
  //     return ['betRaise', raise];
  //   }
  // }
  
  promptResponse(to_call, stack, pot){
    debugger
    let betFactor;
    (to_call === 0) ? betFactor = 1 : betFactor = to_call;
    let randNum = Math.random() * betFactor / pot;
    if (randNum < .33333 ) {
      if (betFactor > 0) {
        return ['fold'];
      } else {
        // if (randNum < .16666) {
          return ['check'];
        // } else {
          // return this.genBetRaise(to_call, stack, pot);
        // }
      }
    } else if (randNum < .6666) {
      if (betFactor > 0) {
        return ['call'];
      } else {
        return ['check'];
      }
    } else {
      if (betFactor === 0) {
        return this.genBetRaise(betFactor, stack, pot);
      } else if (betFactor < .5) {
        return ['call']
      } else {
        return this.genBetRaise(betFactor, stack, pot);
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