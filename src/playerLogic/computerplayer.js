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

  promptAction() {
  }

  maxBetRaise(num, stack) {
    return (num > stack) ? ['betRaise', stack] : ['betRaise', num];
  }

  genBetRaise(to_call, stack, pot){
    let randNum = Math.random() * 2 * pot;   //pot 1000  to_call 500  stack = 5000
    let betRaise;
    if (randNum < to_call / pot) {
      return this.maxBetRaise(pot * .5, stack);
    } else if (randNum > 1.6 * pot) {
      betRaise = pot * Math.random() + pot;
      return this.maxBetRaise(betRaise, stack);
    } else {
      betRaise = (randNum > pot) ? pot : randNum;
      return this.maxBetRaise(betRaise, stack);
    }
  }
  
  promptResponse(to_call, stack, pot){
    let adjToCall;
    // (to_call === 0) ? betFactor = 2 : betFactor = pot / to_call;
    (to_call === 0) ? adjToCall = pot / 2: adjToCall = to_call;
    let randNum = Math.random();
    let potOdds = adjToCall / (adjToCall + pot); 
    // if (randNum < .33333) {
    if (randNum < potOdds) {
      if (to_call > 0) {
        return ['fold'];
      } else {
          return ['check'];
      }
    } else if (randNum < potOdds * 1.5) {
      if (to_call > 0) {
        return ['call'];
      } else {
        return ['check'];
      }
    } else {
        return this.genBetRaise(to_call, stack, pot);
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